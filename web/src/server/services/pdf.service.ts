import chromium from '@sparticuz/chromium'
import { chromium as playwrightChromium, type Browser } from 'playwright-core'
import type { JsonObject } from '@/types/resume/json/json-object'
import type { ResumeLanguage } from '@/types/ui/resume-language'
import { PREVIEW_CSS, renderResumeDocument } from '@/server/services/preview.service'

const PDF_RENDER_TIMEOUT_MS = 30_000

let browserPromise: Promise<Browser> | null = null

async function getBrowser(): Promise<Browser> {
  browserPromise ??= playwrightChromium.launch({
    headless: true,
    executablePath: await chromium.executablePath(),
    args: chromium.args,
  })

  return browserPromise
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  let timeoutId: NodeJS.Timeout | undefined

  return await Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs)
    }),
  ]).finally(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  })
}

export async function renderResumePdf(language: ResumeLanguage, resume: JsonObject): Promise<Buffer> {
  const browser = await getBrowser()
  const page = await browser.newPage({
    viewport: {
      width: 1240,
      height: 1754,
    },
  })

  try {
    const html = await renderResumeDocument(resume, language, PREVIEW_CSS)

    await page.setContent(html, {
      waitUntil: 'load',
      timeout: PDF_RENDER_TIMEOUT_MS,
    })
    await page.emulateMedia({ media: 'print' })
    await page.evaluate(async () => {
      if ('fonts' in document && document.fonts) {
        await document.fonts.ready
      }
    })

    const pdf = await withTimeout(
      page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
      }),
      PDF_RENDER_TIMEOUT_MS,
      'PDF generation timed out.',
    )

    return Buffer.from(pdf)
  } finally {
    await page.close().catch(() => {})
  }
}

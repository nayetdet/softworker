import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import type { ChangeEvent, ReactElement } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { PREVIEW_LANGUAGES, type ResumeLanguage } from '@/services/preview.service'
import { getUiStrings } from '@/services/ui-i18n.service'
import { useResumeStore } from '@/stores/resume.store'

export function WorkspaceHeader(): ReactElement {
  const { language, setLanguage } = useResumeStore(
    useShallow((state) => ({
      language: state.language,
      setLanguage: state.setLanguage,
      })),
  )
  const ui = getUiStrings(language)

  return (
    <header className="grid gap-4 border-b border-border/70 bg-card px-4 py-5 sm:px-5 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,18rem)] lg:items-end">
      <div className="space-y-3">
        <a
          href="https://github.com/nayetdet/softworker"
          target="_blank"
          rel="noreferrer"
          aria-label={ui.repoAriaLabel}
          className="inline-flex max-w-full items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.12em] text-primary transition-colors hover:text-primary/80"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
            <path d="M12 2C6.475 2 2 6.58 2 12.25c0 4.53 2.865 8.37 6.84 9.72.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.12-1.52-1.12-1.52-.92-.64.07-.63.07-.63 1.02.07 1.56 1.07 1.56 1.07.91 1.59 2.4 1.13 2.99.86.09-.67.35-1.13.64-1.39-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.72 0 0 .84-.27 2.75 1.05a9.13 9.13 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.64 1.03 2.76 0 3.95-2.34 4.82-4.57 5.08.36.32.68.95.68 1.92 0 1.39-.01 2.52-.01 2.86 0 .27.18.59.69.49A10.28 10.28 0 0 0 22 12.25C22 6.58 17.525 2 12 2Z" />
          </svg>
          <span>SoftWorker</span>
        </a>
        <div className="space-y-2">
          <h1 className="text-[clamp(1.45rem,1.75vw,1.9rem)] font-extrabold leading-[1.04] tracking-[-0.03em] text-balance">
            {language === 'en_US' ? 'Resume editor' : 'Editor de currículos'}
          </h1>
          <p className="max-w-2xl text-[0.9rem] leading-6 text-muted-foreground sm:text-[0.92rem]">
            {language === 'en_US'
              ? 'Edit the data and track the final document without leaving the same screen.'
              : 'Edite os dados e acompanhe o documento final sem sair da mesma tela.'}
          </p>
        </div>
      </div>

      <div className="grid gap-2 rounded-lg border border-border/70 bg-background/80 p-3 shadow-none sm:p-4">
        <Label htmlFor="language-select" className="text-[0.7rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
          {ui.languageLabel}
        </Label>
        <Select
          id="language-select"
          className="min-h-11 border-border/80 bg-card font-medium"
          value={language}
          onChange={(event: ChangeEvent<HTMLSelectElement>): void => setLanguage(event.target.value as ResumeLanguage)}
        >
          {PREVIEW_LANGUAGES.map((option) => (
            <option key={option.value} value={option.value}>
              {ui.languageNames[option.value]}
            </option>
          ))}
        </Select>
      </div>
    </header>
  )
}

import 'server-only'

import { readFileSync } from 'node:fs'
import path from 'node:path'
import Handlebars from 'handlebars'
import jsonata from 'jsonata'
import { isJsonRecord, parseJsonObject } from '@/utils/json'
import type { JsonObject } from '@/types/resume/json/json-object'
import type { ResumeLanguage } from '@/types/ui/resume-language'

const templateRoot = path.resolve(process.cwd(), '..', 'template')

function readTemplateFile(relativePath: string): string {
  return readFileSync(path.join(templateRoot, relativePath), 'utf8')
}

const rawTemplate = readTemplateFile('index.hbs')
const rawStyle = readTemplateFile('style.css')
const rawI18n = readTemplateFile('i18n.json')
const rawResumeTransform = readTemplateFile('resume.jsonata')
const partialTemplates: Record<string, string> = {
  'partials/item-details': readTemplateFile('partials/item-details.hbs'),
  'partials/item-header': readTemplateFile('partials/item-header.hbs'),
  'views/awards': readTemplateFile('views/awards.hbs'),
  'views/basics': readTemplateFile('views/basics.hbs'),
  'views/certifications': readTemplateFile('views/certifications.hbs'),
  'views/education': readTemplateFile('views/education.hbs'),
  'views/interests': readTemplateFile('views/interests.hbs'),
  'views/languages': readTemplateFile('views/languages.hbs'),
  'views/profiles': readTemplateFile('views/profiles.hbs'),
  'views/projects': readTemplateFile('views/projects.hbs'),
  'views/publications': readTemplateFile('views/publications.hbs'),
  'views/references': readTemplateFile('views/references.hbs'),
  'views/skills': readTemplateFile('views/skills.hbs'),
  'views/summary': readTemplateFile('views/summary.hbs'),
  'views/volunteer': readTemplateFile('views/volunteer.hbs'),
  'views/work': readTemplateFile('views/work.hbs'),
}

export const PREVIEW_CSS = rawStyle

function parseJsonObjectRecord(source: string, label: string): Record<string, JsonObject> {
  const parsed = parseJsonObject(source, `${label} must be a JSON object.`)
  const result: Record<string, JsonObject> = {}

  for (const [key, value] of Object.entries(parsed)) {
    if (!isJsonRecord(value)) {
      throw new Error(`${label} entries must be JSON objects.`)
    }

    result[key] = value
  }

  return result
}

const previewTranslations = parseJsonObjectRecord(rawI18n, 'Preview translations')
const resumeTransformExpression = jsonata(rawResumeTransform)

for (const [name, source] of Object.entries(partialTemplates)) {
  Handlebars.registerPartial(name, source)
}

const resumeTemplate = Handlebars.compile(rawTemplate)

export async function renderResumeDocument(resume: JsonObject, language: ResumeLanguage, css: string = PREVIEW_CSS): Promise<string> {
  const i18n = previewTranslations[language] ?? previewTranslations.pt_BR
  const context = await resumeTransformExpression.evaluate({
    i18n,
    resume,
  })

  if (!isJsonRecord(context)) {
    throw new Error('Resume transform must return a JSON object.')
  }

  return resumeTemplate({
    ...context,
    css,
  })
}

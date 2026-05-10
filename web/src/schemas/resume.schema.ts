import { z } from 'zod'
import type { JsonObject } from '@/types/resume/json/json-object'
import type { ResumeLanguage } from '@/types/ui/resume-language'
import { mapValidationIssues } from '@/mappers/resume/resume.mapper'
import type { ValidationState } from '@/types/resume/validation/state'
import {
  optionalDate,
  optionalString,
  optionalUrl,
  requiredDate,
  requiredEmail,
  requiredString,
  requiredUrl,
  stringList,
} from '@/schemas/resume-field.schema'

const basicsProfileSchema = z.object({
  network: requiredString,
  username: requiredString,
  url: requiredUrl,
})

const basicsLocationSchema = z.object({
  address: optionalString,
  postalCode: optionalString,
  city: requiredString,
  region: optionalString,
  countryCode: optionalString,
})

const basicsSchema = z.object({
  name: requiredString,
  label: requiredString,
  image: optionalUrl,
  email: requiredEmail,
  phone: requiredString,
  url: optionalUrl,
  summary: optionalString,
  location: basicsLocationSchema.optional(),
  profiles: z.array(basicsProfileSchema).optional(),
})

const workSchema = z.object({
  name: requiredString,
  description: optionalString,
  position: requiredString,
  url: optionalUrl,
  location: optionalString,
  startDate: requiredDate,
  endDate: optionalDate,
  summary: optionalString,
  highlights: stringList.optional(),
})

const volunteerSchema = z.object({
  organization: requiredString,
  position: requiredString,
  url: optionalUrl,
  startDate: requiredDate,
  endDate: optionalDate,
  summary: optionalString,
  highlights: stringList.optional(),
})

const educationSchema = z.object({
  institution: requiredString,
  area: requiredString,
  studyType: requiredString,
  url: optionalUrl,
  startDate: requiredDate,
  endDate: optionalDate,
  score: optionalString,
  courses: stringList.optional(),
})

const awardSchema = z.object({
  title: requiredString,
  date: optionalDate,
  awarder: optionalString,
  summary: optionalString,
})

const publicationSchema = z.object({
  name: requiredString,
  publisher: requiredString,
  releaseDate: optionalDate,
  url: optionalUrl,
  summary: optionalString,
})

const skillSchema = z.object({
  name: requiredString,
  level: optionalString,
  keywords: stringList.optional(),
})

const languageSchema = z.object({
  language: requiredString,
  fluency: optionalString,
})

const interestSchema = z.object({
  name: requiredString,
  keywords: stringList.optional(),
})

const referenceSchema = z.object({
  name: requiredString,
  reference: requiredString,
})

const projectSchema = z.object({
  name: requiredString,
  description: requiredString,
  highlights: stringList.optional(),
  keywords: stringList.optional(),
  startDate: optionalDate,
  endDate: optionalDate,
  url: optionalUrl,
  roles: stringList.optional(),
  entity: optionalString,
  type: optionalString,
})

const certificateSchema = z.object({
  name: requiredString,
  date: optionalDate,
  url: optionalUrl,
  issuer: optionalString,
})

const metaSchema = z.object({
  canonical: optionalUrl,
  version: optionalString,
  lastModified: optionalDate,
})

export const resumeSchema = z.object({
  basics: basicsSchema,
  meta: metaSchema.optional(),
  work: z.array(workSchema).optional(),
  volunteer: z.array(volunteerSchema).optional(),
  education: z.array(educationSchema).optional(),
  awards: z.array(awardSchema).optional(),
  publications: z.array(publicationSchema).optional(),
  skills: z.array(skillSchema).optional(),
  languages: z.array(languageSchema).optional(),
  interests: z.array(interestSchema).optional(),
  references: z.array(referenceSchema).optional(),
  projects: z.array(projectSchema).optional(),
  certificates: z.array(certificateSchema).optional(),
})

export function validateResume(resume: JsonObject, language: ResumeLanguage): ValidationState {
  const result = resumeSchema.safeParse(resume)

  if (result.success) {
    return {
      byPath: {},
      issues: [],
    }
  }

  return mapValidationIssues(result.error.issues, language)
}

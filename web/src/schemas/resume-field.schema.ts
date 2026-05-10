import { z } from 'zod'

export function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const parsed = new Date(`${value}T00:00:00`)
  return !Number.isNaN(parsed.getTime())
}

export const optionalString = z.string().optional()
export const requiredString = z.string().trim().min(1, 'Campo obrigatório.')
export const optionalUrl = z.string().trim().url('URL inválida.').or(z.literal('')).optional()
export const stringList = z.array(z.string())
const emailSchema = z.email('E-mail inválido.')
const urlSchema = z.url('URL inválida.')

export const requiredEmail = z.string().trim().superRefine((value, ctx) => {
  if (value.length === 0) {
    ctx.addIssue({ code: 'custom', message: 'Campo obrigatório.' })
    return
  }

  if (!emailSchema.safeParse(value).success) {
    ctx.addIssue({ code: 'custom', message: 'E-mail inválido.' })
  }
})

export const requiredUrl = z.string().trim().superRefine((value, ctx) => {
  if (value.length === 0) {
    ctx.addIssue({ code: 'custom', message: 'Campo obrigatório.' })
    return
  }

  if (!urlSchema.safeParse(value).success) {
    ctx.addIssue({ code: 'custom', message: 'URL inválida.' })
  }
})

export const requiredDate = z.string().trim().superRefine((value, ctx) => {
  if (value.length === 0) {
    ctx.addIssue({ code: 'custom', message: 'Campo obrigatório.' })
    return
  }

  if (!isValidIsoDate(value)) {
    ctx.addIssue({ code: 'custom', message: 'Data inválida.' })
  }
})

export const optionalDate = z.preprocess(
  (value) => {
    if (value == null || value === '') {
      return undefined
    }

    return value
  },
  z.string().trim().refine(isValidIsoDate, { message: 'Data inválida.' }).optional(),
)

import { getPathKey } from '@/mappers/resume/path.mapper'
import type { ObjectSectionDefinition } from '@/types/resume/sections/object/object-section-definition'
import type { PathPart } from '@/types/resume/json/path-part'
import type { SectionDefinition } from '@/types/resume/sections/shared/section-definition'

export function getSectionKey(path: readonly PathPart[]): string {
  return getPathKey(path)
}

export function getSectionId(sectionKey: string): string {
  return `section-${sectionKey.replaceAll('.', '-')}`
}

export function getSectionHeadingId(sectionKey: string): string {
  return `${getSectionId(sectionKey)}-heading`
}

export function getSectionContentId(sectionKey: string): string {
  return `${getSectionId(sectionKey)}-content`
}

export function isObjectSectionDefinition(
  section: SectionDefinition,
): section is ObjectSectionDefinition {
  return 'key' in section
}

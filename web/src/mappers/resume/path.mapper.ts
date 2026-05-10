import type { PathPart } from '@/types/resume/json/path-part'

export function getPathKey(path: readonly PathPart[]): string {
  return path.join('.')
}

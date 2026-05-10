const JSON_TOKEN_REGEX =
  /("(?:\\.|[^"\\])*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b|\btrue\b|\bfalse\b|\bnull\b|[{},:\[\]]|\s+|[\s\S])/g

export type JsonSourceTokenKind =
  | 'string-key'
  | 'string-value'
  | 'number'
  | 'literal'
  | 'punctuation'
  | 'whitespace'
  | 'text'

export type JsonSourceToken = {
  kind: JsonSourceTokenKind
  value: string
}

export function getJsonSourceTokenClassName(kind: JsonSourceTokenKind): string | undefined {
  switch (kind) {
    case 'string-key':
      return 'text-sky-300'
    case 'string-value':
      return 'text-emerald-300'
    case 'number':
      return 'text-amber-300'
    case 'literal':
      return 'text-violet-300'
    case 'punctuation':
      return 'text-slate-500'
    case 'whitespace':
    case 'text':
      return undefined
  }
}

function getNextNonWhitespaceCharacter(source: string, startIndex: number): string | null {
  for (let index = startIndex; index < source.length; index += 1) {
    const character = source[index]
    if (!/\s/.test(character)) {
      return character
    }
  }

  return null
}

export function tokenizeJsonSource(source: string): JsonSourceToken[] {
  const tokens: JsonSourceToken[] = []

  for (const match of source.matchAll(JSON_TOKEN_REGEX)) {
    const value = match[0]
    const tokenStartIndex = match.index ?? 0
    const nextCharacter = getNextNonWhitespaceCharacter(source, tokenStartIndex + value.length)

    if (value.startsWith('"')) {
      tokens.push({
        kind: nextCharacter === ':' ? 'string-key' : 'string-value',
        value,
      })
      continue
    }

    if (/^-?\d/.test(value)) {
      tokens.push({ kind: 'number', value })
      continue
    }

    if (value === 'true' || value === 'false' || value === 'null') {
      tokens.push({ kind: 'literal', value })
      continue
    }

    if ('{}[],:'.includes(value)) {
      tokens.push({ kind: 'punctuation', value })
      continue
    }

    if (/^\s+$/.test(value)) {
      tokens.push({ kind: 'whitespace', value })
      continue
    }

    tokens.push({ kind: 'text', value })
  }

  return tokens
}

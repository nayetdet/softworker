'use client'

import { useState, type ClipboardEvent, type KeyboardEvent } from 'react'
import { parseListFieldInput } from '@/mappers/resume/fields/list-field.mapper'
import { formatTemplate } from '@/services/resume-i18n.service'

type UseListFieldInputResult = {
  draftValue: string
  setDraftValue: (value: string) => void
  handleRemoveItem: (index: number) => void
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  handlePaste: (event: ClipboardEvent<HTMLInputElement>) => void
  getRemoveAriaLabel: (item: string) => string
}

export function useListFieldInput(
  items: string[],
  onValueChange: (items: string[]) => void,
  removeAriaPrefix: string,
): UseListFieldInputResult {
  const [draftValue, setDraftValue] = useState('')

  function appendItems(rawValue: string): void {
    const nextItems = parseListFieldInput(rawValue)

    if (nextItems.length === 0) {
      return
    }

    onValueChange([...items, ...nextItems])
    setDraftValue('')
  }

  function handleRemoveItem(index: number): void {
    onValueChange(items.filter((_, itemIndex) => itemIndex !== index))
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()
    appendItems(draftValue)
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>): void {
    const pastedText = event.clipboardData.getData('text')

    if (!/[\n,]/.test(pastedText)) {
      return
    }

    event.preventDefault()
    appendItems(draftValue + pastedText)
  }

  function getRemoveAriaLabel(item: string): string {
    return formatTemplate(removeAriaPrefix, { item })
  }

  return {
    draftValue,
    getRemoveAriaLabel,
    setDraftValue,
    handleRemoveItem,
    handleKeyDown,
    handlePaste,
  }
}

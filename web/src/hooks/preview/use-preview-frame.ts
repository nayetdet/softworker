'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'

export const A4_WIDTH = 794
const A4_HEIGHT = 1123

function getContentHeight(documentRef: Document): number {
  return Math.max(A4_HEIGHT, documentRef.documentElement.scrollHeight, documentRef.body?.scrollHeight ?? 0)
}

type UsePreviewFrameResult = {
  containerRef: RefObject<HTMLDivElement | null>
  contentHeight: number
  scale: number
  handleLoad: () => void
}

export function usePreviewFrame(previewFrameRef: RefObject<HTMLIFrameElement | null>): UsePreviewFrameResult {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [contentHeight, setContentHeight] = useState(A4_HEIGHT)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const element = containerRef.current

    if (!element || typeof ResizeObserver === 'undefined') {
      return
    }

    const updateScale = () => {
      setScale(Math.min(1, element.clientWidth / A4_WIDTH))
    }

    updateScale()

    const observer = new ResizeObserver(updateScale)
    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])

  function handleLoad(): void {
    const iframe = previewFrameRef.current
    const documentRef = iframe?.contentDocument ?? null

    if (!documentRef) {
      return
    }

    setContentHeight(getContentHeight(documentRef))
  }

  return {
    containerRef,
    contentHeight,
    scale,
    handleLoad,
  }
}

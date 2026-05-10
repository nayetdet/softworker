'use client'

import { cn } from '@/lib/utils'
import { getJsonSourceTokenClassName, type JsonSourceToken } from '@/mappers/resume/source/json-source-highlight'
import type { WorkspaceViewModel } from '@/stores/workspace.store'
import { useSourceEditor } from '@/hooks/workspace/source/use-source-editor'
import { Textarea } from '@/components/ui/textarea'

type SourceEditorProps = {
  workspace: WorkspaceViewModel
}

export function SourceEditor({ workspace }: SourceEditorProps): React.JSX.Element {
  const { highlightedJson, hasErrors, scrollLeft, scrollTop, handleChange, handleScroll } = useSourceEditor(workspace)

  return (
    <section className="grid min-h-0 gap-4 overflow-auto p-3 sm:p-4">
      {workspace.jsonStatusMessage ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/8 px-3 py-2 text-sm text-destructive">
          {workspace.jsonStatusMessage}
        </div>
      ) : null}

      <div
        className={cn(
          'relative min-h-[42vh] overflow-hidden rounded-xl border border-slate-800/90 bg-slate-950 shadow-inner',
          hasErrors ? 'border-destructive/70' : 'focus-within:ring-2 focus-within:ring-emerald-400/40',
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden px-4 py-3 font-mono text-[0.8rem] leading-6"
        >
          <div
            className="min-h-full whitespace-pre-wrap break-words text-slate-100"
            style={{
              transform: `translate(${-scrollLeft}px, ${-scrollTop}px)`,
              willChange: 'transform',
            }}
          >
            <pre className="m-0 whitespace-pre-wrap break-words">
              {highlightedJson.map((token: JsonSourceToken, index: number) => {
                const className = getJsonSourceTokenClassName(token.kind)

                if (!className) {
                  return token.value
                }

                return (
                  <span key={`${index}-${token.value}`} className={className}>
                    {token.value}
                  </span>
                )
              })}
            </pre>
          </div>
        </div>

        <Textarea
          id="resume-source"
          aria-label={workspace.ui.sourceEditorAriaLabel}
          spellCheck={false}
          value={workspace.jsonDraft}
          onScroll={handleScroll}
          onChange={handleChange}
          className="relative z-10 h-[42vh] min-h-[42vh] w-full resize-none overflow-auto rounded-none border-0 bg-transparent px-4 py-3 font-mono text-[0.8rem] leading-6 text-transparent caret-emerald-300 outline-none ring-0 shadow-none selection:bg-emerald-400/25 selection:text-transparent focus-visible:ring-0 sm:min-h-[50vh] lg:min-h-[58vh] xl:min-h-[calc(100vh-15rem)]"
          style={{
            backgroundColor: 'transparent',
            WebkitTextFillColor: 'transparent',
            caretColor: 'rgb(110 231 183)',
          }}
        />
      </div>
    </section>
  )
}

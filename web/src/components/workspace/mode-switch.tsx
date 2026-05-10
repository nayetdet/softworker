'use client'

import type { WorkspaceViewModel } from '@/stores/workspace.store'
import { useWorkspaceModeSwitch } from '@/hooks/workspace/use-workspace-mode-switch'

type WorkspaceModeSwitchProps = {
  workspace: WorkspaceViewModel
}

export function WorkspaceModeSwitch({ workspace }: WorkspaceModeSwitchProps): React.JSX.Element {
  const { ui } = workspace
  const { handleFormModeClick, handleResetClick, handleSourceModeClick } = useWorkspaceModeSwitch(ui.resetConfirm)

  return (
    <section className="flex flex-col gap-3 border-b border-border/70 bg-card px-4 py-4 sm:px-5 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <span className="block text-[0.7rem] font-extrabold uppercase tracking-[0.08em] text-primary">
          {ui.modeLabel}
        </span>
        <strong className="mt-1 block text-[0.88rem] font-semibold leading-5 text-foreground sm:text-[0.92rem] sm:leading-6">
          {ui.modeDescription}
        </strong>
      </div>

      <div className="flex w-full items-center gap-2 rounded-3xl border border-border/70 bg-gradient-to-b from-background/90 to-muted/15 p-2 shadow-[inset_0_1px_0_rgb(255_255_255/0.6),0_1px_2px_rgb(15_23_42/0.04)] sm:w-auto sm:p-2.5">
        <div
          role="tablist"
          aria-label={ui.modeLabel}
          className="grid h-11 min-w-0 flex-1 grid-cols-2 overflow-hidden rounded-2xl border border-border/70 bg-background/90 text-muted-foreground shadow-[inset_0_1px_2px_rgb(15_23_42/0.04)] sm:h-10 sm:w-[12.5rem]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={workspace.mode === 'form'}
            className={`inline-flex h-full min-w-0 cursor-pointer items-center justify-center whitespace-nowrap border-r border-border/70 px-2 text-center text-[0.8rem] font-semibold leading-none tracking-[-0.01em] transition-colors duration-200 sm:px-3 sm:text-[0.9rem] ${
              workspace.mode === 'form'
                ? 'bg-primary text-primary-foreground'
                : 'bg-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            }`}
            onClick={handleFormModeClick}
          >
            {ui.modeForm}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={workspace.mode === 'source'}
            className={`inline-flex h-full min-w-0 cursor-pointer items-center justify-center whitespace-nowrap px-2 text-center text-[0.8rem] font-semibold leading-none tracking-[-0.01em] transition-colors duration-200 sm:px-3 sm:text-[0.9rem] ${
              workspace.mode === 'source'
                ? 'bg-primary text-primary-foreground'
                : 'bg-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            }`}
            onClick={handleSourceModeClick}
          >
            {ui.modeSource}
          </button>
        </div>
        <button
          type="button"
          className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border/80 bg-background text-muted-foreground shadow-none transition-colors hover:border-border hover:bg-accent/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={handleResetClick}
          aria-label={ui.resetAriaLabel}
          title={ui.resetTitle}
        >
          <span aria-hidden="true" className="text-[1rem] leading-none">
            ↻
          </span>
        </button>
      </div>
    </section>
  )
}

'use client'

import { useWorkspaceViewModel } from '@/stores/workspace.store'
import { PreviewPanel } from '@/components/preview/preview-panel'
import { SourceEditor } from '@/components/workspace/source-editor'
import { StatusAlert } from '@/components/feedback/status-alert'
import { WorkspaceHeader } from '@/components/workspace/header'
import { WorkspaceModeSwitch } from '@/components/workspace/mode-switch'
import { WorkspaceSections } from '@/components/workspace/sections/workspace-sections'
import { Card } from '@/components/ui/card'
import { useWorkspacePersistence } from '@/hooks/workspace/use-workspace-persistence'

function Home(): React.JSX.Element {
  useWorkspacePersistence()
  const workspace = useWorkspaceViewModel()

  return (
    <main className="min-h-screen px-2 py-2 sm:px-3 sm:py-3 xl:px-4 xl:py-4">
      <div className="mx-auto grid max-w-[1888px] gap-3 lg:gap-4 xl:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] xl:items-start">
        <Card className="grid min-h-0 min-w-0 overflow-hidden border-border/80 bg-card xl:grid-rows-[auto_auto_minmax(0,1fr)]">
          <WorkspaceHeader workspace={workspace} />
          <StatusAlert workspace={workspace} />
          <WorkspaceModeSwitch workspace={workspace} />

          {workspace.mode === 'form' ? (
            <WorkspaceSections workspace={workspace} />
          ) : (
            <SourceEditor workspace={workspace} />
          )}
        </Card>

        <PreviewPanel workspace={workspace} />
      </div>
    </main>
  )
}

export default Home

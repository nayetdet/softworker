"use client";

import Editor from "react-simple-code-editor";
import { cn } from "@/lib/utils";
import {
  getJsonSourceTokenClassName,
  tokenizeJsonSource,
  type JsonSourceToken,
} from "@/mappers/resume/source/json-source-highlight";
import type { WorkspaceViewModel } from "@/stores/workspace.store";
import { useSourceEditor } from "@/hooks/workspace/source/use-source-editor";

type SourceEditorProps = {
  workspace: WorkspaceViewModel;
};

export function SourceEditor({
  workspace,
}: SourceEditorProps): React.JSX.Element {
  const { hasErrors, handleValueChange } = useSourceEditor(workspace);

  return (
    <section className="grid min-h-0 gap-4 overflow-auto p-3 sm:p-4">
      {workspace.jsonStatusMessage ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/8 px-3 py-2 text-sm text-destructive">
          {workspace.jsonStatusMessage}
        </div>
      ) : null}

      <div
        className={cn(
          "relative h-[42vh] overflow-hidden rounded-xl border border-slate-800/90 bg-slate-950 shadow-inner sm:h-[50vh] lg:h-[58vh] xl:h-[calc(100vh-15rem)]",
          hasErrors
            ? "border-destructive/70"
            : "focus-within:ring-2 focus-within:ring-emerald-400/40",
        )}
      >
        <Editor
          value={workspace.jsonDraft}
          onValueChange={handleValueChange}
          highlight={(source) => renderHighlightedJson(source)}
          padding={16}
          textareaId="resume-source"
          textareaClassName="!outline-none selection:!bg-emerald-400/25"
          preClassName="selection:!bg-emerald-400/25"
          tabSize={2}
          insertSpaces
          ignoreTabKey={false}
          aria-label={workspace.ui.sourceEditorAriaLabel}
          placeholder={workspace.jsonDraft.length === 0 ? "{}" : undefined}
          style={{
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
            fontSize: "0.8rem",
            lineHeight: "1.5rem",
            height: "100%",
            backgroundColor: "rgb(2 6 23)",
            color: "rgb(241 245 249)",
            caretColor: "rgb(110 231 183)",
            overflow: "auto",
          }}
          className="h-full w-full overflow-auto rounded-none bg-slate-950 text-slate-100"
          onKeyDown={(event) => {
            if (event.key === "Tab") {
              event.stopPropagation();
            }
          }}
        />
      </div>
    </section>
  );
}

function renderHighlightedJson(source: string): React.JSX.Element {
  const highlightedJson = tokenizeJsonSource(source);

  return (
    <>
      {highlightedJson.map((token: JsonSourceToken, index: number) => {
        const className = getJsonSourceTokenClassName(token.kind);

        if (!className) {
          return <span key={`${index}-${token.value}`}>{token.value}</span>;
        }

        return (
          <span key={`${index}-${token.value}`} className={className}>
            {token.value}
          </span>
        );
      })}
    </>
  );
}

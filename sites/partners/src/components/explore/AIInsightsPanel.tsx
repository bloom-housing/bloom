import { Button } from "@bloom-housing/ui-seeds"
import Markdown from "markdown-to-jsx"

interface AiInsightsPanelProps {
  insight: string
  isLoading?: boolean
  error?: string | null
  onRegenerate?: () => void
}

export const AiInsightsPanel = ({
  insight,
  isLoading,
  error,
  onRegenerate,
}: AiInsightsPanelProps) => {
  const markdownContent = insight

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full rounded-lg p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-sm text-gray-600">Generating insights...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full rounded-lg p-6">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-sm text-gray-700 text-center mb-4">{error}</p>
        {onRegenerate && <Button onClick={onRegenerate}>Try Again</Button>}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full w-full rounded-lg p-6">
      {/* Header with regenerate button */}
      {onRegenerate && insight && (
        <div className="flex justify-end mb-2">
          <button
            onClick={onRegenerate}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
            title="Regenerate insights"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Regenerate
          </button>
        </div>
      )}

      {/* Markdown Content */}
      <div className="markdown-content mb-6 text-sm text-gray-700 leading-relaxed">
        <Markdown
          options={{
            overrides: {
              h1: {
                component: "h3",
                props: {
                  className: "text-base font-semibold text-gray-900 mb-3 mt-4 first:mt-0",
                },
              },
              h2: {
                component: "h4",
                props: {
                  className: "text-sm font-semibold text-gray-900 mb-2 mt-3",
                },
              },
              h3: {
                component: "h5",
                props: {
                  className: "text-sm font-semibold text-gray-900 mb-2 mt-2",
                },
              },
              p: {
                props: {
                  className: "text-sm text-gray-700 leading-relaxed mb-3",
                },
              },
              ul: {
                props: {
                  className: "text-sm text-gray-700 space-y-2 mb-3 list-disc pl-5",
                },
              },
              ol: {
                props: {
                  className: "text-sm text-gray-700 space-y-2 mb-3 list-decimal pl-5",
                },
              },
              li: {
                props: {
                  className: "text-sm text-gray-700 leading-relaxed",
                  style: { display: "list-item" },
                },
              },
              strong: {
                props: {
                  className: "font-semibold text-gray-900",
                },
              },
              em: {
                props: {
                  className: "italic text-gray-700",
                },
              },
            },
          }}
        >
          {markdownContent}
        </Markdown>
      </div>
      <p className="text-xs font-semibold">
        This content was created using Generative AI and may contain errors or incorrect
        information.
      </p>
    </div>
  )
}

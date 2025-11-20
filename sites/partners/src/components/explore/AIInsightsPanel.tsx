import { Button } from "@bloom-housing/ui-seeds"
import Markdown from "markdown-to-jsx"

interface AiInsightsPanelProps {
  insight?: string
  isLoading?: boolean
  error?: string | null
  onRegenerate?: () => void
}

const defaultMarkdownContent = `
# Executive summary

Significant housing-jobs mismatches exist among East Bay affordable housing applicants, with 52.7% commuting between different cities for work.

## Key numbers:

- **Cross-city commuters:** 7,005 applicants (52.7%)
- **Oakland residential dominance:** 5,129 applicants (38.6%)
- **Central Corridor employment concentration:** 3,663 workers (52.2%)

# Data summary

## Highest Demand:

Central Corridor (Oakland-Berkeley-Alameda) with 5,997 applicants (45.4%)

## Distribution patterns:

- **Residential:** Central Corridor (45.1%), Peninsula Transition (10.0%), Southern Cluster (11.4%)
- **Employment:** Central Corridor (52.2%), Southern Cluster (22.0%), Peninsula Transition (10.0%)
- **Commute:** 52.7% work outside their residential city, 79.5% live in BART-accessible areas

# Cross-analysis:

- Same-city living and working: 6,288 applicants (47.3%)
- Cross-cluster commuting: 4,278 applicants (32.2%)
- Largest commute flow: 1,278 from Central Corridor to Southern Cluster
- BART accessibility: 10,574 applicants (79.5%)
`

export const AiInsightsPanel = ({
  insight,
  isLoading,
  error,
  onRegenerate,
}: AiInsightsPanelProps) => {
  const markdownContent = insight || defaultMarkdownContent

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
      <div className="markdown-content mb-6">
        <Markdown
          options={{
            overrides: {
              h1: {
                component: "h3",
                props: {
                  className: "text-xl font-semibold text-gray-900 mb-4 mt-6 first:mt-0",
                },
              },
              h2: {
                component: "h4",
                props: {
                  className: "text-base font-semibold text-gray-900 mb-3 mt-4",
                },
              },
              p: {
                props: {
                  className: "text-sm text-gray-700 leading-relaxed mb-4",
                },
              },
              ul: {
                props: {
                  className: "text-sm text-gray-700 space-y-2 mb-4",
                },
              },
              li: {
                props: {
                  className: "ml-4",
                },
              },
            },
          }}
        >
          {markdownContent}
        </Markdown>
      </div>

      {/* Chat Interface */}
      {/* <div className="mt-auto pt-4 border-t-2 border-dashed border-blue-300">
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
            <h4 className="font-medium text-gray-900 flex items-center">
              <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 mr-2" />
              <span className="text-sm">Ask for more insights</span>
            </h4>
          </div>
          <ChatInterface />
        </div>
      </div> */}
    </div>
  )
}

import Markdown from "markdown-to-jsx"

const markdownContent = `
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

export const AiInsightsPanel = () => {
  return (
    <div className="flex flex-col h-full w-full rounded-lg p-6">
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

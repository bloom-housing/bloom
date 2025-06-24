import ChatInterface from "./ChatInterface"
import LightBulbIcon from "@heroicons/react/24/solid/LightBulbIcon"
import ChatBubbleOvalLeftEllipsisIcon from "@heroicons/react/24/solid/ChatBubbleOvalLeftEllipsisIcon"

const InsightBox = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="w-full flex flex-row rounded-lg border border-blue-200">
      <div className="h-full w-12 flex flex-col justify-start items-center py-4 px-2 ">
        <div className="flex items-center justify-center h-8 w-8 bg-blue-100 rounded-lg">
          <LightBulbIcon className="h-4" />
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-medium text-blue-900 mb-2">{title}</h4>
        <p className="text-sm text-blue-800">{description}</p>
      </div>
    </div>
  )
}

export const AiInsightsPanel = () => {
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>

      {/* Static Insights */}
      <div className="space-y-4 mb-6">
        <InsightBox
          title="Application Trends"
          description="Your community has seen a steady increase in applications over the past year, with a peak in Q2."
        />
        <InsightBox
          title="Household Composition"
          description="Family sizes are well-distributed across unit types, indicating diverse housing needs in
            your community."
        />
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col border border-gray-200 rounded-lg bg-white">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
          <h4 className="font-medium text-gray-900 flex items-center">
            <ChatBubbleOvalLeftEllipsisIcon className="h-6 pr-2" />{" "}
            <p className="text-base">Ask our assistant for help exploring your data</p>
          </h4>
        </div>

        <ChatInterface />
      </div>
    </div>
  )
}

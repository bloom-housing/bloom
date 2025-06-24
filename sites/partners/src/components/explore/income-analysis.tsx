// HouseholdIncomeReport.tsx
import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { reportDataOption1 as reportData } from "../../lib/explore/data-explorer"

export default function HouseholdIncomeReport() {
  const crossTab = reportData.products.incomeHouseholdSizeCrossTab
  const hhSizes = Object.keys(crossTab)
  const amiRanges = Object.keys(crossTab[hhSizes[0]])

  // build data for bars grouped by AMI range
  const chartData = amiRanges.map((range) => {
    const entry: Record<string, string | number> = { amiRange: range }
    hhSizes.forEach((size) => {
      entry[`${size} bedroom`] = crossTab[size][range]
    })
    return entry
  })

  // Add state for highlighted bar
  const [activeBar, setActiveBar] = React.useState<string | null>(null)

  // Handle bar hover
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBarMouseOver = (data: any) => {
    setActiveBar(data.tooltipPayload?.[0]?.dataKey)
  }

  const handleBarMouseOut = () => {
    setActiveBar(null)
  }

  return (
    <div className="w-full flex justify-center bg-gray-100 py-8">
      <div className="p-6 bg-white rounded-lg shadow w-2/3">
        <h2 className="text-2xl font-semibold mb-2">Household self-reported income and size</h2>
        <p className="text-sm text-gray-600 mb-6">
          Below is a summary of applicants’ household size and income.
        </p>

        {/* ─── Chart Section ─────────────────────────────────────────────────── */}
        <div className="w-full h-96 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              onMouseMove={handleBarMouseOver}
              onMouseLeave={handleBarMouseOut}
            >
              <XAxis
                dataKey="amiRange"
                axisLine={false}
                tickLine={false}
                label={{ value: "AMI Range", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                label={{ value: "Number of Applicants", angle: -90, position: "insideLeft" }}
              />
              <ReTooltip
                contentStyle={{ borderRadius: 4, borderColor: "#E5E7EB" }}
                cursor={{ opacity: 0.3 }}
              />
              <Legend verticalAlign="top" height={36} />

              {/* one Bar per household size */}
              {hhSizes.map((size, index) => (
                <Bar
                  key={size}
                  dataKey={`${size} bedroom`}
                  fill={
                    activeBar === `${size} bedroom`
                      ? "#6366f1" // indigo-500
                      : ["#64748b", "#78716c", "#a3a3a3", "#94a3b8"][index] // slate-500, stone-500, neutral-400, slate-400
                  }
                  opacity={activeBar && activeBar !== `${size} bedroom` ? 0.6 : 1}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ─── Table Section ──────────────────────────────────────────────────── */}
        <div className="mt-8">
          <table className="min-w-full divide-y divide-gray-200 border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Income / HH Size
                </th>
                {hhSizes.map((size) => (
                  <th
                    key={size}
                    className="px-4 py-2 text-center text-sm font-medium text-gray-700"
                  >
                    {size}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {amiRanges.map((range) => (
                <tr key={range}>
                  <td className="px-4 py-2 text-sm text-gray-700">{range}</td>
                  {hhSizes.map((size) => (
                    <td key={size} className="px-4 py-2 text-center text-sm text-gray-700">
                      {crossTab[size][range]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

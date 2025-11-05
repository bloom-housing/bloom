import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts"
import { IncomeHouseholdSizeCrossTab } from "../../lib/explore/data-explorer"

interface HouseholdIncomeReportProps {
  chartData: {
    incomeHouseholdSizeCrossTab: IncomeHouseholdSizeCrossTab
  }
}

export default function HouseholdIncomeReport({ chartData }: HouseholdIncomeReportProps) {
  const crossTab = chartData.incomeHouseholdSizeCrossTab
  const hhSizes = Object.keys(crossTab)
  const amiRanges = Object.keys(crossTab[hhSizes[0]] || {})

  // build data for bars grouped by AMI range
  const barChartData = amiRanges.map((range) => {
    const entry: Record<string, string | number> = { amiRange: range }
    hhSizes.forEach((size) => {
      entry[`${size} bedroom`] = crossTab[size]?.[range] || 0
    })
    return entry
  })

  // Transform data for DataTable with AMI ranges as rows and household sizes as columns
  const tableData = amiRanges.map((range) => {
    const rowData: Record<string, string | number> = { amiRange: range }

    // Add count for each household size
    hhSizes.forEach((size) => {
      rowData[`${size} person`] = crossTab[size]?.[range] || 0
    })

    return rowData
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
      <div className="p-6 bg-white rounded-lg shadow w-full">
        <h2 className="text-2xl font-semibold mb-2">Household self-reported income and size</h2>
        <p className="text-sm text-gray-600 mb-6">
          Below is a summary of applicants household size and household income
        </p>
        {barChartData.length === 0 ? (
          <div className="w-full flex justify-center items-center h-64">
            <p className="text-gray-600">No data available for the selected filters.</p>
          </div>
        ) : (
          <>
            <div className="w-full h-3/5 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  barGap={2}
                  barCategoryGap="25%"
                  margin={{ top: 10, bottom: 10 }}
                  onMouseMove={handleBarMouseOver}
                  onMouseLeave={handleBarMouseOut}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis
                    dataKey="amiRange"
                    axisLine={false}
                    tickLine={false}
                    label={{ value: "AMI Range", position: "insideBottom", offset: -6 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    label={{
                      value: "Number of Applicants",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle" },
                      dx: 0,
                    }}
                  />
                  <ReTooltip
                    contentStyle={{ borderRadius: 4, borderColor: "#E5E7EB" }}
                    cursor={{ opacity: 0.3 }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    align="right"
                    formatter={(value) => <span style={{ color: "#374151" }}>{value}</span>}
                  />

                  {/* one Bar per household size */}
                  {hhSizes.map((size, index) => (
                    <Bar
                      key={size}
                      dataKey={`${size} bedroom`}
                      fill={
                        ["#205493", "#0067BE", "#0077DA", "#DAEEFF"][index] // blue-900, blue-700, blue-500, blue-300
                      }
                      opacity={activeBar && activeBar !== `${size} bedroom` ? 0.6 : 1}
                      maxBarSize={24}
                      radius={[4, 4, 0, 0]}
                    >
                      <LabelList
                        dataKey={`${size} bedroom`}
                        position="top"
                        style={{ fontSize: "12px", fill: "#374151" }}
                      />
                    </Bar>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {tableData.length === 0 ? (
              <div className="w-full flex justify-center items-center h-32 mt-6">
                <p className="text-gray-600">No data available for the selected filters.</p>
              </div>
            ) : (
              <div className="mt-6">
                <table className="min-w-full">
                  <thead className="bg-white border-b-0">
                    <tr className="bg-white">
                      <th className="px-4 py-2 text-left text-sm font-bold text-gray-750 bg-white normal-case border-b-0">
                        AMI Range
                      </th>
                      {hhSizes.map((size) => (
                        <th
                          key={size}
                          className="px-4 py-2 text-right text-sm font-bold text-gray-750 bg-white normal-case border-b-0"
                        >
                          {size} person
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row) => (
                      <tr key={String(row.amiRange)} className="bg-white border-t border-gray-450">
                        <td className="px-4 py-2 text-sm text-gray-700">{String(row.amiRange)}</td>
                        {hhSizes.map((size) => (
                          <td key={size} className="px-4 py-2 text-sm text-right text-gray-700">
                            {row[`${size} person`]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  LabelList,
  CartesianGrid,
} from "recharts"
import {
  LocationFrequency,
  AgeFrequency,
  LanguageFrequency,
  SubsidyFrequency,
  AccessibilityFrequency,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import DataTable from "./DataTable"

interface ChartData {
  residentialLocationFrequencies: LocationFrequency[]
  ageFrequencies: AgeFrequency[]
  languageFrequencies: LanguageFrequency[]
  subsidyOrVoucherTypeFrequencies: SubsidyFrequency[]
  accessibilityTypeFrequencies: AccessibilityFrequency[]
}

interface PrimaryApplicantSectionProps {
  chartData: ChartData
}

const BLUE_500 = "#3B82F6"

export default function PrimaryApplicantSection({ chartData }: PrimaryApplicantSectionProps) {
  const {
    ageFrequencies,
    languageFrequencies,
    subsidyOrVoucherTypeFrequencies,
    accessibilityTypeFrequencies,
  } = chartData

  // const [activeBar, setActiveBar] = useState<string | null>(null)

  const charts = [
    {
      title: "Age",
      data: ageFrequencies,
      key: "age",
      tableLabel: "Age",
    },
    {
      title: "Application submission language",
      data: languageFrequencies,
      key: "language",
      tableLabel: "Language",
    },
  ]

  return (
    <div className="w-full flex justify-center bg-gray-100 py-8">
      <div className="p-6 bg-white rounded-lg shadow w-full">
        <h2 className="text-2xl font-semibold mb-2">Primary applicant and household data</h2>
        <p className="text-sm text-gray-600 mb-6">
          The following is a summary of applicant and household data.
        </p>

        {/* ── Grid for 2 bar charts ───────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {charts.map(({ title, data, key, tableLabel }) => (
            <div key={key}>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              {data.length === 0 ? (
                <div className="w-full flex justify-center items-center h-80">
                  <p className="text-gray-600">No data available for the selected filters.</p>
                </div>
              ) : (
                <>
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data} margin={{ top: 30, right: 0, left: 0, bottom: 5 }}>
                        <CartesianGrid stroke="#EFEFEF" horizontal={true} vertical={false} />
                        <XAxis
                          dataKey={key}
                          tick={{ fontSize: 12, fill: "#4B5563" }}
                          tickLine={false}
                          axisLine={false}
                          textAnchor="middle"
                        />
                        <YAxis
                          type="number"
                          tick={{ fontSize: 12, fill: "#4B5563" }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <ReTooltip
                          formatter={(val: number) => [`${val}`, "Count"]}
                          cursor={{ fill: "#CBD5E1", opacity: 0.3 }}
                        />
                        <Bar dataKey="count" fill={BLUE_500} barSize={24} radius={[6, 6, 0, 0]}>
                          <LabelList
                            dataKey="count"
                            position="top"
                            style={{ fontSize: "12px", fill: "#4B5563" }}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <DataTable title={tableLabel} data={data} dataKey={key} />
                </>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {accessibilityTypeFrequencies.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-gray-600">
                No accessibility data available for the selected filters.
              </p>
            </div>
          ) : (
            <DataTable
              title="Accessibility"
              data={accessibilityTypeFrequencies}
              dataKey="accessibilityType"
            />
          )}

          {subsidyOrVoucherTypeFrequencies.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-gray-600">
                No subsidy/voucher data available for the selected filters.
              </p>
            </div>
          ) : (
            <DataTable
              title="Subsidy or voucher"
              data={subsidyOrVoucherTypeFrequencies}
              dataKey="subsidyType"
            />
          )}
        </div>
      </div>
    </div>
  )
}

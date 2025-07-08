import React from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer } from "recharts"
import {
  AccessibilityFrequency,
  AgeFrequency,
  LanguageFrequency,
  LocationFrequency,
  SubsidyFrequency,
} from "../../lib/explore/data-explorer"

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

export default function PrimaryApplicantSection({ chartData }: PrimaryApplicantSectionProps) {
  const {
    residentialLocationFrequencies,
    ageFrequencies,
    languageFrequencies,
    subsidyOrVoucherTypeFrequencies,
    accessibilityTypeFrequencies,
  } = chartData

  // const [activeBar, setActiveBar] = useState<string | null>(null)

  const charts = [
    {
      title: "Residential address location",
      data: residentialLocationFrequencies,
      key: "location",
      tableLabel: "Origin City",
    },
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
      <div className="p-6 bg-white rounded-lg shadow w-2/3">
        <h2 className="text-2xl font-semibold mb-2">Primary applicant and household data</h2>
        <p className="text-sm text-gray-600 mb-6">
          The following is a summary of applicant and household data.
        </p>

        {/* ── Grid for 3 bar charts ───────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {charts.map(({ title, data, key, tableLabel }) => (
            <div key={key}>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <div className="w-full h-64">
                <ResponsiveContainer>
                  <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    // onMouseMove={(e) => setActiveBar(e?.activePayload?.[0]?.payload?.[key] ?? null)}
                    // onMouseLeave={() => setActiveBar(null)}
                  >
                    <XAxis
                      dataKey={key}
                      tick={{ fontSize: 12, fill: "#4B5563" }}
                      tickLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      type="number"
                      tick={{ fontSize: 12, fill: "#4B5563" }}
                      tickLine={false}
                    />
                    <ReTooltip
                      formatter={(val: number) => [`${val}`, "Count"]}
                      cursor={{ fill: "#CBD5E1", opacity: 0.3 }}
                    />
                    <Bar dataKey="count" fill="#1E293B" barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Table */}
              <div className="mt-6">
                <table className="min-w-full divide-y divide-gray-200 border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        {tableLabel}
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                        Count
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.map((d) => (
                      <tr key={d[key]}>
                        <td className="px-4 py-2 text-sm text-gray-700">{d[key]}</td>
                        <td className="px-4 py-2 text-sm text-right text-gray-700">{d.count}</td>
                        <td className="px-4 py-2 text-sm text-right text-gray-700">
                          {(d.percentage * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* ── Subsidy & Accessibility tables ─────────────────────────────── */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Subsidy or voucher */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Subsidy or voucher</h3>
            <table className="min-w-full divide-y divide-gray-200 border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Subsidy</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Count</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {subsidyOrVoucherTypeFrequencies.map((d) => (
                  <tr key={d.subsidyType}>
                    <td className="px-4 py-2 text-sm text-gray-700">{d.subsidyType}</td>
                    <td className="px-4 py-2 text-sm text-right text-gray-700">{d.count}</td>
                    <td className="px-4 py-2 text-sm text-right text-gray-700">
                      {(d.percentage * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Accessibility */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Accessibility</h3>
            <table className="min-w-full divide-y divide-gray-200 border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Type</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Count</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {accessibilityTypeFrequencies.map((d) => (
                  <tr key={d.accessibilityType}>
                    <td className="px-4 py-2 text-sm text-gray-700">{d.accessibilityType}</td>
                    <td className="px-4 py-2 text-sm text-right text-gray-700">{d.count}</td>
                    <td className="px-4 py-2 text-sm text-right text-gray-700">
                      {(d.percentage * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

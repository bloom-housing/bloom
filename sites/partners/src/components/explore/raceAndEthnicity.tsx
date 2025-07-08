import React from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer } from "recharts"
import { EthnicityFrequency, RaceFrequency } from "../../lib/explore/data-explorer"

interface DemographicsSectionProps {
  chartData: {
    raceFrequencies: RaceFrequency[]
    ethnicityFrequencies: EthnicityFrequency[]
  }
}

export default function DemographicsSection({ chartData }: DemographicsSectionProps) {
  const { raceFrequencies, ethnicityFrequencies } = chartData

  // const [activeBar, setActiveBar] = useState<string | null>(null)

  // Normalize chart data
  const maxRace = Math.max(...raceFrequencies.map((d) => d.count))
  const raceChartData = raceFrequencies.map((d) => ({
    ...d,
    max: maxRace,
  }))

  const maxEthnicity = Math.max(...ethnicityFrequencies.map((d) => d.count))
  const ethnicityChartData = ethnicityFrequencies.map((d) => ({
    ...d,
    max: maxEthnicity,
  }))

  return (
    <div className="w-full flex justify-center bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow w-2/3">
        <h2 className="text-2xl font-semibold mb-2">Demographics</h2>
        <p className="text-sm text-gray-600 mb-6">
          Below is a summary of applicant demographics including race and ethnicity.
        </p>

        <div className="w-full h-full flex flex-row gap-6">
          {/* ─── Race Section ─────────────────────────────────────────────────── */}
          <div className="mb-12 w-1/2">
            <h3 className="text-lg font-semibold mb-2">Race</h3>
            <div className="w-full h-64">
              <ResponsiveContainer>
                <BarChart
                  layout="vertical"
                  data={raceChartData}
                  margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
                  // onMouseMove={(e) => setActiveBar(e?.activePayload?.[0]?.payload?.race ?? null)}
                  // onMouseLeave={() => setActiveBar(null)}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="race"
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

            <div className="mt-6">
              <table className="min-w-full divide-y divide-gray-200 border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Race</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                      Count
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {raceFrequencies.map((d) => (
                    <tr key={d.race}>
                      <td className="px-4 py-2 text-sm text-gray-700">{d.race}</td>
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

          {/* ─── Ethnicity Section ────────────────────────────────────────────── */}
          <div className="flex flex-col w-1/2">
            <h3 className="text-lg font-semibold mb-2">Ethnicity</h3>
            <div className="w-full h-48">
              <ResponsiveContainer>
                <BarChart
                  layout="vertical"
                  data={ethnicityChartData}
                  margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
                  // onMouseMove={(e) =>
                  //   setActiveBar(e?.activePayload?.[0]?.payload?.ethnicity ?? null)
                  // }
                  // onMouseLeave={() => setActiveBar(null)}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="ethnicity"
                    tick={{ fontSize: 12, fill: "#4B5563" }}
                    tickLine={false}
                  />
                  <ReTooltip
                    formatter={(val: number) => [`${val}`, "Count"]}
                    cursor={{ fill: "#CBD5E1", opacity: 0.3 }}
                  />

                  <Bar
                    dataKey="count"
                    fill="#1E293B"
                    barSize={16}
                    opacity={1}
                    name="Ethnicity"
                    // onMouseOver={(data: any) => setActiveBar(data.ethnicity)}
                    // onMouseOut={() => setActiveBar(null)}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6">
              <table className="min-w-full divide-y divide-gray-200 border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Ethnicity
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                      Count
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ethnicityFrequencies.map((d) => (
                    <tr key={d.ethnicity}>
                      <td className="px-4 py-2 text-sm text-gray-700">{d.ethnicity}</td>
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
    </div>
  )
}

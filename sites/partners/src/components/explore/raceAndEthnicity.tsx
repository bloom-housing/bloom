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
  RaceFrequency,
  EthnicityFrequency,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import DataTable from "./DataTable"

interface DemographicsSectionProps {
  chartData: {
    raceFrequencies: RaceFrequency[]
    ethnicityFrequencies: EthnicityFrequency[]
  }
}

interface DemographicChartProps {
  title: string
  data: Array<{ count: number; percentage: number; [key: string]: string | number }>
  dataKey: string
}

const BLUE_500 = "#3B82F6"

function DemographicChart({ title, data, dataKey }: DemographicChartProps) {
  return (
    <div className="mb-12 w-1/2">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {data.length === 0 ? (
        <div className="w-full flex justify-center items-center h-64">
          <p className="text-gray-600">No data available for the selected filters.</p>
        </div>
      ) : (
        <>
          <div className="w-full h-64">
            <ResponsiveContainer>
              <BarChart
                layout="vertical"
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid stroke="#EFEFEF" horizontal={false} vertical={true} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 12, fill: "#4B5563" }}
                  tickLine={false}
                  axisLine={false}
                  label={{
                    value: "Count",
                    position: "insideBottom",
                    offset: -10,
                    style: { textAnchor: "middle", fontSize: "12px", fill: "#4B5563" },
                  }}
                />
                <YAxis
                  type="category"
                  dataKey={dataKey}
                  tick={{ fontSize: 12, fill: "##767676" }}
                  tickLine={false}
                  axisLine={false}
                />
                <ReTooltip
                  formatter={(val: number) => [`${val}`, "Count"]}
                  cursor={{ fill: "#CBD5E1", opacity: 0.3 }}
                />

                <Bar dataKey="count" fill={BLUE_500} barSize={24} radius={[0, 4, 4, 0]}>
                  <LabelList
                    dataKey="count"
                    position="right"
                    style={{ fontSize: "12px", fill: "#4B5563" }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <DataTable title={title} data={data} dataKey={dataKey} />
        </>
      )}
    </div>
  )
}

export default function DemographicsSection({ chartData }: DemographicsSectionProps) {
  const { raceFrequencies, ethnicityFrequencies } = chartData

  // Normalize chart data
  const maxRace = Math.max(...raceFrequencies.map((d) => d.count))
  const raceChartData = raceFrequencies.map((d) => ({
    ...d,
    percentage: d.percentage !== undefined ? d.percentage : 0,
    max: maxRace,
  }))

  const maxEthnicity = Math.max(...ethnicityFrequencies.map((d) => d.count))
  const ethnicityChartData = ethnicityFrequencies.map((d) => ({
    ...d,
    percentage: d.percentage !== undefined ? d.percentage : 0,
    max: maxEthnicity,
  }))

  return (
    <div className="w-full flex justify-center bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow  w-full">
        <h2 className="text-2xl font-semibold mb-2">Demographics</h2>
        <p className="text-sm text-gray-600 mb-6">
          Below is a summary of applicant demographics including race and ethnicity.
        </p>

        <div className="w-full h-full flex flex-row gap-6">
          <DemographicChart title="Race" data={raceChartData} dataKey="race" />

          <DemographicChart title="Ethnicity" data={ethnicityChartData} dataKey="ethnicity" />
        </div>
      </div>
    </div>
  )
}

import React from "react"

interface DataTableProps {
  title: string
  data: Array<any>
  dataKey: string
  countLabel?: string
  percentLabel?: string
}

export default function DataTable({
  title,
  data,
  dataKey,
  countLabel = "Count",
  percentLabel = "Percent",
}: DataTableProps) {
  return (
    <div className="mt-6">
      <table className="min-w-full">
        <thead className="bg-white border-b-0">
          <tr className="bg-white">
            <th className="px-4 py-2 text-left text-sm font-bold text-gray-750 bg-white normal-case border-b-0">
              {title}
            </th>
            <th className="px-4 py-2 text-right text-sm font-bold text-gray-750 bg-white normal-case border-b-0">
              {countLabel}
            </th>
            <th className="px-4 py-2 text-right text-sm font-bold text-gray-750 bg-white normal-case border-b-0">
              {percentLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={String(d[dataKey])} className="bg-white border-t border-gray-450">
              <td className="px-4 py-2 text-sm text-gray-700">{String(d[dataKey])}</td>
              <td className="px-4 py-2 text-sm text-right text-gray-700">{d.count}</td>
              <td className="px-4 py-2 text-sm text-right text-gray-700">
                {(d.percentage * 100).toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

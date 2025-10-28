import React from "react"

interface ReportSummaryProps {
  dateRange: string
  totalApplications: number
  totalListings: number
}

export default function ReportSummary({
  dateRange,
  totalApplications,
  totalListings,
}: ReportSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between">
        <div className="flex-1">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">{dateRange}</h3>
          <p className="text-sm font-bold text-gray-750">Date range</p>
        </div>

        <div className="flex-1 flex-row  border-gray-300 border-l-2 pl-6">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {totalApplications.toLocaleString()}
            </h3>
            <p className="text-sm font-bold text-gray-750">Total applications</p>
          </div>
        </div>

        <div className="flex-1 flex-row  border-gray-300 border-l-2 pl-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">{totalListings}</h3>
          <p className="text-sm font-bold text-gray-750">Total listings</p>
        </div>
      </div>
    </div>
  )
}

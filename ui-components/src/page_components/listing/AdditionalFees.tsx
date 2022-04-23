import * as React from "react"

export interface AdditionalFeesProps {
  /** The application fee for the property, rendered in the first block */
  applicationFee?: string
  /** Costs not included in the deposit or application fee, rendered below both blocks */
  costsNotIncluded?: string | React.ReactNode
  /** The deposit amount for the property, rendered in the second block */
  deposit?: string
  strings: {
    sectionHeader: string
    deposit?: string
    depositSubtext?: string[]
    applicationFee?: string
    applicationFeeSubtext?: string[]
  }
}

const AdditionalFees = ({
  deposit,
  applicationFee,
  costsNotIncluded,
  strings,
}: AdditionalFeesProps) => {
  return (
    <div className="info-card bg-gray-100 border-0">
      <p className="info-card__title mb-2">{strings.sectionHeader}</p>
      <div className="info-card__columns text-sm">
        {applicationFee && (
          <div className={`info-card__column ${deposit && "mr-2"}`}>
            <div className="text-base">{strings.applicationFee}</div>
            <div className="text-xl font-bold">{applicationFee}</div>
            {strings.applicationFeeSubtext?.map((appFeeSubtext, index) => (
              <div key={index}>{appFeeSubtext}</div>
            ))}
          </div>
        )}
        {deposit && (
          <div className={`info-card__column ${applicationFee && "ml-2"}`}>
            <div className="text-base">{strings.deposit}</div>
            <div className="text-xl font-bold">{deposit}</div>
            {strings.depositSubtext?.map((depositSubtext, index) => (
              <div key={index}>{depositSubtext}</div>
            ))}
          </div>
        )}
      </div>

      {costsNotIncluded && (
        <p className={`text-sm mt-2 ${(applicationFee || deposit) && `mt-6`}`}>
          {costsNotIncluded}
        </p>
      )}
    </div>
  )
}

export { AdditionalFees as default, AdditionalFees }

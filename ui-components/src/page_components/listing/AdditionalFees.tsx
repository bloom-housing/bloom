import * as React from "react"

export interface AdditionalFeesProps {
  /** The application fee for the property, rendered in the first block */
  applicationFee?: string
  /** The deposit amount for the property, rendered in the second block */
  deposit?: string
  strings: {
    sectionHeader: string
    deposit?: string
    depositSubtext?: string[]
    applicationFee?: string
    applicationFeeSubtext?: string[]
  }
  /** Footer content rendered below both blocks, i.e. utilities included section, strings, or other formatted info  */
  footerContent?: (string | React.ReactNode)[]
}

const AdditionalFees = ({
  deposit,
  applicationFee,
  footerContent,
  strings,
}: AdditionalFeesProps) => {
  if (!deposit && !applicationFee && !strings && footerContent?.length === 0) return <></>
  return (
    <div className="info-card bg-gray-100 border-0">
      <p className="info-card__title mb-2">{strings.sectionHeader}</p>
      <div className="info-card__columns text-sm">
        {applicationFee && (
          <div className={`info-card__column-2 ${deposit && "mr-2"}`}>
            <div className="text-base">{strings.applicationFee}</div>
            <div className="text-xl font-bold">{applicationFee}</div>
            {strings.applicationFeeSubtext?.map((appFeeSubtext, index) => (
              <div key={index}>{appFeeSubtext}</div>
            ))}
          </div>
        )}
        {deposit && (
          <div className={`info-card__column-2 ${applicationFee && "ml-2"}`}>
            <div className="text-base">{strings.deposit}</div>
            <div className="text-xl font-bold">{deposit}</div>
            {strings.depositSubtext?.map((depositSubtext, index) => (
              <div key={index}>{depositSubtext}</div>
            ))}
          </div>
        )}
      </div>
      {footerContent && footerContent?.length > 0 && (
        <div className="info-card__columns text-sm">
          {footerContent?.map((elem, idx) => (
            <div key={`footer_info_${idx}`} className=" info-card__column-2">
              {elem}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { AdditionalFees as default, AdditionalFees }

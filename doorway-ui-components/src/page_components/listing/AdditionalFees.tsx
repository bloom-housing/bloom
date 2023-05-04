import * as React from "react"
import { GridSection, GridCell } from "../../sections/GridSection"
import { InfoCard } from "../../blocks/InfoCard"

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
  const hasFooter = footerContent && footerContent?.length > 0
  if (!deposit && !applicationFee && !hasFooter) return <></>
  return (
    <InfoCard title={strings.sectionHeader} className="bg-gray-100 border-0">
      {(applicationFee || deposit) && (
        <GridSection columns={2} className={`${hasFooter ? "mb-5" : ""}`}>
          {applicationFee && (
            <GridCell>
              <div className="text-base">{strings.applicationFee}</div>
              <div className="text-xl font-bold">{applicationFee}</div>
              {strings.applicationFeeSubtext?.map((appFeeSubtext, index) => (
                <div key={index} className="text-sm">
                  {appFeeSubtext}
                </div>
              ))}
            </GridCell>
          )}
          {deposit && (
            <GridCell>
              <div className="text-base">{strings.deposit}</div>
              <div className="text-xl font-bold">{deposit}</div>
              {strings.depositSubtext?.map((depositSubtext, index) => (
                <div className="text-sm" key={index}>
                  {depositSubtext}
                </div>
              ))}
            </GridCell>
          )}
        </GridSection>
      )}

      {hasFooter && (
        <div className="info-card__columns text-xs">
          {footerContent?.map((elem, idx) => (
            <div key={`footer_info_${idx}`} className="info-card__column-2">
              {elem}
            </div>
          ))}
        </div>
      )}
    </InfoCard>
  )
}

export { AdditionalFees as default, AdditionalFees }

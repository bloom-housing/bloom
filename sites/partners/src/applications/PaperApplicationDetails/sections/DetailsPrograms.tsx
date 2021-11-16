import React, { useContext, useMemo } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ApplicationContext } from "../../ApplicationContext"
import { useSingleListingData } from "../../../../lib/hooks"

type DetailsProgramsProps = {
  listingId: string
}

const DetailsPrograms = ({ listingId }: DetailsProgramsProps) => {
  const { listingDto } = useSingleListingData(listingId)

  const application = useContext(ApplicationContext)

  const listingPrograms = listingDto?.listingPrograms
  const programs = application?.programs

  const hasMetaData = useMemo(() => {
    return !!listingPrograms?.filter((listingProgram) => listingProgram.program?.formMetadata)
      ?.length
  }, [listingPrograms])

  if (!hasMetaData) {
    return null
  }

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("application.details.programs")}
      inset
      columns={2}
    >
      {listingPrograms?.map((listingProgram) => {
        const metaKey = listingProgram?.program?.formMetadata?.key
        const optionDetails = programs?.find((item) => item.key === metaKey)

        return (
          <GridCell key={listingProgram.program.id}>
            <ViewItem
              label={t(`application.programs.${metaKey}.summary`, {
                county: listingDto?.countyCode,
              })}
            >
              {(() => {
                if (!optionDetails?.claimed) return t("t.none")

                const options = optionDetails.options.filter((option) => option.checked)

                return options.map((option) => (
                  <div key={option.key}>
                    <p>
                      {option.key === "preferNotToSay"
                        ? t("t.preferNotToSay")
                        : t(`application.programs.${metaKey}.${option.key}.label`, {
                            county: listingDto?.countyCode,
                          })}
                    </p>
                  </div>
                ))
              })()}
            </ViewItem>
          </GridCell>
        )
      })}
    </GridSection>
  )
}

export { DetailsPrograms as default, DetailsPrograms }

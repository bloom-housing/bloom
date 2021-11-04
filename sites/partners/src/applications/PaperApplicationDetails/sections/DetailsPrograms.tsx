import React, { useContext, useMemo } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ApplicationContext } from "../../ApplicationContext"
import { InputType, AddressCreate } from "@bloom-housing/backend-core/types"
import { DetailsAddressColumns, AddressColsType } from "../DetailsAddressColumns"
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
              label={t(`application.programs.${metaKey}.title`, {
                county: listingDto?.countyCode,
              })}
            >
              {(() => {
                if (!optionDetails?.claimed) return t("t.none")

                const options = optionDetails.options.filter((option) => option.checked)

                return options.map((option) => {
                  const extra = option.extraData?.map((extra) => {
                    if (extra.type === InputType.text)
                      return (
                        <ViewItem
                          key={extra.key}
                          label={t(`application.programs.options.name`, {
                            county: listingDto?.countyCode,
                          })}
                        >
                          {extra.value}
                        </ViewItem>
                      )

                    if (extra.type === InputType.boolean)
                      return (
                        <ViewItem
                          key={extra.key}
                          label={t(`application.programs.options.${extra.key}`, {
                            county: listingDto?.countyCode,
                          })}
                        >
                          {extra.value ? t("t.yes") : t("t.no")}
                        </ViewItem>
                      )

                    if (extra.type === InputType.address)
                      return (
                        <GridSection
                          key={extra.key}
                          subtitle={t(`application.programs.options.address`, {
                            county: listingDto?.countyCode,
                          })}
                          columns={3}
                        >
                          <DetailsAddressColumns
                            type={AddressColsType.preferences}
                            addressObject={extra.value as AddressCreate}
                          />
                        </GridSection>
                      )
                  })

                  return (
                    <div key={option.key}>
                      <p>
                        {t(`application.programs.${metaKey}.${option.key}.label`, {
                          county: listingDto?.countyCode,
                        })}
                      </p>
                      <div className="my-5">{extra}</div>
                    </div>
                  )
                })
              })()}
            </ViewItem>
          </GridCell>
        )
      })}
    </GridSection>
  )
}

export { DetailsPrograms as default, DetailsPrograms }

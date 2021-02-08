import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ApplicationContext } from "../../ApplicationContext"
import { InputType } from "@bloom-housing/backend-core/types"
import { DetailsAddressColumns, AddressColsType } from "../DetailsAddressColumns"
import { useSingleListingData } from "../../../../lib/hooks"

type DetailsPreferencesProps = {
  listingId: string
}

const DetailsPreferences = ({ listingId }: DetailsPreferencesProps) => {
  const { listingDto } = useSingleListingData(listingId)
  const listingPreferences = listingDto?.preferences

  const application = useContext(ApplicationContext)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const preferences = application.preferences as Record<string, any>[]

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("application.details.preferences")}
      inset
      columns={2}
    >
      {listingPreferences?.map((listingPreference) => {
        const optionKey = listingPreference.formMetadata.key
        const optionDetails = preferences.find((item) => item.key === optionKey)

        return (
          <GridCell>
            <ViewItem label={listingPreference.title}>
              {(() => {
                if (!optionDetails.claimed) return t("t.none")

                const options = optionDetails.options.filter((option) => option.checked)

                return options.map((option) => {
                  const extra = option.extraData?.map((extra) => {
                    if (extra.type === InputType.text)
                      return <ViewItem label={extra.key}>{extra.value}</ViewItem>

                    if (extra.type === InputType.boolean)
                      return (
                        <ViewItem label={extra.key}>
                          {extra.value ? t("t.yes") : t("t.no")}
                        </ViewItem>
                      )

                    if (extra.type === InputType.address)
                      return (
                        <GridSection subtitle={extra.key} columns={3}>
                          <DetailsAddressColumns
                            type={AddressColsType.preferences}
                            addressObject={extra.value}
                          />
                        </GridSection>
                      )
                  })

                  return (
                    <div>
                      <p>{option.key}</p>
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

export { DetailsPreferences as default, DetailsPreferences }

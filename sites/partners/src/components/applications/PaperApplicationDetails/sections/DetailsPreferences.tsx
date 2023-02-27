import React, { useContext, useMemo } from "react"
import { t, GridSection, GridCell } from "@bloom-housing/ui-components"
import { ViewItem } from "../../../../../../../detroit-ui-components/src/blocks/ViewItem"
import { ApplicationContext } from "../../ApplicationContext"
import { InputType, AddressCreate } from "@bloom-housing/backend-core/types"
import { DetailsAddressColumns, AddressColsType } from "../DetailsAddressColumns"
import { useSingleListingData } from "../../../../lib/hooks"

type DetailsPreferencesProps = {
  listingId: string
}

const DetailsPreferences = ({ listingId }: DetailsPreferencesProps) => {
  const { listingDto } = useSingleListingData(listingId)

  const application = useContext(ApplicationContext)

  const listingPreferences = listingDto?.listingPreferences
  const preferences = application?.preferences

  const hasMetaData = useMemo(() => {
    return !!listingPreferences?.filter(
      (listingPreference) => listingPreference.preference?.formMetadata
    )?.length
  }, [listingPreferences])

  if (!hasMetaData) {
    return null
  }

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("application.details.preferences")}
      inset
      columns={2}
    >
      {listingPreferences?.map((listingPreference) => {
        const metaKey = listingPreference?.preference?.formMetadata?.key
        const optionDetails = preferences.find((item) => item.key === metaKey)

        return (
          <GridCell key={listingPreference.preference.id}>
            <ViewItem
              label={t(`application.preferences.${metaKey}.title`, {
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
                        <ViewItem key={extra.key} label={t("t.name")}>
                          {extra.value}
                        </ViewItem>
                      )

                    if (extra.type === InputType.boolean)
                      return (
                        <ViewItem
                          key={extra.key}
                          label={t(`application.preferences.options.${extra.key}`, {
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
                          subtitle={t(`application.preferences.options.address`, {
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
                        {t(`application.preferences.${metaKey}.${option.key}.label`, {
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

export { DetailsPreferences as default, DetailsPreferences }

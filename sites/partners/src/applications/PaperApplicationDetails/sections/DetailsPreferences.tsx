import React, { useContext, useMemo } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ApplicationContext } from "../../ApplicationContext"
import { InputType, AddressCreate, ApplicationSection } from "@bloom-housing/backend-core/types"
import { DetailsAddressColumns, AddressColsType } from "../DetailsAddressColumns"
import { useSingleListingData } from "../../../../lib/hooks"

type DetailsPreferencesProps = {
  listingId: string
}

const DetailsPreferences = ({ listingId }: DetailsPreferencesProps) => {
  const { listingDto } = useSingleListingData(listingId)

  const application = useContext(ApplicationContext)

  const listingPreferences = listingDto?.listingMultiselectQuestions.filter(
    (question) => question.multiselectQuestion.applicationSection === ApplicationSection.preference
  )
  const preferences = application?.preferences

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("application.details.preferences")}
      inset
      columns={2}
    >
      {listingPreferences?.map((listingPreference) => {
        return (
          <GridCell key={listingPreference.multiselectQuestion.text}>
            <ViewItem label={listingPreference.multiselectQuestion.text}>
              {(() => {
                const appPreference = preferences.filter(
                  (pref) => pref.key === listingPreference.multiselectQuestion.text
                )[0]
                if (!appPreference.claimed) return t("t.none")

                const options = appPreference.options.filter((option) => option.checked)

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

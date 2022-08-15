import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { listingSectionQuestions } from "@bloom-housing/shared-helpers"
import { ApplicationContext } from "../../ApplicationContext"
import { InputType, AddressCreate, ApplicationSection } from "@bloom-housing/backend-core/types"
import { DetailsAddressColumns, AddressColsType } from "../DetailsAddressColumns"
import { useSingleListingData } from "../../../../lib/hooks"

type DetailsMultiselectQuestionsProps = {
  listingId: string
  applicationSection: ApplicationSection
  title: string
}

const DetailsMultiselectQuestions = ({
  title,
  applicationSection,
  listingId,
}: DetailsMultiselectQuestionsProps) => {
  const { listingDto } = useSingleListingData(listingId)

  const application = useContext(ApplicationContext)

  const listingQuestions = listingSectionQuestions(listingDto, applicationSection)

  const questions = application[applicationSection]

  return (
    <GridSection className="bg-primary-lighter" title={title} inset columns={2}>
      {listingQuestions?.map((listingQuestion) => {
        return (
          <GridCell key={listingQuestion.multiselectQuestion.text}>
            <ViewItem label={listingQuestion.multiselectQuestion.text}>
              {(() => {
                const appQuestion = questions.filter(
                  (question) => question.key === listingQuestion.multiselectQuestion.text
                )[0]
                if (!appQuestion?.claimed) return t("t.none")

                const options = appQuestion?.options?.filter((option) => option.checked)

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

export { DetailsMultiselectQuestions as default, DetailsMultiselectQuestions }

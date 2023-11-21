import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { listingSectionQuestions } from "@bloom-housing/shared-helpers"
import { ApplicationContext } from "../../ApplicationContext"
import { InputType, AddressCreate } from "@bloom-housing/backend-core/types"
import { DetailsAddressColumns, AddressColsType } from "../DetailsAddressColumns"
import { useSingleListingData } from "../../../../lib/hooks"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import {
  Listing,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

type DetailsMultiselectQuestionsProps = {
  listingId: string
  applicationSection: MultiselectQuestionsApplicationSectionEnum
  title: string
}

const DetailsMultiselectQuestions = ({
  title,
  applicationSection,
  listingId,
}: DetailsMultiselectQuestionsProps) => {
  const { listingDto } = useSingleListingData(listingId)

  const application = useContext(ApplicationContext)

  const listingQuestions = listingSectionQuestions(
    listingDto as unknown as Listing,
    applicationSection
  )

  if (listingQuestions?.length === 0) {
    return <></>
  }

  const questions = application[applicationSection]

  return (
    <SectionWithGrid heading={title} inset>
      <Grid.Row columns={2}>
        {listingQuestions?.map((listingQuestion) => {
          return (
            <FieldValue
              key={listingQuestion?.multiselectQuestions.text}
              label={listingQuestion?.multiselectQuestions.text}
            >
              {(() => {
                const appQuestion = questions?.find(
                  (question) => question.key === listingQuestion?.multiselectQuestions.text
                )
                if (!appQuestion?.claimed) return t("t.none")

                const options = appQuestion?.options?.filter((option) => option.checked)

                return options.map((option) => {
                  const extra = option.extraData?.map((extra) => {
                    if (extra.type === InputType.text)
                      return (
                        <FieldValue key={extra.key} label={t("t.name")}>
                          <>{extra.value}</>
                        </FieldValue>
                      )

                    if (extra.type === InputType.boolean)
                      return (
                        <FieldValue
                          key={extra.key}
                          label={t(`application.preferences.options.${extra.key}`, {
                            county: listingDto?.listingsBuildingAddress.county,
                          })}
                        >
                          {extra.value ? t("t.yes") : t("t.no")}
                        </FieldValue>
                      )

                    if (extra.type === InputType.address)
                      return (
                        <FieldValue
                          key={extra.key}
                          label={t(`application.preferences.options.address`, {
                            county: listingDto?.listingsBuildingAddress.county,
                          })}
                        >
                          <Grid spacing="lg">
                            <Grid.Row columns={3}>
                              <DetailsAddressColumns
                                type={AddressColsType.preferences}
                                addressObject={extra.value as AddressCreate}
                              />
                            </Grid.Row>
                          </Grid>
                        </FieldValue>
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
            </FieldValue>
          )
        })}
      </Grid.Row>
    </SectionWithGrid>
  )
}

export { DetailsMultiselectQuestions as default, DetailsMultiselectQuestions }

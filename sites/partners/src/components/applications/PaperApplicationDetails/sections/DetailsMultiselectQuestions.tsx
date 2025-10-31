import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { AddressHolder, listingSectionQuestions } from "@bloom-housing/shared-helpers"
import { ApplicationContext } from "../../ApplicationContext"
import { DetailsAddressColumns, AddressColsType } from "../DetailsAddressColumns"
import { useSingleListingData } from "../../../../lib/hooks"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import {
  AddressCreate,
  InputType,
  Listing,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

type DetailsMultiselectQuestionsProps = {
  listingId: string
  applicationSection: MultiselectQuestionsApplicationSectionEnum
  title: string
}

const formatGeocodingValues = (key: string | boolean) => {
  switch (key) {
    case "true":
    case true:
      return t("t.yes")
    case "false":
    case false:
      return t("t.no")
    case "unknown":
      return t("t.error")
    default:
      return t("t.error")
  }
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
            <Grid.Cell key={listingQuestion?.multiselectQuestions.text}>
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
                    const extra = option.extraData
                      ?.sort((a, b) => {
                        if (a.type === InputType.address) return 1
                        if (b.type === InputType.address) return -1
                        return 0
                      })
                      ?.map((extra) => {
                        if (extra.type === InputType.text) {
                          let label = ""
                          let value = extra.value

                          switch (extra.key) {
                            case AddressHolder.Name:
                              label = t(`application.preferences.options.${AddressHolder.Name}`)
                              break
                            case AddressHolder.Relationship:
                              label = t(
                                `application.preferences.options.${AddressHolder.Relationship}`
                              )
                              break
                            case "geocodingVerified":
                              label = t("application.details.preferences.passedAddressCheck")
                              value = formatGeocodingValues(extra.value as string)
                              break
                            default:
                              label = t("t.name")
                          }

                          return (
                            <FieldValue className="my-8" key={extra.key} label={label}>
                              <>{value}</>
                            </FieldValue>
                          )
                        }

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
                              className="field-label-semibold"
                              label={t(`application.preferences.options.qualifyingAddress`, {
                                county: listingDto?.listingsBuildingAddress.county,
                              })}
                            >
                              <Grid spacing="lg">
                                <Grid.Row columns={3}>
                                  <DetailsAddressColumns
                                    type={AddressColsType.preferences}
                                    addressObject={extra.value as AddressCreate}
                                    small
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
            </Grid.Cell>
          )
        })}
      </Grid.Row>
    </SectionWithGrid>
  )
}

export { DetailsMultiselectQuestions as default, DetailsMultiselectQuestions }

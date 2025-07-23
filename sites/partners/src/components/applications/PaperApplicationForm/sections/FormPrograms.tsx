import React from "react"
import { t, FieldGroup } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { useFormContext } from "react-hook-form"
import { getInputType } from "@bloom-housing/shared-helpers"
import { ListingMultiselectQuestion } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../../../shared/SectionWithGrid"

type FormProgramsProps = {
  programs: ListingMultiselectQuestion[]
}

const FormPrograms = ({ programs }: FormProgramsProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid heading={t("application.details.programs")}>
        <Grid.Row columns={2}>
          {programs?.map((listingProgram) => {
            return (
              <Grid.Cell>
                <FieldValue label={listingProgram?.multiselectQuestions?.text}>
                  <fieldset>
                    <FieldGroup
                      fieldGroupClassName="grid grid-cols-1"
                      fieldClassName="ml-0"
                      type={getInputType(listingProgram?.multiselectQuestions?.options)}
                      name={`application.programs.${listingProgram?.multiselectQuestions?.text}`}
                      register={register}
                      fields={listingProgram?.multiselectQuestions?.options?.map((option) => {
                        return {
                          id: `${listingProgram?.multiselectQuestions?.text}-${option.text}`,
                          label: option.text,
                          value: option.text,
                        }
                      })}
                    />
                  </fieldset>
                </FieldValue>
              </Grid.Cell>
            )
          })}
        </Grid.Row>
      </SectionWithGrid>
    </>
  )
}

export { FormPrograms as default, FormPrograms }

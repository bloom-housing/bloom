import React from "react"
import { t, GridSection, GridCell, FieldGroup } from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"
import { useFormContext } from "react-hook-form"
import { getInputType } from "@bloom-housing/shared-helpers"
import { ListingMultiselectQuestion } from "@bloom-housing/backend-core"

type FormProgramsProps = {
  programs: ListingMultiselectQuestion[]
}

const FormPrograms = ({ programs }: FormProgramsProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  return (
    <GridSection title={t("application.details.programs")} separator grid={false}>
      <GridSection columns={2}>
        {programs?.map((listingProgram) => {
          return (
            <GridCell key={listingProgram?.multiselectQuestion?.text}>
              <FieldValue label={listingProgram?.multiselectQuestion?.text}>
                <fieldset>
                  <FieldGroup
                    fieldGroupClassName="grid grid-cols-1"
                    fieldClassName="ml-0"
                    type={getInputType(listingProgram?.multiselectQuestion?.options)}
                    name={`application.programs.${listingProgram?.multiselectQuestion?.text}`}
                    register={register}
                    fields={listingProgram?.multiselectQuestion?.options?.map((option) => {
                      return {
                        id: `${listingProgram?.multiselectQuestion?.text}-${option.text}`,
                        label: option.text,
                        value: option.text,
                      }
                    })}
                  />
                </fieldset>
              </FieldValue>
            </GridCell>
          )
        })}
      </GridSection>
    </GridSection>
  )
}

export { FormPrograms as default, FormPrograms }

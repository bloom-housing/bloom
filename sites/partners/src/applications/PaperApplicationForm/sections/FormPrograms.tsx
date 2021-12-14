import React from "react"
import { t, GridSection, ViewItem, GridCell, FieldGroup } from "@bloom-housing/ui-components"
import { useFormContext } from "react-hook-form"
import { ListingProgram } from "@bloom-housing/backend-core/types"
import { getProgramOptionName, getProgramOptionDescription } from "@bloom-housing/shared-helpers"

type FormProgramsProps = {
  county: string
  programs: ListingProgram[]
}

const FormPrograms = ({ county, programs }: FormProgramsProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  return (
    <GridSection title={t("application.details.programs")} separator grid={false}>
      <GridSection columns={2}>
        {programs?.map((listingProgram) => {
          const metaKey = listingProgram.program?.formMetadata?.key

          return (
            <GridCell key={listingProgram.program.id}>
              <ViewItem
                label={t(`application.programs.${metaKey}.summary`, {
                  county,
                })}
              >
                <fieldset>
                  <FieldGroup
                    fieldGroupClassName="grid grid-cols-1"
                    fieldClassName="ml-0"
                    type="radio"
                    name={`application.programs.${listingProgram?.program.formMetadata?.key}`}
                    register={register}
                    fields={listingProgram?.program.formMetadata?.options?.map((option) => {
                      return {
                        id: `${listingProgram?.program.formMetadata?.key}-${option.key}`,
                        label: t(
                          getProgramOptionName(option.key, listingProgram?.program.formMetadata.key)
                        ),
                        value: option.key,
                      }
                    })}
                  />
                </fieldset>
              </ViewItem>
            </GridCell>
          )
        })}
      </GridSection>
    </GridSection>
  )
}

export { FormPrograms as default, FormPrograms }

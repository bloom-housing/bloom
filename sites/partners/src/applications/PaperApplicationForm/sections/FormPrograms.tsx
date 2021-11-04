import React, { useMemo } from "react"
import {
  Field,
  t,
  ExtraField,
  getPreferenceOrProgramOptionName,
  GridSection,
  ViewItem,
  GridCell,
  SelectOption,
  getExclusiveOptionName,
  getExclusiveKeys,
  setExclusive,
  FormPreferencesType,
} from "@bloom-housing/ui-components"

import { useFormContext } from "react-hook-form"
import { stateKeys } from "@bloom-housing/shared-helpers"
import { Program, FormMetadataExtraData, ListingProgram } from "@bloom-housing/backend-core/types"

type FormProgramsProps = {
  county: string
  programs: ListingProgram[]
  hhMembersOptions?: SelectOption[]
}

const FormPrograms = ({ county, programs, hhMembersOptions }: FormProgramsProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, watch } = formMethods

  const hasMetaData = useMemo(() => {
    return !!programs?.filter((listingPreference) => listingPreference.program?.formMetadata)
      ?.length
  }, [programs])

  const allOptionFieldNames = useMemo(() => {
    const keys = []
    programs?.forEach((listingPreference) =>
      listingPreference.program?.formMetadata?.options.forEach((option) =>
        keys.push(
          getPreferenceOrProgramOptionName(
            option.key,
            listingPreference.program?.formMetadata.key,
            FormPreferencesType.Programs
          )
        )
      )
    )

    return keys
  }, [programs])

  const watchPreferences = watch(allOptionFieldNames)

  const exclusiveKeys = getExclusiveKeys(programs, FormPreferencesType.Programs)

  if (!hasMetaData) {
    return null
  }

  const getOption = (
    optionKey: string | null,
    optionName: string,
    exclusive: boolean,
    extraData: FormMetadataExtraData[],
    program: Program,
    label?: string
  ) => {
    return (
      <React.Fragment key={optionKey}>
        <Field
          id={optionName}
          name={optionName}
          type="checkbox"
          label={
            label ??
            t(`application.programs.${program?.formMetadata?.key}.${optionKey}.label`, {
              county,
            })
          }
          register={register}
          inputProps={{
            onChange: (e) => {
              if (exclusive && e.target.checked) {
                setExclusive(
                  true,
                  setValue,
                  exclusiveKeys,
                  optionName,
                  program,
                  FormPreferencesType.Programs
                )
              }
              if (!exclusive) {
                setExclusive(
                  false,
                  setValue,
                  exclusiveKeys,
                  optionName,
                  program,
                  FormPreferencesType.Programs
                )
              }
            },
          }}
        />
        {watchPreferences[optionName] &&
          extraData?.map((extra) => (
            <ExtraField
              key={extra.key}
              metaKey={program.formMetadata.key}
              optionKey={optionKey}
              extraKey={extra.key}
              type={extra.type}
              register={register}
              hhMembersOptions={hhMembersOptions}
              stateKeys={stateKeys}
              formType={FormPreferencesType.Programs}
            />
          ))}
      </React.Fragment>
    )
  }

  return (
    <GridSection title={t("application.details.programs")} separator grid={false}>
      <GridSection columns={2}>
        {programs?.map((listingPreference) => {
          const metaKey = listingPreference.program?.formMetadata?.key

          return (
            <GridCell key={listingPreference.program.id}>
              <ViewItem
                label={t(`application.programs.${metaKey}.title`, {
                  county,
                })}
              >
                <fieldset className="mt-4">
                  {listingPreference.program?.formMetadata?.options?.map((option) => {
                    return getOption(
                      option.key,
                      getPreferenceOrProgramOptionName(
                        option.key,
                        listingPreference.program?.formMetadata?.key,
                        FormPreferencesType.Programs
                      ),
                      option.exclusive,
                      option.extraData,
                      listingPreference.program
                    )
                  })}

                  {listingPreference.program?.formMetadata &&
                    !listingPreference.program.formMetadata.hideGenericDecline &&
                    getOption(
                      null,
                      getExclusiveOptionName(
                        listingPreference.program?.formMetadata?.key,
                        FormPreferencesType.Programs
                      ),
                      true,
                      [],
                      listingPreference.program,
                      t("application.programs.dontWant")
                    )}
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

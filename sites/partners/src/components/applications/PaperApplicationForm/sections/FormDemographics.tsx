import React, { useEffect, useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { t, Select, FieldGroup, Field } from "@bloom-housing/ui-components"
import { Grid } from "@bloom-housing/ui-seeds"
import {
  ethnicityKeys,
  isKeyIncluded,
  getCustomValue,
  howDidYouHear,
  limitedHowDidYouHear,
  getRaceEthnicityOptions,
} from "@bloom-housing/shared-helpers"
import {
  Demographic,
  RaceEthnicityConfiguration,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../../../shared/SectionWithGrid"

type FormDemographicsProps = {
  formValues: Demographic
  enableLimitedHowDidYouHear: boolean
  disableEthnicityQuestion: boolean
  raceEthnicityConfiguration?: RaceEthnicityConfiguration
  enableSpokenLanguage?: boolean
  visibleSpokenLanguages?: string[]
}

const FormDemographics = ({
  formValues,
  enableLimitedHowDidYouHear,
  disableEthnicityQuestion,
  raceEthnicityConfiguration,
  enableSpokenLanguage,
  visibleSpokenLanguages,
}: FormDemographicsProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, setValue } = formMethods

  const howDidYouHearOptions = useMemo(() => {
    return (enableLimitedHowDidYouHear ? limitedHowDidYouHear : howDidYouHear)?.map((item) => ({
      id: item.id,
      label: t(`application.review.demographics.howDidYouHearOptions.${item.id}`),
      register,
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register])

  const spokenLanguageValue: string = watch("application.demographics.spokenLanguage")

  const getSpokenLanguageOptions = () => {
    const availableLanguages =
      visibleSpokenLanguages && visibleSpokenLanguages.length > 0 ? visibleSpokenLanguages : []
    return availableLanguages
  }

  useEffect(() => {
    if (visibleSpokenLanguages?.length > 0) {
      const selectedOption = formValues.spokenLanguage?.includes("notListed")
        ? "notListed"
        : formValues.spokenLanguage || ""
      setValue("application.demographics.spokenLanguage", selectedOption)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleSpokenLanguages])

  useEffect(() => {
    if (spokenLanguageValue !== "notListed") {
      setValue("application.demographics.spokenLanguageNotListed", "")
    } else {
      const currentNotListedValue = formValues.spokenLanguage?.split(":")[1] || ""
      setValue("application.demographics.spokenLanguageNotListed", currentNotListedValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spokenLanguageValue])

  const raceOptions = useMemo(() => {
    const raceKeys = getRaceEthnicityOptions(raceEthnicityConfiguration)
    if (!raceKeys) return []
    return Object.keys(raceKeys).map((rootKey) => ({
      id: rootKey,
      label: t(`application.review.demographics.raceOptions.${rootKey}`),
      value: rootKey,
      additionalText: rootKey.indexOf("other") >= 0,
      defaultChecked: isKeyIncluded(rootKey, formValues?.race),
      defaultText: getCustomValue(rootKey, formValues?.race),
      subFields: raceKeys[rootKey].map((subKey) => ({
        id: subKey,
        label: t(`application.review.demographics.raceOptions.${subKey}`),
        value: subKey,
        defaultChecked: isKeyIncluded(subKey, formValues?.race),
        additionalText: subKey.indexOf("other") >= 0,
        defaultText: getCustomValue(subKey, formValues?.race),
      })),
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register, raceEthnicityConfiguration])

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid heading={t("application.add.demographicsInformation")}>
        <Grid.Row columns={2}>
          {raceOptions.length > 0 && (
            <Grid.Cell>
              <FieldGroup
                name="race"
                fields={raceOptions}
                type="checkbox"
                register={register}
                groupLabel={t("application.add.race")}
                strings={{
                  description: "",
                }}
              />
            </Grid.Cell>
          )}
          {!disableEthnicityQuestion && (
            <Grid.Cell>
              <Select
                id="application.demographics.ethnicity"
                name="application.demographics.ethnicity"
                placeholder={t("t.selectOne")}
                label={t("application.add.ethnicity")}
                register={register}
                controlClassName="control"
                options={ethnicityKeys}
                keyPrefix="application.review.demographics.ethnicityOptions"
              />
            </Grid.Cell>
          )}
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Cell>
            <FieldGroup
              type="checkbox"
              name="application.demographics.howDidYouHear"
              fields={howDidYouHearOptions}
              register={register}
              groupLabel={t("application.add.howDidYouHearAboutUs")}
              fieldGroupClassName="grid grid-cols-2 mt-4"
            />
          </Grid.Cell>
        </Grid.Row>
        {enableSpokenLanguage && visibleSpokenLanguages?.length > 0 && (
          <Grid.Row columns={2}>
            <Grid.Cell>
              <Select
                id="application.demographics.spokenLanguage"
                name="application.demographics.spokenLanguage"
                label={t("application.review.demographics.spokenLanguageLabel")}
                register={register}
                controlClassName="control"
                options={["", ...getSpokenLanguageOptions()]}
                keyPrefix="application.review.demographics.spokenLanguageOptions"
              />
              {spokenLanguageValue === "notListed" && (
                <Field
                  id="application.demographics.spokenLanguageNotListed"
                  name="application.demographics.spokenLanguageNotListed"
                  label={t("application.review.demographics.spokenLanguageSpecify")}
                  register={register}
                />
              )}
            </Grid.Cell>
          </Grid.Row>
        )}
      </SectionWithGrid>
    </>
  )
}

export { FormDemographics as default, FormDemographics }

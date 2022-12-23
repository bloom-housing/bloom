import React, { useMemo } from "react"
import { useFormContext } from "react-hook-form"
import {
  t,
  GridSection,
  ViewItem,
  GridCell,
  Select,
  FieldGroup,
} from "@bloom-housing/ui-components"
import { ethnicityKeys, raceKeys, howDidYouHear } from "../../../../shared"
import { Demographics } from "@bloom-housing/backend-core/types"

type FormDemographicsProps = {
  formValues: Demographics
}

const FormDemographics = ({ formValues }: FormDemographicsProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  const howDidYouHearOptions = useMemo(() => {
    return howDidYouHear?.map((item) => ({
      id: item.id,
      label: t(`application.review.demographics.howDidYouHearOptions.${item.id}`),
      register,
    }))
  }, [register])

  // Does a key exist in a root field or a sub array
  const isKeyIncluded = (raceKey: string) => {
    let keyExists = false
    formValues?.race?.forEach((value) => {
      if (value.includes(raceKey)) {
        keyExists = true
      }
    })
    return keyExists
  }

  // Get the value of a field that is storing a custom value, i.e. "otherAsian: Custom Race Input"
  const getCustomValue = (subKey: string) => {
    const customValues = formValues?.race?.filter((value) => value.split(":")[0] === subKey)
    return customValues?.length ? customValues[0].split(":")[1]?.substring(1) : ""
  }

  const raceOptions = useMemo(() => {
    return Object.keys(raceKeys).map((rootKey) => ({
      id: rootKey,
      label: t(`application.review.demographics.raceOptions.${rootKey}`),
      value: rootKey,
      additionalText: rootKey.indexOf("other") >= 0,
      defaultChecked: isKeyIncluded(rootKey),
      defaultText: getCustomValue(rootKey),
      subFields: raceKeys[rootKey].map((subKey) => ({
        id: subKey,
        label: t(`application.review.demographics.raceOptions.${subKey}`),
        value: subKey,
        defaultChecked: isKeyIncluded(subKey),
        additionalText: subKey.indexOf("other") >= 0,
        defaultText: getCustomValue(subKey),
      })),
    }))
  }, [register, isKeyIncluded, getCustomValue])

  return (
    <GridSection title={t("application.add.demographicsInformation")} columns={3} separator>
      <GridCell>
        <ViewItem label={t("application.add.race")}>
          <FieldGroup name="race" fields={raceOptions} type="checkbox" register={register} />
        </ViewItem>
      </GridCell>

      <GridCell>
        <ViewItem label={t("application.add.ethnicity")}>
          <Select
            id="application.demographics.ethnicity"
            name="application.demographics.ethnicity"
            placeholder={t("t.selectOne")}
            label={t("application.add.ethnicity")}
            labelClassName="sr-only"
            register={register}
            controlClassName="control"
            options={ethnicityKeys}
            keyPrefix="application.review.demographics.ethnicityOptions"
          />
        </ViewItem>
      </GridCell>

      <GridCell span={2}>
        <ViewItem label={t("application.add.howDidYouHearAboutUs")}>
          <FieldGroup
            type="checkbox"
            name="application.demographics.howDidYouHear"
            fields={howDidYouHearOptions}
            register={register}
            fieldGroupClassName="grid grid-cols-2 mt-4"
          />
        </ViewItem>
      </GridCell>
    </GridSection>
  )
}

export { FormDemographics as default, FormDemographics }

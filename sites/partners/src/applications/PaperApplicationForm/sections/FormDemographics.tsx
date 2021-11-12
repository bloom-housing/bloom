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
import {
  ethnicityKeys,
  raceKeys,
  genderKeys,
  sexualOrientation,
  howDidYouHear,
} from "@bloom-housing/shared-helpers"
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

  console.log(formValues)

  return (
    <GridSection title={t("application.add.demographicsInformation")} columns={3} separator>
      <GridCell>
        <ViewItem label={t("application.add.race")}>
          <FieldGroup
            name="application.demographics.race"
            fields={Object.keys(raceKeys).map((rootKey) => ({
              id: rootKey,
              label: t(`application.review.demographics.raceOptions.${rootKey}`),
              value: rootKey,
              additionalText: rootKey.indexOf("other") >= 0,
              defaultChecked: formValues.race.includes(rootKey),
              subFields: raceKeys[rootKey].map((subKey) => ({
                id: subKey,
                label: t(`application.review.demographics.raceOptions.${subKey}`),
                value: subKey,
                additionalText: subKey.indexOf("other") >= 0,
              })),
            }))}
            type="checkbox"
            register={register}
          />
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

      <GridCell>
        <ViewItem label={t("application.add.gender")}>
          <Select
            id="application.demographics.gender"
            name="application.demographics.gender"
            placeholder={t("t.selectOne")}
            label={t("application.add.gender")}
            labelClassName="sr-only"
            register={register}
            controlClassName="control"
            options={genderKeys}
            keyPrefix="application.review.demographics.genderOptions"
          />
        </ViewItem>
      </GridCell>

      <GridCell>
        <ViewItem label={t("application.add.sexualOrientation")}>
          <Select
            id="application.demographics.sexualOrientation"
            name="application.demographics.sexualOrientation"
            placeholder={t("t.selectOne")}
            label={t("application.add.sexualOrientation")}
            labelClassName="sr-only"
            register={register}
            controlClassName="control"
            options={sexualOrientation}
            keyPrefix="application.review.demographics.sexualOrientationOptions"
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

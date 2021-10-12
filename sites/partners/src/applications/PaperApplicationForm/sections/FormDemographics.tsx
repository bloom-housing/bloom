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

const FormDemographics = () => {
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

  return (
    <GridSection title={t("application.add.demographicsInformation")} columns={3} separator>
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
        <ViewItem label={t("application.add.race")}>
          <Select
            id="application.demographics.race"
            name="application.demographics.race"
            placeholder={t("t.selectOne")}
            label={t("application.add.race")}
            labelClassName="sr-only"
            register={register}
            controlClassName="control"
            options={raceKeys}
            keyPrefix="application.review.demographics.raceOptions"
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

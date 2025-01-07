import React, { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import { t, Select, Textarea, FieldGroup, Field } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import {
  ReservedCommunityType,
  YesNoEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { useReservedCommunityTypeList } from "../../../../lib/hooks"
import { arrayToFormOptions } from "../../../../lib/helpers"
import { FormListing } from "../../../../lib/listings/formTypes"
import SectionWithGrid from "../../../shared/SectionWithGrid"

type CommunityTypeProps = {
  listing?: FormListing
}

const CommunityType = ({ listing }: CommunityTypeProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, watch, errors } = formMethods

  const reservedCommunityType = watch("reservedCommunityTypes.id")

  const [options, setOptions] = useState([])
  const [currentCommunityType, setCurrentCommunityType] = useState(
    listing?.reservedCommunityTypes?.id
  )

  const { data: reservedCommunityTypes = [] } = useReservedCommunityTypeList()

  useEffect(() => {
    const optionsTranslated = reservedCommunityTypes.map((communityType) => {
      return { ...communityType, name: t(`listings.reservedCommunityTypes.${communityType.name}`) }
    })
    setOptions(["", ...arrayToFormOptions<ReservedCommunityType>(optionsTranslated, "name", "id")])
  }, [reservedCommunityTypes])

  useEffect(() => {
    setValue("reservedCommunityTypes.id", currentCommunityType)
  }, [options, setValue, currentCommunityType])

  useEffect(() => {
    if (![listing?.reservedCommunityTypes?.id, undefined, ""].includes(reservedCommunityType)) {
      setCurrentCommunityType(reservedCommunityType)
    }
  }, [reservedCommunityType, listing?.reservedCommunityTypes?.id])

  useEffect(() => {
    if (
      listing &&
      watch("includeCommunityDisclaimerQuestion") === null &&
      listing?.includeCommunityDisclaimer !== null
    ) {
      setValue(
        "includeCommunityDisclaimerQuestion",
        listing?.includeCommunityDisclaimer ? YesNoEnum.yes : YesNoEnum.no
      )
    }
  }, [setValue, listing?.includeCommunityDisclaimer, watch, listing])

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid
        heading={t("listings.sections.communityType")}
        subheading={t("listings.sections.communityTypeSubtitle")}
      >
        <Grid.Row columns={2}>
          <FieldValue label={t("listings.reservedCommunityType")}>
            {options && (
              <Select
                id={`reservedCommunityTypes.id`}
                name={`reservedCommunityTypes.id`}
                label={t("listings.reservedCommunityType")}
                labelClassName="sr-only"
                register={register}
                controlClassName="control"
                options={options}
                inputProps={{
                  onChange: () => {
                    setCurrentCommunityType(reservedCommunityType)
                  },
                }}
              />
            )}
          </FieldValue>
        </Grid.Row>
        <Grid.Row columns={3}>
          <Grid.Cell className="seeds-grid-span-2">
            <Textarea
              label={t("listings.reservedCommunityDescription")}
              name={"reservedCommunityDescription"}
              id={"reservedCommunityDescription"}
              fullWidth={true}
              register={register}
              note={t("listings.appearsInListing")}
            />
          </Grid.Cell>
        </Grid.Row>

        <Grid.Row columns={1}>
          <FieldValue label={t("listings.includeCommunityDisclaimer")}>
            <FieldGroup
              name="includeCommunityDisclaimerQuestion"
              type="radio"
              register={register}
              fields={[
                {
                  label: t("t.yes"),
                  value: YesNoEnum.yes,
                  id: "includeCommunityDisclaimerYes",
                  disabled: !currentCommunityType,
                },
                {
                  label: t("t.no"),
                  value: YesNoEnum.no,
                  id: "includeCommunityDisclaimerNo",
                  disabled: !currentCommunityType,
                },
              ]}
            />
          </FieldValue>
        </Grid.Row>

        {watch("includeCommunityDisclaimerQuestion") === YesNoEnum.yes && currentCommunityType && (
          <>
            <Grid.Row columns={3}>
              <Grid.Cell className="seeds-grid-span-2">
                <Field
                  label={t("listings.reservedCommunityDisclaimerTitle")}
                  name="communityDisclaimerTitle"
                  id="communityDisclaimerTitle"
                  register={register}
                  subNote={t("listings.requiredToPublishAppearsAsFirstPage")}
                  error={errors.communityDisclaimerTitle}
                  placeholder={t("t.enterTitle")}
                  errorMessage={t("t.enterTitle")}
                />
              </Grid.Cell>
            </Grid.Row>

            <Grid.Row columns={3}>
              <Grid.Cell className="seeds-grid-span-2">
                <Textarea
                  label={t("listings.reservedCommunityDisclaimer")}
                  name="communityDisclaimerDescription"
                  id="communityDisclaimerDescription"
                  fullWidth={true}
                  register={register}
                  note={t("listings.requiredToPublishAppearsAsFirstPage")}
                  placeholder={t("t.enterDescription")}
                  errorMessage={errors.communityDisclaimerDescription && t("t.enterDescription")}
                />
              </Grid.Cell>
            </Grid.Row>
          </>
        )}
      </SectionWithGrid>
    </>
  )
}

export default CommunityType

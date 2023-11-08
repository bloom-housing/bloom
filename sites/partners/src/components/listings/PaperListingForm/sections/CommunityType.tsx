import React, { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import { t, Select, Textarea } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { useReservedCommunityTypeList } from "../../../../lib/hooks"
import { arrayToFormOptions } from "../../../../lib/helpers"
import { ReservedCommunityType } from "@bloom-housing/backend-core/types"
import { FormListing } from "../../../../lib/listings/formTypes"
import SectionWithGrid from "../../../shared/SectionWithGrid"

type CommunityTypeProps = {
  listing?: FormListing
}

const CommunityType = ({ listing }: CommunityTypeProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, watch } = formMethods

  const reservedCommunityType = watch("reservedCommunityType.id")

  const [options, setOptions] = useState([])
  const [currentCommunityType, setCurrentCommunityType] = useState(
    listing?.reservedCommunityType?.id
  )

  const { data: reservedCommunityTypes = [] } = useReservedCommunityTypeList()

  useEffect(() => {
    const optionsTranslated = reservedCommunityTypes.map((communityType) => {
      return { ...communityType, name: t(`listings.reservedCommunityTypes.${communityType.name}`) }
    })
    setOptions(["", ...arrayToFormOptions<ReservedCommunityType>(optionsTranslated, "name", "id")])
  }, [reservedCommunityTypes])

  useEffect(() => {
    setValue("reservedCommunityType.id", currentCommunityType)
  }, [options, setValue, currentCommunityType])

  useEffect(() => {
    if (![listing?.reservedCommunityType?.id, undefined, ""].includes(reservedCommunityType)) {
      setCurrentCommunityType(reservedCommunityType)
    }
  }, [reservedCommunityType, listing?.reservedCommunityType?.id])

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
                id={`reservedCommunityType.id`}
                name={`reservedCommunityType.id`}
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
            />
          </Grid.Cell>
        </Grid.Row>
      </SectionWithGrid>
    </>
  )
}

export default CommunityType

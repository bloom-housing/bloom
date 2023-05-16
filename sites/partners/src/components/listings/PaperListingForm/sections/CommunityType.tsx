import React, { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, GridCell, ViewItem, Select, Textarea } from "@bloom-housing/ui-components"
import { useReservedCommunityTypeList } from "../../../../lib/hooks"
import { arrayToFormOptions } from "../../../../lib/helpers"
import { ReservedCommunityType } from "@bloom-housing/backend-core/types"
import { FormListing } from "../../../../lib/listings/formTypes"

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
    <GridSection
      grid={false}
      columns={3}
      separator
      title={t("listings.sections.communityType")}
      description={t("listings.sections.communityTypeSubtitle")}
    >
      <GridSection columns={2}>
        <ViewItem label={t("listings.reservedCommunityType")}>
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
        </ViewItem>
      </GridSection>
      <GridSection columns={3}>
        <GridCell span={2}>
          <Textarea
            label={t("listings.reservedCommunityDescription")}
            name={"reservedCommunityDescription"}
            id={"reservedCommunityDescription"}
            fullWidth={true}
            register={register}
          />
        </GridCell>
      </GridSection>
    </GridSection>
  )
}

export default CommunityType

import React, { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import {
  t,
  GridSection,
  GridCell,
  Field,
  ViewItem,
  Select,
  Textarea,
} from "@bloom-housing/ui-components"
import { useReservedCommunityTypeList } from "../../../../lib/hooks"
import { arrayToFormOptions } from "../../../../lib/helpers"
import { ReservedCommunityType } from "@bloom-housing/backend-core/types"

const CommunityType = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  const [options, setOptions] = useState([])

  const { data: reservedCommunityTypes = [] } = useReservedCommunityTypeList()

  useEffect(() => {
    const optionsTranslated = reservedCommunityTypes.map((communityType) => {
      return { ...communityType, name: t(`listings.reservedCommunityTypes.${communityType.name}`) }
    })
    setOptions(["", ...arrayToFormOptions<ReservedCommunityType>(optionsTranslated, "name", "id")])
  }, [reservedCommunityTypes])

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
          <Select
            id={`reservedCommunityType`}
            name={`reservedCommunityType`}
            label={t("listings.reservedCommunityType")}
            labelClassName="sr-only"
            register={register}
            controlClassName="control"
            options={options}
            errorMessage={t("errors.stateError")}
          />
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

import React from "react"
import { useFormContext } from "react-hook-form"
import dayjs from "dayjs"
import { t, GridSection, FieldGroup, GridCell, Select, Field } from "@bloom-housing/ui-components"
import { ListingMarketingTypeEnum } from "@bloom-housing/backend-core/types"

import { FormListing } from "../formTypes"

type ApplicationDatesProps = {
  listing?: FormListing
}

const ApplicationDates = ({ listing }: ApplicationDatesProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch } = formMethods

  const marketingTypeChoice = watch("marketingType")

  return (
    <GridSection
      separator
      title={t("listings.sections.applicationDatesTitle")}
      description={t("listings.sections.applicationDatesSubtitle")}
      columns={2}
    >
      <GridCell>
        <p className={`field-label m-4 ml-0`}>{t("listings.marketingSection.status")}</p>
        <FieldGroup
          name="marketingType"
          type="radio"
          register={register}
          fields={[
            {
              label: t("listings.marketing"),
              value: "marketing",
              id: "marketingStatusMarketing",
              defaultChecked:
                !listing?.marketingType ||
                listing?.marketingType === ListingMarketingTypeEnum.marketing,
            },
            {
              label: t("listings.comingSoon"),
              value: "comingSoon",
              id: "marketingStatusComingSoon",
              defaultChecked: !listing?.marketingType
                ? listing?.marketingType === ListingMarketingTypeEnum.comingSoon
                : undefined,
            },
          ]}
        />
      </GridCell>
      {marketingTypeChoice === "comingSoon" && (
        <GridCell>
          <div className={"flex flex-col"}>
            <p className={`field-label m-2 ml-0`}>{t("listings.marketingSection.date")}</p>
            <div className={"flex items-baseline h-14"}>
              <Select
                id="marketingSeason"
                name="marketingSeason"
                label={t("listings.marketingSection.date")}
                defaultValue={listing?.marketingSeason}
                labelClassName="sr-only"
                register={register}
                controlClassName="control"
                options={["", "spring", "summer", "fall", "winter"]}
                keyPrefix="seasons"
              />
              <Field
                name={"marketingStartDate"}
                id={"marketingStartDate"}
                placeholder={t("account.settings.placeholders.year")}
                defaultValue={listing?.marketingDate ? dayjs(listing.marketingDate).year() : null}
                type={"number"}
                register={register}
                inputProps={{
                  onKeyPress: (e) => {
                    if (e.target.value && e.target.value.length > 3) {
                      e.preventDefault()
                    }
                  },
                }}
                className={"w-20"}
              />
            </div>
          </div>
          <p className="field-sub-note">{"When the opportunity becomes available to the public"}</p>
        </GridCell>
      )}
    </GridSection>
  )
}

export default ApplicationDates

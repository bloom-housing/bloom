import React from "react"
import { useFormContext, useWatch } from "react-hook-form"
import {
  t,
  GridSection,
  GridCell,
  FieldGroup,
  Textarea,
  Field,
  PhoneField,
} from "@bloom-housing/ui-components"
import { YesNoAnswer } from "../../../applications/PaperApplicationForm/FormTypes"
import { isNullOrUndefined } from "../../../../lib/helpers"

const ApplicationTypes = (listing) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, control } = formMethods

  const yesNoRadioOptions = [
    {
      label: t("t.yes"),
      value: YesNoAnswer.Yes,
    },
    {
      label: t("t.no"),
      value: YesNoAnswer.No,
    },
  ]

  const hasDigitalApplication = useWatch({
    control,
    name: "hasDigitalApplication",
    defaultValue:
      listing?.applicationPickUpAddress || listing?.applicationPickUpAddressType
        ? YesNoAnswer.Yes
        : YesNoAnswer.No,
  })

  const usingCommonDigitalApplication = useWatch({
    control,
    name: "usingCommonDigitalApplication",
    defaultValue: YesNoAnswer.Yes,
  })

  const hasPaperApplication = useWatch({
    control,
    name: "hasPaperApplication",
    defaultValue:
      listing?.applicationPickUpAddress || listing?.applicationPickUpAddressType
        ? YesNoAnswer.Yes
        : YesNoAnswer.No,
  })

  const usingCommonPaperApplication = useWatch({
    control,
    name: "usingCommonPaperApplication",
    defaultValue: YesNoAnswer.Yes,
  })

  return (
    <div>
      <GridSection
        grid={false}
        separator
        title={t("listings.sections.applicationTypesTitle")}
        description={t("listings.sections.applicationTypesSubtitle")}
      >
        <GridSection columns={2}>
          <GridCell>
            <p className="field-label m-4 ml-0">{t("listings.isDigitalApplication")}</p>

            <FieldGroup
              name="hasDigitalApplication"
              type="radio"
              register={register}
              fields={[
                {
                  ...yesNoRadioOptions[0],
                  id: "hasDigitalApplicationYes",
                  defaultChecked:
                    isNullOrUndefined(listing?.applicationPickUpAddress) === false ||
                    isNullOrUndefined(listing?.applicationPickUpAddressType) === false,
                },
                {
                  ...yesNoRadioOptions[1],
                  id: "hasDigitalApplicationNo",
                  defaultChecked:
                    listing?.applicationPickUpAddress === null &&
                    listing?.applicationPickUpAddressType === null,
                },
              ]}
            />
          </GridCell>
          {hasDigitalApplication === YesNoAnswer.Yes && (
            <GridCell>
              <p className="field-label m-4 ml-0">{t("listings.usingCommonDigitalApplication")}</p>

              <FieldGroup
                name="usingCommonDigitalApplication"
                type="radio"
                register={register}
                fields={[
                  {
                    ...yesNoRadioOptions[0],
                    id: "usingCommonDigitalApplicationYes",
                    defaultChecked:
                      isNullOrUndefined(listing?.applicationPickUpAddress) === false ||
                      isNullOrUndefined(listing?.applicationPickUpAddressType) === false,
                  },
                  {
                    ...yesNoRadioOptions[1],
                    id: "usingCommonDigitalApplicationNo",
                    defaultChecked:
                      listing?.applicationPickUpAddress === null &&
                      listing?.applicationPickUpAddressType === null,
                  },
                ]}
              />
            </GridCell>
          )}
        </GridSection>
        {usingCommonDigitalApplication === YesNoAnswer.No && (
          <GridSection columns={1}>
            <GridCell>
              <Field
                label={t("listings.customOnlineApplicationUrl")}
                name="customOnlineApplicationUrl"
                id="customOnlineApplicationUrl"
                placeholder="https://"
                errorMessage={"."}
                register={register}
              />
            </GridCell>
          </GridSection>
        )}

        <GridSection columns={2}>
          <GridCell>
            <p className="field-label m-4 ml-0">{t("listings.isPaperApplication")}</p>

            <FieldGroup
              name="hasPaperApplication"
              type="radio"
              register={register}
              fields={[
                {
                  ...yesNoRadioOptions[0],
                  id: "hasPaperApplicationYes",
                  defaultChecked:
                    isNullOrUndefined(listing?.applicationPickUpAddress) === false ||
                    isNullOrUndefined(listing?.applicationPickUpAddressType) === false,
                },
                {
                  ...yesNoRadioOptions[1],
                  id: "hasPaperApplicationNo",
                  defaultChecked:
                    listing?.applicationPickUpAddress === null &&
                    listing?.applicationPickUpAddressType === null,
                },
              ]}
            />
          </GridCell>
          {hasPaperApplication === YesNoAnswer.Yes && (
            <GridCell>
              <p className="field-label m-4 ml-0">{t("listings.usingCommonPaperApplication")}</p>

              <FieldGroup
                name="usingCommonPaperApplication"
                type="radio"
                register={register}
                fields={[
                  {
                    ...yesNoRadioOptions[0],
                    id: "usingCommonPaperApplicationYes",
                    defaultChecked:
                      isNullOrUndefined(listing?.applicationPickUpAddress) === false ||
                      isNullOrUndefined(listing?.applicationPickUpAddressType) === false,
                  },
                  {
                    ...yesNoRadioOptions[1],
                    id: "usingCommonPaperApplicationNo",
                    defaultChecked:
                      listing?.applicationPickUpAddress === null &&
                      listing?.applicationPickUpAddressType === null,
                  },
                ]}
              />
            </GridCell>
          )}
        </GridSection>
        {usingCommonPaperApplication === YesNoAnswer.No && (
          <GridSection columns={1}>
            <GridCell>Paper</GridCell>
          </GridSection>
        )}

        <GridSection columns={1}>
          <GridCell>
            <p className="field-label m-4 ml-0">{t("listings.isReferralOpportunity")}</p>

            <FieldGroup
              name="referralOpportunity"
              type="radio"
              register={register}
              fields={[
                {
                  ...yesNoRadioOptions[0],
                  id: "referralOpportunityYes",
                  defaultChecked:
                    isNullOrUndefined(listing?.applicationPickUpAddress) === false ||
                    isNullOrUndefined(listing?.applicationPickUpAddressType) === false,
                },
                {
                  ...yesNoRadioOptions[1],
                  id: "referralOpportunityNo",
                  defaultChecked:
                    listing?.applicationPickUpAddress === null &&
                    listing?.applicationPickUpAddressType === null,
                },
              ]}
            />
          </GridCell>
        </GridSection>
      </GridSection>
    </div>
  )
}

export default ApplicationTypes

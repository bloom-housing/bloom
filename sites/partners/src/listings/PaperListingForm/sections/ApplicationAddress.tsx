import React from "react"
import { useFormContext } from "react-hook-form"
import {
  t,
  GridSection,
  Textarea,
  Field,
  GridCell,
  Select,
  stateKeys,
  ViewItem,
  DateField,
  FieldGroup,
} from "@bloom-housing/ui-components"
import { YesNoAnswer } from "../../../applications/PaperApplicationForm/FormTypes"

const ApplicationAddress = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, getValues } = formMethods
  const postmarksConsidered: YesNoAnswer = watch("applicationAddress.postmarksConsidered")
  const applicationsPickedUp: YesNoAnswer = watch("applicationAddress.applicationsPickedUp")
  const applicationsPickedUpAddress = watch("applicationAddress.applicationsPickedUpAddress")
  const paperMailedToAnotherAddress = watch("applicationAddress.differentPaperAddress")

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

  const pickupRadioOptions = [
    {
      id: "applicationPickupAddress.leasingAgentAddress",
      label: "At the leasing agent address",
      value: "leasingAgentAddress",
    },
    {
      id: "applicationPickupAddress.mailingAddress",
      label: "At the mailing address",
      value: "mailingAddress",
    },
    {
      id: "applicationPickupAddress.anotherAddress",
      label: "At another address",
      value: "anotherAddress",
    },
  ]

  return (
    <div>
      <span className="form-section__title">{t("listings.sections.additionalDetails")}</span>
      <span className="form-section__description">
        {t("listings.sections.additionalDetailsSubtext")}
      </span>
      <GridSection grid={false} subtitle={t("listings.leasingAgentAddress")}>
        <GridSection columns={3}>
          <Field
            label={t("listings.streetAddressOrPOBox")}
            name={"applicationAddress.street"}
            id={"applicationAddress.street"}
            register={register}
            placeholder={t("application.contact.streetAddress")}
          />
          <Field
            label={t("application.contact.apt")}
            name={"applicationAddress.street2"}
            id={"applicationAddress.street2"}
            register={register}
            placeholder={t("application.contact.apt")}
          />
        </GridSection>
        <GridSection columns={6}>
          <GridCell span={2}>
            <Field
              label={t("application.contact.city")}
              name={"applicationAddress.city"}
              id={"applicationAddress.city"}
              register={register}
              placeholder={t("application.contact.city")}
            />
          </GridCell>
          <ViewItem label={t("application.contact.state")} className="mb-0">
            <Select
              id={`applicationAddress.state`}
              name={`applicationAddress.state`}
              label={t("application.contact.state")}
              labelClassName="sr-only"
              register={register}
              controlClassName="control"
              options={stateKeys}
              keyPrefix="states"
              errorMessage={t("errors.stateError")}
            />
          </ViewItem>
          <Field
            label={t("application.contact.zip")}
            name={"applicationAddress.zipCode"}
            id={"applicationAddress.zipCode"}
            placeholder={t("application.contact.zip")}
            errorMessage={t("errors.zipCodeError")}
            register={register}
          />
        </GridSection>
        <GridSection columns={1}>
          <Field
            id="applicationAddress.differentPaperAddress"
            name="applicationAddress.differentPaperAddress"
            type="checkbox"
            label={t("listings.paperDifferentAddress")}
            register={register}
          />
        </GridSection>
        <GridSection columns={8} className={"flex items-center"}>
          <GridCell span={2}>
            <p className="field-label m-4 ml-0">{t("listings.applicationPickupQuestion")}</p>
          </GridCell>
          <FieldGroup
            name="applicationAddress.applicationsPickedUp"
            type="radio"
            register={register}
            fields={[
              { ...yesNoRadioOptions[0], id: "applicationAddress.applicationsPickedUpYes" },
              { ...yesNoRadioOptions[1], id: "applicationAddress.applicationsPickedUpNo" },
            ]}
          />
        </GridSection>
        {applicationsPickedUp === YesNoAnswer.Yes && (
          <GridSection columns={4}>
            <p className="field-label m-4 ml-0">{t("listings.wherePickupQuestion")}</p>
            <FieldGroup
              name="applicationAddress.applicationsPickedUpAddress"
              type="radio"
              register={register}
              fields={pickupRadioOptions}
            />
          </GridSection>
        )}
        {applicationsPickedUpAddress === "anotherAddress" && (
          <GridSection grid={false} subtitle={t("listings.pickupAddress")}>
            <GridSection columns={3}>
              <Field
                label={t("listings.streetAddressOrPOBox")}
                name={"pickupAddress.street"}
                id={"pickupAddress.street"}
                register={register}
                placeholder={t("application.contact.streetAddress")}
              />
              <Field
                label={t("application.contact.apt")}
                name={"pickupAddress.street2"}
                id={"pickupAddress.street2"}
                register={register}
                placeholder={t("application.contact.apt")}
              />
            </GridSection>
            <GridSection columns={6}>
              <GridCell span={2}>
                <Field
                  label={t("application.contact.city")}
                  name={"pickupAddress.city"}
                  id={"pickupAddress.city"}
                  register={register}
                  placeholder={t("application.contact.city")}
                />
              </GridCell>
              <ViewItem label={t("application.contact.state")} className="mb-0">
                <Select
                  id={`pickupAddress.state`}
                  name={`pickupAddress.state`}
                  label={t("application.contact.state")}
                  labelClassName="sr-only"
                  register={register}
                  controlClassName="control"
                  options={stateKeys}
                  keyPrefix="states"
                  errorMessage={t("errors.stateError")}
                />
              </ViewItem>
              <Field
                label={t("application.contact.zip")}
                name={"pickupAddress.zipCode"}
                id={"pickupAddress.zipCode"}
                placeholder={t("application.contact.zip")}
                errorMessage={t("errors.zipCodeError")}
                register={register}
              />
            </GridSection>
          </GridSection>
        )}
        <GridSection columns={8} className={"flex items-center"}>
          <GridCell span={2}>
            <p className="field-label m-4 ml-0">{t("listings.applicationDropOffQuestion")}</p>
          </GridCell>
          <FieldGroup
            name="applicationAddress.applicationsDroppedOff"
            type="radio"
            register={register}
            fields={[
              { ...yesNoRadioOptions[0], id: "applicationAddress.applicationsDroppedOffYes" },
              { ...yesNoRadioOptions[1], id: "applicationAddress.applicationsDroppedOffNo" },
            ]}
          />
        </GridSection>
        <GridSection columns={8} className={"flex items-center"}>
          <GridCell span={2}>
            <p className="field-label m-4 ml-0">{t("listings.postmarksConsideredQuestion")}</p>
          </GridCell>
          <FieldGroup
            name="applicationAddress.postmarksConsidered"
            type="radio"
            register={register}
            fields={[
              { ...yesNoRadioOptions[0], id: "applicationAddress.postmarksConsideredYes" },
              { ...yesNoRadioOptions[1], id: "applicationAddress.postmarksConsideredNo" },
            ]}
          />
        </GridSection>
        {postmarksConsidered === YesNoAnswer.Yes && (
          <GridSection columns={4}>
            <GridCell span={2}>
              <ViewItem label={t("listings.postmarkByDate")} className="mb-0">
                <DateField
                  label={""}
                  name={"postmarkByDate"}
                  id={"postmarkByDate"}
                  register={register}
                  watch={watch}
                />
              </ViewItem>
            </GridCell>
          </GridSection>
        )}
        <GridSection columns={3}>
          <GridCell span={2}>
            <Textarea
              label={t("listings.additionalApplicationSubmissionNotes")}
              name={"additionalApplicationSubmissionNotes"}
              id={"additionalApplicationSubmissionNotes"}
              fullWidth={true}
              register={register}
              placeholder={t("t.addNotes")}
            />
          </GridCell>
        </GridSection>
      </GridSection>
    </div>
  )
}

export default ApplicationAddress

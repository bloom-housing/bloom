import React, { Fragment, useCallback, useMemo } from "react"
import { useRouter } from "next/router"
import moment from "moment"
import Head from "next/head"
import {
  PageHeader,
  t,
  Tag,
  GridSection,
  ViewItem,
  GridCell,
  MinimalTable,
  InlineButton,
  DOBField,
  Field,
  BlankApplicationFields,
  emailRegex,
  PhoneField,
  Select,
  contactPreferencesKeys,
  FieldGroup,
} from "@bloom-housing/ui-components"
import { useSingleApplicationData } from "../../lib/hooks"
import Layout from "../../layouts/application"
import { useForm } from "react-hook-form"
import { phoneNumberKeys, stateKeys } from "@bloom-housing/ui-components/src/helpers/formOptions"

type Props = {
  isEditable?: boolean
}

const EditApplication = ({ isEditable }: Props) => {
  const router = useRouter()

  const contactPreferencesOptions = contactPreferencesKeys?.map((item) => ({
    id: item.id,
    label: t(`application.form.options.contact.${item.id}`),
  }))

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, control, handleSubmit, errors } = useForm()

  const mailingAddressValue = watch("sendMailToMailingAddress")
  const workInRegionValue = watch("applicant.workInRegion")

  // TODO: update dataKey inside fields
  const ApplicationAddress = useCallback((subtitle: string, dataKey: string) => {
    return (
      <GridSection subtitle={subtitle}>
        <GridCell span={2}>
          <ViewItem label={t("application.contact.streetAddress")}>
            <Field
              id="addressStreet"
              name="applicant.address.street"
              label={t("application.contact.streetAddress")}
              placeholder={t("application.contact.streetAddress")}
              validation={{ required: true }}
              error={errors.applicant?.address?.street}
              errorMessage={t("application.contact.streetError")}
              register={register}
              readerOnly
            />
          </ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("application.contact.apt")}>
            <Field
              id="addressStreet2"
              name="applicant.address.street2"
              label={t("application.contact.apt")}
              placeholder={t("application.contact.apt")}
              register={register}
              readerOnly
            />
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.contact.city")}>
            <Field
              id="addressCity"
              name="applicant.address.city"
              label={t("application.contact.cityName")}
              placeholder={t("application.contact.cityName")}
              validation={{ required: true }}
              error={errors.applicant?.address?.city}
              errorMessage={t("application.contact.cityError")}
              register={register}
              readerOnly
            />
          </ViewItem>
        </GridCell>

        <GridCell className="md:grid md:grid-cols-2 md:gap-8" span={2}>
          <ViewItem label={t("application.contact.state")} className="mb-0">
            <Select
              id="addressState"
              name="applicant.address.state"
              label={t("application.contact.state")}
              labelClassName="sr-only"
              validation={{ required: true }}
              error={errors.applicant?.address?.state}
              errorMessage={t("application.contact.stateError")}
              register={register}
              controlClassName="control"
              options={stateKeys}
              keyPrefix="application.form.options.states"
            />
          </ViewItem>

          <ViewItem label={t("application.contact.zip")}>
            <Field
              id="addressZipCode"
              name="applicant.address.zipCode"
              label={t("application.contact.zip")}
              placeholder={t("application.contact.zipCode")}
              validation={{ required: true }}
              error={errors.applicant?.address?.zipCode}
              errorMessage={t("application.contact.zipCodeError")}
              register={register}
              readerOnly
            />
          </ViewItem>
        </GridCell>
      </GridSection>
    )
  }, [])

  return (
    <>
      <section className="bg-primary-lighter">
        <div className="flex flex-row flex-wrap mx-auto px-5 mt-5 max-w-screen-xl">
          <div className="info-card md:w-9/12">
            <GridSection title={t("application.household.primaryApplicant")} grid={false}>
              <GridSection columns={3}>
                <GridCell>
                  <ViewItem label={t("application.name.firstName")}>
                    <Field
                      name="applicant.firstName"
                      label={t("application.name.firstName")}
                      placeholder={t("application.name.firstName")}
                      validation={{ required: true }}
                      error={errors.applicant?.firstName}
                      errorMessage={t("application.name.firstNameError")}
                      register={register}
                      readerOnly
                    />
                  </ViewItem>
                </GridCell>
                <GridCell>
                  <ViewItem label={t("application.name.middleName")}>
                    <Field
                      name="applicant.middleName"
                      label={t("application.name.middleNameOptional")}
                      placeholder={t("application.name.middleNameOptional")}
                      register={register}
                      readerOnly
                    />
                  </ViewItem>
                </GridCell>
                <GridCell>
                  <ViewItem label={t("application.name.lastName")}>
                    <Field
                      name="applicant.lastName"
                      label={t("application.name.lastName")}
                      placeholder={t("application.name.lastName")}
                      validation={{ required: true }}
                      error={errors.applicant?.lastName}
                      errorMessage={t("application.name.lastNameError")}
                      register={register}
                      readerOnly
                    />
                  </ViewItem>
                </GridCell>
                <GridCell>
                  <ViewItem label={t("application.household.member.dateOfBirth")}>
                    <DOBField
                      register={register}
                      error={errors.applicant}
                      name="applicant"
                      id="applicant.dateOfBirth"
                      watch={watch}
                      atAge={true}
                      label={t("application.name.yourDateOfBirth")}
                      readerOnly
                    />
                  </ViewItem>
                </GridCell>
                {/* set noEmail to true after send - if value is empty */}
                <GridCell>
                  <ViewItem label={t("t.email")}>
                    <Field
                      type="email"
                      name="applicant.emailAddress"
                      placeholder="example@web.com"
                      label={t("application.name.yourEmailAddress")}
                      readerOnly={true}
                      validation={{ pattern: emailRegex }}
                      error={errors.applicant?.emailAddress}
                      errorMessage={t("application.name.emailAddressError")}
                      register={register}
                    />
                  </ViewItem>
                </GridCell>
                <GridCell>
                  <ViewItem label={t("t.phone")}>
                    <PhoneField
                      label={t("application.contact.yourPhoneNumber")}
                      caps={true}
                      id="applicant.phoneNumber"
                      name="applicant.phoneNumber"
                      error={errors.applicant?.phoneNumber}
                      errorMessage={t("application.contact.phoneNumberError")}
                      controlClassName="control"
                      control={control}
                      readerOnly
                    />
                  </ViewItem>
                </GridCell>
                {/* Does an admin should ability to set value to 'none' */}
                <GridCell>
                  <ViewItem label={t("applications.table.phoneType")}>
                    <Select
                      id="applicant.phoneNumberType"
                      name="applicant.phoneNumberType"
                      placeholder={t("application.contact.phoneNumberTypes.prompt")}
                      label={t("application.contact.phoneNumberTypes.prompt")}
                      labelClassName="sr-only"
                      error={errors.applicant?.phoneNumberType}
                      errorMessage={t("application.contact.phoneNumberTypeError")}
                      register={register}
                      controlClassName="control"
                      options={phoneNumberKeys}
                      keyPrefix="application.contact.phoneNumberTypes"
                    />
                  </ViewItem>
                </GridCell>
                <GridCell>
                  <ViewItem label={t("t.additionalPhone")}>
                    <PhoneField
                      id="additionalPhoneNumber"
                      name="additionalPhoneNumber"
                      label={t("application.contact.yourAdditionalPhoneNumber")}
                      error={errors.additionalPhoneNumber}
                      errorMessage={t("application.contact.phoneNumberError")}
                      control={control}
                      controlClassName="control"
                      readerOnly
                    />
                  </ViewItem>
                </GridCell>
                <GridCell>
                  <ViewItem label={t("applications.table.additionalPhoneType")}>
                    <Select
                      id="additionalPhoneNumberType"
                      name="additionalPhoneNumberType"
                      error={errors?.additionalPhoneNumberType}
                      errorMessage={t("application.contact.phoneNumberTypeError")}
                      register={register}
                      controlClassName="control"
                      placeholder={t("application.contact.phoneNumberTypes.prompt")}
                      label={t("application.contact.phoneNumberTypes.prompt")}
                      labelClassName={"sr-only"}
                      options={phoneNumberKeys}
                      keyPrefix="application.contact.phoneNumberTypes"
                    />
                  </ViewItem>
                </GridCell>
                {/* it should be checkbox group */}
                <GridCell>
                  <ViewItem label={t("application.contact.preferredContactType")}>
                    <FieldGroup
                      name="contactPreferences"
                      fields={contactPreferencesOptions}
                      type="checkbox"
                      register={register}
                    />
                  </ViewItem>
                </GridCell>

                {/* TODO: to confirm */}
                <GridCell>
                  <ViewItem>
                    <Field
                      type="checkbox"
                      id="sendMailToMailingAddress"
                      name="sendMailToMailingAddress"
                      label="I have mailing address"
                      register={register}
                    />

                    <Field
                      type="checkbox"
                      id="applicant.workInRegion"
                      name="applicant.workInRegion"
                      label="I work in region"
                      register={register}
                    />
                  </ViewItem>
                </GridCell>
              </GridSection>

              {ApplicationAddress(
                t("application.details.residenceAddress"),
                "application.applicant.address"
              )}

              {mailingAddressValue &&
                ApplicationAddress(
                  t("application.contact.mailingAddress"),
                  "application.applicant.address"
                )}

              {workInRegionValue &&
                ApplicationAddress(
                  t("application.contact.workAddress"),
                  "application.applicant.address"
                )}
            </GridSection>
          </div>

          {/* <div className="md:w-3/12">
            <ul className="status-messages">
              <li className="status-message">
                <div className="status-message__note text-center">
                  {t("t.lastUpdated")} {applicationUpdated}
                </div>
              </li>
            </ul>
          </div> */}
        </div>
      </section>
    </>
  )
}

export default EditApplication

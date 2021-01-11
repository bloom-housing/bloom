import React, { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import {
  t,
  GridSection,
  ViewItem,
  Select,
  GridCell,
  Field,
  emailRegex,
  PhoneField,
  altContactRelationshipKeys,
} from "@bloom-housing/ui-components"
import { FormAddress } from "../FormAddress"

export enum AlternateContactFields {
  FirstName = "application.alternateContact.firstName",
  LastName = "application.alternateContact.lastName",
  Agency = "application.alternateContact.agency",
  EmailAddress = "application.alternateContact.emailAddress",
  PhoneNumber = "application.alternateContact.phoneNumber",
  Type = "application.alternateContact.type",
  OtherType = "application.alternateContact.otherType",
  MailingAddress = "application.alternateContact.mailingAddress",
  MailingAddressStreet = "application.alternateContact.mailingAddress.street",
  MailingAddressStreet2 = "application.alternateContact.mailingAddress.street2",
  MailingAddressCity = "application.alternateContact.mailingAddress.city",
  MailingAddressState = "application.alternateContact.mailingAddress.state",
  MailingAddressZipCode = "application.alternateContact.mailingAddress.zipCode",
}

const FormAlternateContact = () => {
  const formMethods = useFormContext()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { watch, setValue, clearErrors, register, errors, control } = formMethods

  const altContactRelationshipOptions = ["", ...altContactRelationshipKeys]
  const alternateContactType: string = watch("application.alternateContact.type")
  const alternatePhoneValue: string = watch("application.alternateContact.phoneNumber")

  // reset alternate phone type field when phone is empty
  useEffect(() => {
    const fieldKey = "application.alternateContact.phoneNumberType"
    if (!alternatePhoneValue?.length) {
      setValue(fieldKey, "")
      clearErrors(fieldKey)
    }
  }, [setValue, clearErrors, alternatePhoneValue])

  return (
    <GridSection title={t("application.alternateContact.type.label")} grid={false} separator>
      <GridSection columns={3}>
        <GridCell>
          <ViewItem label={t("application.name.firstName")}>
            <Field
              id={AlternateContactFields.FirstName}
              name={AlternateContactFields.FirstName}
              label={t("application.name.firstName")}
              placeholder={t("application.name.firstName")}
              register={register}
              readerOnly
            />
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.name.lastName")}>
            <Field
              id={AlternateContactFields.LastName}
              name={AlternateContactFields.LastName}
              placeholder={t("application.name.lastName")}
              register={register}
              label={t("application.name.lastName")}
              readerOnly
            />
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.details.agency")}>
            <Field
              id={AlternateContactFields.Agency}
              name={AlternateContactFields.Agency}
              label={t("application.details.agency")}
              placeholder={t("application.alternateContact.name.caseManagerAgencyFormPlaceHolder")}
              register={register}
              readerOnly
            />
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("t.email")}>
            <Field
              id={AlternateContactFields.EmailAddress}
              name={AlternateContactFields.EmailAddress}
              type="email"
              placeholder="example@web.com"
              label={t("t.email")}
              validation={{ pattern: emailRegex }}
              error={errors.application?.alternateContact?.emailAddress}
              errorMessage={t("errors.emailAddressError")}
              register={register}
              readerOnly
            />
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("t.phone")}>
            <PhoneField
              id={AlternateContactFields.PhoneNumber}
              name={AlternateContactFields.PhoneNumber}
              required={false}
              error={errors.application?.alternateContact?.phoneNumber}
              errorMessage={t("errors.phoneNumberError")}
              control={control}
              controlClassName="control"
              label={t("t.phone")}
              readerOnly
            />
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("t.relationship")}>
            <Select
              id={AlternateContactFields.Type}
              name={AlternateContactFields.Type}
              label={t("t.relationship")}
              labelClassName="sr-only"
              register={register}
              controlClassName="control"
              options={altContactRelationshipOptions}
              keyPrefix="application.alternateContact.type.options"
            />
          </ViewItem>
        </GridCell>

        {alternateContactType === "other" && (
          <GridCell>
            <ViewItem label={t("t.otherRelationShip")}>
              <Field
                id={AlternateContactFields.OtherType}
                name={AlternateContactFields.OtherType}
                label={t("t.otherRelationShip")}
                placeholder={t("t.relationship")}
                register={register}
                readerOnly
              />
            </ViewItem>
          </GridCell>
        )}
      </GridSection>

      <GridSection grid={false}>
        {FormAddress(
          t("application.contact.mailingAddress"),
          AlternateContactFields.OtherType,
          "alternate",
          register
        )}
      </GridSection>
    </GridSection>
  )
}

export { FormAlternateContact as default, FormAlternateContact }

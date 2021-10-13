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
  FormAddress,
} from "@bloom-housing/ui-components"
import { altContactRelationshipKeys } from "@bloom-housing/shared-helpers"

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
              id="application.alternateContact.firstName"
              name="application.alternateContact.firstName"
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
              id="application.alternateContact.lastName"
              name="application.alternateContact.lastName"
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
              id="application.alternateContact.agency"
              name="application.alternateContact.agency"
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
              id="application.alternateContact.emailAddress"
              name="application.alternateContact.emailAddress"
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
              id="application.alternateContact.phoneNumber"
              name="application.alternateContact.phoneNumber"
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
              id="application.alternateContact.type"
              name="application.alternateContact.type"
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
                id="application.alternateContact.otherType"
                name="application.alternateContact.otherType"
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
        <FormAddress
          subtitle={t("application.contact.mailingAddress")}
          dataKey="application.alternateContact.mailingAddress"
          type="alternate"
          register={register}
        />
      </GridSection>
    </GridSection>
  )
}

export { FormAlternateContact as default, FormAlternateContact }

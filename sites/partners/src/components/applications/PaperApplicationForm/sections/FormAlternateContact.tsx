import React, { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { t, Select, Field, PhoneField, FormAddress } from "@bloom-housing/ui-components"
import { Grid } from "@bloom-housing/ui-seeds"
import { altContactRelationshipKeys, stateKeys, emailRegex } from "@bloom-housing/shared-helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"

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
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid heading={t("application.alternateContact.type.label")}>
        <Grid.Row columns={3}>
          <Grid.Cell>
            <Field
              id="application.alternateContact.firstName"
              name="application.alternateContact.firstName"
              label={t("application.name.firstName")}
              placeholder={t("application.name.firstName")}
              register={register}
            />
          </Grid.Cell>

          <Grid.Cell>
            <Field
              id="application.alternateContact.lastName"
              name="application.alternateContact.lastName"
              placeholder={t("application.name.lastName")}
              register={register}
              label={t("application.name.lastName")}
            />
          </Grid.Cell>

          <Grid.Cell>
            <Field
              id="application.alternateContact.agency"
              name="application.alternateContact.agency"
              label={t("application.details.agency")}
              placeholder={t("application.alternateContact.name.caseManagerAgencyFormPlaceHolder")}
              register={register}
            />
          </Grid.Cell>
        </Grid.Row>

        <Grid.Row>
          <Grid.Cell>
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
            />
          </Grid.Cell>

          <Grid.Cell>
            <PhoneField
              id="application.alternateContact.phoneNumber"
              name="application.alternateContact.phoneNumber"
              required={false}
              error={errors.application?.alternateContact?.phoneNumber}
              errorMessage={t("errors.phoneNumberError")}
              control={control}
              controlClassName="control"
              label={t("t.phone")}
            />
          </Grid.Cell>

          <Grid.Cell>
            <Select
              id="application.alternateContact.type"
              name="application.alternateContact.type"
              label={t("t.relationship")}
              register={register}
              controlClassName="control"
              options={altContactRelationshipOptions}
              keyPrefix="application.alternateContact.type.options"
            />
          </Grid.Cell>
        </Grid.Row>

        {alternateContactType === "other" && (
          <Grid.Row>
            <Grid.Cell>
              <Field
                id="application.alternateContact.otherType"
                name="application.alternateContact.otherType"
                label={t("t.otherRelationShip")}
                placeholder={t("t.relationship")}
                register={register}
              />
            </Grid.Cell>
          </Grid.Row>
        )}

        <Grid.Row>
          <FormAddress
            subtitle={t("application.contact.mailingAddress")}
            dataKey="application.alternateContact.address"
            register={register}
            stateKeys={stateKeys}
          />
        </Grid.Row>
      </SectionWithGrid>
    </>
  )
}

export { FormAlternateContact as default, FormAlternateContact }

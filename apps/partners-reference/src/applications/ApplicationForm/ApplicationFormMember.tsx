import React, { useState, useCallback, useEffect, useMemo } from "react"
// import { useRouter } from "next/router"
import { HouseholdMember, HouseholdMemberUpdate } from "@bloom-housing/core"
import {
  t,
  GridSection,
  ViewItem,
  GridCell,
  DOBField,
  Field,
  emailRegex,
  PhoneField,
  Select,
  contactPreferencesKeys,
  relationshipKeys,
  altContactRelationshipKeys,
  AppearanceSizeType,
  AppearanceStyleType,
  AppearanceBorderType,
  ethnicityKeys,
  raceKeys,
  genderKeys,
  sexualOrientation,
  howDidYouHear,
  FieldGroup,
  Button,
  Form,
  AlertBox,
  Drawer,
} from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"
import { phoneNumberKeys, stateKeys } from "@bloom-housing/ui-components/src/helpers/formOptions"

// TODO: fix obSubmit type
type ApplicationFormMemberProps = {
  onSubmit: () => unknown
  onClose: () => void
}

class Member implements HouseholdMemberUpdate {
  id: string
  orderId = undefined
  firstName = ""
  middleName = ""
  lastName = ""
  birthMonth = null
  birthDay = null
  birthYear = null
  emailAddress = ""
  noEmail = null
  phoneNumber = ""
  phoneNumberType = ""
  noPhone = null

  constructor(orderId) {
    this.orderId = orderId
  }
  address = {
    placeName: null,
    city: "",
    county: "",
    state: "",
    street: "",
    street2: "",
    zipCode: "",
    latitude: null,
    longitude: null,
  }
  workAddress = {
    placeName: null,
    city: "",
    county: "",
    state: "",
    street: "",
    street2: "",
    zipCode: "",
    latitude: null,
    longitude: null,
  }
  sameAddress?: string
  relationship?: string
  workInRegion?: string
}

const ApplicationFormMember = ({ onSubmit, onClose }: ApplicationFormMemberProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, control, handleSubmit, errors, setValue, clearErrors } = useForm()

  function onFormSubmit(data) {
    console.log("on submit", data)
  }

  function onFormError() {
    console.log("on error")
  }

  return (
    <Form onSubmit={handleSubmit(onFormSubmit, onFormError)}>
      <div className="border rounded-md p-8 bg-white">
        <GridSection title={t("application.review.householdDetails")} columns={4}>
          <GridCell>
            <ViewItem label={t("application.name.firstName")}>
              <Field
                id="firstName"
                name="firstName"
                label={t("application.name.firstName")}
                placeholder={t("application.name.firstName")}
                register={register}
                readerOnly
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("application.name.middleName")}>
              <Field
                id="middleName"
                name="middleName"
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
                id="lastName"
                name="lastName"
                label={t("application.name.lastName")}
                placeholder={t("application.name.lastName")}
                register={register}
                readerOnly
              />
            </ViewItem>
          </GridCell>
          <GridCell>
            <ViewItem label={t("application.household.member.dateOfBirth")}>
              <DOBField
                id="dateOfBirth"
                name="dateOfBirth"
                register={register}
                error={errors?.dateOfBirth}
                watch={watch}
                atAge={true}
                label={t("application.name.yourDateOfBirth")}
                readerOnly
              />
            </ViewItem>
          </GridCell>

          <GridCell>
            <ViewItem label={t("t.relationship")}>
              <Select
                id="relationship"
                name="relationship"
                label={t("t.relationship")}
                labelClassName="sr-only"
                register={register}
                controlClassName="control"
                options={relationshipKeys}
                keyPrefix="application.form.options.relationship"
              />
            </ViewItem>
          </GridCell>
          {/* <GridCell>
            <ViewItem label={t("application.add.sameAddressAsPrimary")}>
              <div className="flex h-12 items-center">
                <Field
                  id="application.acceptedTermsYes"
                  name="application.acceptedTerms"
                  className="m-0"
                  type="radio"
                  label={t("t.yes")}
                  register={register}
                  inputProps={{
                    value: "yes",
                  }}
                />

                <Field
                  id="application.acceptedTermsNo"
                  name="application.acceptedTerms"
                  className="m-0"
                  type="radio"
                  label={t("t.no")}
                  register={register}
                  inputProps={{
                    value: "no",
                  }}
                />
              </div>
            </ViewItem>
          </GridCell> */}

          {/* <GridCell>
            <ViewItem label={t("application.details.workInRegion")}>
              <div className="flex h-12 items-center">
                <Field
                  id="application.acceptedTermsYes"
                  name="application.acceptedTerms"
                  className="m-0"
                  type="radio"
                  label={t("t.yes")}
                  register={register}
                  inputProps={{
                    value: "yes",
                  }}
                />

                <Field
                  id="application.acceptedTermsNo"
                  name="application.acceptedTerms"
                  className="m-0"
                  type="radio"
                  label={t("t.no")}
                  register={register}
                  inputProps={{
                    value: "no",
                  }}
                />
              </div>
            </ViewItem>
          </GridCell> */}
        </GridSection>
      </div>

      <div className="mt-6">
        <Button onClick={() => console.log("submit")} type={AppearanceStyleType.primary}>
          {t("application.review.terms.submit")}
        </Button>

        <Button
          onClick={onClose}
          type={AppearanceStyleType.secondary}
          border={AppearanceBorderType.borderless}
        >
          {t("t.cancel")}
        </Button>
      </div>
    </Form>
  )
}

export { ApplicationFormMember as default, ApplicationFormMember }

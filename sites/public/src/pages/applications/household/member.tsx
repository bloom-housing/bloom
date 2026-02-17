import React, { useContext, useEffect, useRef } from "react"
import { useRouter } from "next/router"
import { Button, FormErrorMessage } from "@bloom-housing/ui-seeds"
import {
  DOBField,
  Field,
  FieldGroup,
  Form,
  FormOptions,
  Select,
  t,
} from "@bloom-housing/ui-components"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import {
  FeatureFlagEnum,
  HouseholdMember,
  HouseholdMemberRelationship,
  HouseholdMemberUpdate,
  YesNoEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  OnClientSide,
  PageView,
  pushGtmEvent,
  relationshipKeys,
  stateKeys,
  AuthContext,
} from "@bloom-housing/shared-helpers"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/applications/AppSubmissionContext"
import { UserStatus } from "../../../lib/constants"
import {
  ApplicationAlertBox,
  ApplicationFormLayout,
  onFormError,
} from "../../../layouts/application-form"
import styles from "../../../layouts/application-form.module.scss"
import { isFeatureFlagOn } from "../../../lib/helpers"

export class Member implements HouseholdMemberUpdate {
  constructor(orderId: number) {
    this.orderId = orderId
  }

  id: string
  orderId = undefined as number | undefined
  firstName = ""
  middleName = ""
  lastName = ""
  birthMonth = undefined
  birthDay = undefined
  birthYear = undefined
  emailAddress = ""
  noEmail = undefined
  phoneNumber = ""
  phoneNumberType = ""
  noPhone = undefined
  householdMemberAddress = {
    placeName: undefined,
    city: "",
    county: "",
    state: "",
    street: "",
    street2: "",
    zipCode: "",
    latitude: undefined,
    longitude: undefined,
  }
  householdMemberWorkAddress = {
    placeName: undefined,
    city: "",
    county: "",
    state: "",
    street: "",
    street2: "",
    zipCode: "",
    latitude: undefined,
    longitude: undefined,
  }
  sameAddress?: YesNoEnum
  relationship?: HouseholdMemberRelationship
  workInRegion?: YesNoEnum
  fullTimeStudent?: YesNoEnum
}

const ApplicationMember = () => {
  const { profile } = useContext(AuthContext)
  let memberId, member, saveText, cancelText
  const { conductor, application, listing } = useContext(AppSubmissionContext)
  const router = useRouter()
  const currentPageSection = 2

  const alertRef = useRef<HTMLDivElement>(null)

  const enableFullTimeStudentQuestion = isFeatureFlagOn(
    conductor.config,
    FeatureFlagEnum.enableFullTimeStudentQuestion
  )

  const disableWorkInRegion = isFeatureFlagOn(conductor.config, FeatureFlagEnum.disableWorkInRegion)

  if (router.query?.memberId) {
    memberId = parseInt(router.query?.memberId.toString())
    member = application.householdMember[memberId]
    saveText = t("application.household.member.updateHouseholdMember")
    cancelText = t("application.household.member.deleteThisPerson")
  } else {
    memberId = application.householdMember.length
    member = new Member(memberId)
    saveText = t("application.household.member.saveHouseholdMember")
    cancelText = t("application.household.member.cancelAddingThisPerson")
  }

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, watch, trigger } = useForm({
    shouldFocusError: false,
  })
  const onSubmit = async (data) => {
    const validation = await trigger()
    if (!validation) return

    application.householdMember[memberId] = { ...member, ...data } as HouseholdMember
    conductor.sync()
    void router.push("/applications/household/add-members")
  }
  const onError = () => {
    onFormError("application-alert-box-wrapper")
  }
  const deleteMember = () => {
    if (member.orderId != undefined) {
      application.householdMember = application.householdMember.reduce((acc, householdMember) => {
        if (householdMember.orderId !== member.orderId) {
          acc.push({
            ...householdMember,
            orderId: acc.length,
          })
        }
        return acc
      }, [])
      conductor.sync()
    }
    void router.push("/applications/household/add-members")
  }

  const sameAddress = watch("sameAddress")
  const workInRegion = watch("workInRegion")

  const sameAddressOptions = [
    {
      id: "sameAddressYes",
      label: t("t.yes"),
      value: YesNoEnum.yes,
      defaultChecked: member?.sameAddress === "yes",
      inputProps: {
        "aria-controls": "householdMemberAddress",
      },
    },
    {
      id: "sameAddressNo",
      label: t("t.no"),
      value: YesNoEnum.no,
      defaultChecked: member?.sameAddress === "no",
      inputProps: {
        "aria-controls": "householdMemberAddress",
      },
    },
  ]

  const workInRegionOptions = [
    {
      id: "workInRegionYes",
      label: t("t.yes"),
      value: YesNoEnum.yes,
      defaultChecked: member?.workInRegion === "yes",
      inputProps: {
        "aria-controls": "householdMemberWorkAddress",
      },
    },
    {
      id: "workInRegionNo",
      label: t("t.no"),
      value: YesNoEnum.no,
      defaultChecked: member?.workInRegion === "no",
      inputProps: {
        "aria-controls": "householdMemberWorkAddress",
      },
    },
  ]

  const fullTimeStudentOptions = [
    {
      id: "fullTimeStudentYes",
      label: t("t.yes"),
      value: YesNoEnum.yes,
      defaultChecked: member?.fullTimeStudent === "yes",
    },
    {
      id: "fullTimeStudentNo",
      label: t("t.no"),
      value: YesNoEnum.no,
      defaultChecked: member?.fullTimeStudent === "no",
    },
  ]

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Add Household Members",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout
      pageTitle={`${t("application.household.householdMember")} - ${t(
        "listings.apply.applyOnline"
      )} - ${listing?.name}`}
    >
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <ApplicationFormLayout
          listingName={listing?.name}
          heading={t("application.household.member.title")}
          subheading={t("application.household.member.subTitle")}
          progressNavProps={{
            currentPageSection: currentPageSection,
            completedSections: application.completedSections,
            labels: conductor.config.sections.map((label) => t(`t.${label}`)),
            mounted: OnClientSide(),
          }}
          overrideIsAdvocate={conductor.config.isAdvocate}
        >
          <ApplicationAlertBox errors={errors} alertRef={alertRef} />

          <CardSection divider={"inset"}>
            <fieldset>
              <legend className="text__caps-spaced">
                {t("application.household.member.name")}
              </legend>

              <Field
                id="firstName"
                name="firstName"
                label={t("application.contact.givenName")}
                defaultValue={member.firstName}
                validation={{ required: true, maxLength: 64 }}
                error={errors.firstName}
                errorMessage={
                  errors.firstName?.type === "maxLength"
                    ? t("errors.maxLength", { length: 64 })
                    : t("errors.givenNameError")
                }
                register={register}
                dataTestId={"app-household-member-first-name"}
              />

              <Field
                id="middleName"
                name="middleName"
                label={t("application.name.middleNameOptional")}
                defaultValue={member.middleName}
                validation={{ maxLength: 64 }}
                error={errors.middleName}
                errorMessage={t("errors.maxLength", { length: 64 })}
                register={register}
                dataTestId={"app-household-member-middle-name"}
              />

              <Field
                id="lastName"
                name="lastName"
                label={t("application.contact.familyName")}
                defaultValue={member.lastName}
                validation={{ required: true, maxLength: 64 }}
                error={errors.lastName}
                errorMessage={
                  errors.lastName?.type === "maxLength"
                    ? t("errors.maxLength", { length: 64 })
                    : t("errors.familyNameError")
                }
                register={register}
                dataTestId={"app-household-member-last-name"}
              />
            </fieldset>
          </CardSection>

          <CardSection divider={"inset"}>
            <DOBField
              id="applicant.member.dateOfBirth"
              required={true}
              defaultDOB={{
                birthDay: member.birthDay,
                birthMonth: member.birthMonth,
                birthYear: member.birthYear,
              }}
              register={register}
              error={errors}
              watch={watch}
              label={t("application.household.member.dateOfBirth")}
            />
          </CardSection>

          <CardSection divider={"inset"}>
            <fieldset>
              <legend className="text__caps-spaced">
                {t("application.household.member.haveSameAddress")}
              </legend>
              <FieldGroup
                fieldGroupClassName="grid grid-cols-1"
                fieldClassName="ml-0"
                name="sameAddress"
                type="radio"
                register={register}
                validation={{ required: true }}
                error={errors.sameAddress}
                errorMessage={t("errors.selectOption")}
                fields={sameAddressOptions}
                dataTestId={"app-household-member-same-address"}
              />

              <div id="householdMemberAddress">
                {(sameAddress == "no" || (!sameAddress && member.sameAddress == "no")) && (
                  <fieldset className="mt-8">
                    <legend className="text__caps-spaced">
                      {t("application.contact.address")}
                    </legend>

                    <Field
                      id="householdMemberAddress.street"
                      name="householdMemberAddress.street"
                      defaultValue={member.householdMemberAddress.street}
                      validation={{ required: true, maxLength: 64 }}
                      errorMessage={
                        errors.householdMemberAddress?.street?.type === "maxLength"
                          ? t("errors.maxLength", { length: 64 })
                          : t("errors.streetError")
                      }
                      error={errors.householdMemberAddress?.street}
                      register={register}
                      dataTestId={"app-household-member-address-street"}
                      label={t("application.contact.streetAddress")}
                    />

                    <Field
                      id="householdMemberAddress.street2"
                      name="householdMemberAddress.street2"
                      label={t("application.contact.apt")}
                      defaultValue={member.householdMemberAddress.street2}
                      error={errors.householdMemberAddress?.street2}
                      validation={{ maxLength: 64 }}
                      errorMessage={t("errors.maxLength", { length: 64 })}
                      register={register}
                      dataTestId={"app-household-member-address-street2"}
                    />

                    <div className="flex max-w-2xl">
                      <Field
                        id="householdMemberAddress.city"
                        name="householdMemberAddress.city"
                        label={t("application.contact.city")}
                        defaultValue={member.householdMemberAddress.city}
                        validation={{ required: true, maxLength: 64 }}
                        errorMessage={
                          errors.householdMemberAddress?.city?.type === "maxLength"
                            ? t("errors.maxLength", { length: 64 })
                            : t("errors.cityError")
                        }
                        error={errors.householdMemberAddress?.city}
                        register={register}
                        dataTestId={"app-household-member-address-city"}
                      />

                      <Select
                        id="householdMemberAddress.state"
                        name="householdMemberAddress.state"
                        label={t("application.contact.state")}
                        defaultValue={member.householdMemberAddress.state}
                        validation={{ required: true, maxLength: 64 }}
                        error={errors.householdMemberAddress?.state}
                        errorMessage={
                          errors.householdMemberAddress?.state?.type === "maxLength"
                            ? t("errors.maxLength", { length: 64 })
                            : t("errors.stateError")
                        }
                        register={register}
                        controlClassName="control"
                        options={stateKeys}
                        keyPrefix="states"
                        dataTestId={"app-household-member-address-state"}
                      />
                    </div>

                    <Field
                      id="householdMemberAddress.zipCode"
                      name="householdMemberAddress.zipCode"
                      label={t("application.contact.zip")}
                      defaultValue={member.householdMemberAddress.zipCode}
                      validation={{ required: true, maxLength: 10 }}
                      error={errors.householdMemberAddress?.zipCode}
                      errorMessage={
                        errors.householdMemberAddress?.zipCode?.type === "maxLength"
                          ? t("errors.maxLength", { length: 10 })
                          : t("errors.zipCodeError")
                      }
                      register={register}
                      dataTestId={"app-household-member-address-zip"}
                    />
                  </fieldset>
                )}
              </div>
            </fieldset>
          </CardSection>

          {!disableWorkInRegion && (
            <CardSection divider={"inset"}>
              <fieldset>
                <legend className="text__caps-spaced">
                  {t("application.household.member.workInRegion", {
                    county:
                      listing?.listingsBuildingAddress?.county || listing?.jurisdictions?.name,
                  })}
                </legend>
                <FieldGroup
                  name="workInRegion"
                  fieldGroupClassName="grid grid-cols-1"
                  fieldClassName="ml-0"
                  groupNote={t("application.household.member.workInRegionNote")}
                  type="radio"
                  register={register}
                  validation={{ required: true }}
                  error={errors.workInRegion}
                  errorMessage={t("errors.selectOption")}
                  fields={workInRegionOptions}
                  dataTestId={"app-household-member-work-in-region"}
                />

                <div id="householdMemberWorkAddress">
                  {(workInRegion == "yes" || (!workInRegion && member.workInRegion == "yes")) && (
                    <fieldset className="mt-8">
                      <legend className="text__caps-spaced">
                        {t("application.contact.address")}
                      </legend>

                      <Field
                        id="householdMemberWorkAddress.street"
                        name="householdMemberWorkAddress.street"
                        label={t("application.contact.streetAddress")}
                        defaultValue={member.householdMemberWorkAddress.street}
                        validation={{ required: true, maxLength: 64 }}
                        error={errors.householdMemberWorkAddress?.street}
                        errorMessage={
                          errors.householdMemberWorkAddress?.street?.type === "maxLength"
                            ? t("errors.maxLength", { length: 64 })
                            : t("errors.streetError")
                        }
                        register={register}
                        dataTestId={"app-household-member-work-address-street"}
                      />

                      <Field
                        id="householdMemberWorkAddress.street2"
                        name="householdMemberWorkAddress.street2"
                        label={t("application.contact.apt")}
                        defaultValue={member.householdMemberWorkAddress.street2}
                        error={errors.householdMemberWorkAddress?.street2}
                        errorMessage={t("errors.maxLength", { length: 64 })}
                        validation={{ maxLength: 64 }}
                        register={register}
                        dataTestId={"app-household-member-work-address-street2"}
                      />

                      <div className="flex max-w-2xl">
                        <Field
                          id="householdMemberWorkAddress.city"
                          name="householdMemberWorkAddress.city"
                          label={t("application.contact.city")}
                          defaultValue={member.householdMemberWorkAddress.city}
                          validation={{ required: true, maxLength: 64 }}
                          error={errors.householdMemberWorkAddress?.city}
                          errorMessage={
                            errors.householdMemberWorkAddress?.city?.type === "maxLength"
                              ? t("errors.maxLength", { length: 64 })
                              : t("errors.cityError")
                          }
                          register={register}
                          dataTestId={"app-household-member-work-address-city"}
                        />

                        <Select
                          id="householdMemberWorkAddress.state"
                          name="householdMemberWorkAddress.state"
                          label={t("application.contact.state")}
                          defaultValue={member.householdMemberWorkAddress.state}
                          validation={{ required: true, maxLength: 64 }}
                          error={errors.householdMemberWorkAddress?.state}
                          errorMessage={
                            errors.householdMemberWorkAddress?.state?.type === "maxLength"
                              ? t("errors.maxLength", { length: 64 })
                              : t("errors.stateError")
                          }
                          register={register}
                          controlClassName="control"
                          options={stateKeys}
                          keyPrefix="states"
                          dataTestId={"app-household-member-work-address-state"}
                        />
                      </div>

                      <Field
                        id="householdMemberWorkAddress.zipCode"
                        name="householdMemberWorkAddress.zipCode"
                        label={t("application.contact.zip")}
                        defaultValue={member.householdMemberWorkAddress.zipCode}
                        validation={{ required: true, maxLength: 10 }}
                        error={errors.householdMemberWorkAddress?.zipCode}
                        errorMessage={
                          errors.householdMemberWorkAddress?.zipCode?.type === "maxLength"
                            ? t("errors.maxLength", { length: 10 })
                            : t("errors.zipCodeError")
                        }
                        register={register}
                        dataTestId={"app-household-member-work-address-zip"}
                      />
                    </fieldset>
                  )}
                </div>
              </fieldset>
            </CardSection>
          )}

          <CardSection
            divider={"inset"}
            className={enableFullTimeStudentQuestion ? "" : "border-none"}
          >
            <div className={"field " + (errors.relationship ? "error" : "")}>
              <label className="text__caps-spaced" htmlFor="relationship">
                {t("application.household.member.whatIsTheirRelationship")}
              </label>
              <div className="control">
                <select
                  id="relationship"
                  name="relationship"
                  defaultValue={member.relationship}
                  ref={register({ required: true })}
                  className="w-full"
                  data-testid={"app-household-member-relationship"}
                >
                  <FormOptions
                    options={relationshipKeys}
                    keyPrefix="application.form.options.relationship"
                  />
                </select>
              </div>
              {errors.relationship && (
                <FormErrorMessage id="relationship-error" className={"pt-2"}>
                  {t("errors.selectOption")}
                </FormErrorMessage>
              )}
            </div>
          </CardSection>

          {enableFullTimeStudentQuestion && (
            <CardSection divider={"inset"} className={"border-none"}>
              <fieldset>
                <legend className="text__caps-spaced">
                  {t("application.household.member.fullTimeStudent")}
                </legend>
                <FieldGroup
                  name="fullTimeStudent"
                  fieldGroupClassName="grid grid-cols-1"
                  fieldClassName="ml-0"
                  type="radio"
                  register={register}
                  validation={{ required: true }}
                  error={errors.fullTimeStudent}
                  errorMessage={t("errors.selectOption")}
                  fields={fullTimeStudentOptions}
                  dataTestId={"app-household-member-full-time-student"}
                />
              </fieldset>
            </CardSection>
          )}

          <CardSection
            divider={"flush"}
            className={`${styles["application-form-action-footer"]} border-none`}
          >
            <Button id={"app-household-member-save"} type={"submit"} variant={"primary"}>
              {saveText}
            </Button>
          </CardSection>
          <CardSection>
            <Button
              className="lined text-sm mt-0"
              type="button"
              onClick={deleteMember}
              variant={"text"}
              id={"app-household-member-cancel"}
            >
              {cancelText}
            </Button>
          </CardSection>
        </ApplicationFormLayout>
      </Form>
    </FormsLayout>
  )
}

export default ApplicationMember

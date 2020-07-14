/*
2.2 - Add Members
Add household members
*/
import Router, { useRouter } from "next/router"
import {
  Button,
  Field,
  FormCard,
  ProgressNav,
  t,
  ErrorMessage,
  FormOptions,
  relotionshipKeys,
} from "@bloom-housing/ui-components"
import { HouseholdMember } from "@bloom-housing/core"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import { useContext } from "react"
import { StateSelect } from "@bloom-housing/ui-components/src/forms/StateSelect"

class Member implements HouseholdMember {
  id: number
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

  constructor(id) {
    this.id = id
  }
  address = {
    placeName: null,
    city: "",
    county: "",
    state: "string",
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
    state: "string",
    street: "",
    street2: "",
    zipCode: "",
    latitude: null,
    longitude: null,
  }
  sameAddress?: boolean
  relationship?: string
  workInRegion?: boolean
}

export default () => {
  const router = useRouter()
  let memberId, member, saveText, cancelText
  const context = useContext(AppSubmissionContext)
  const { application, listing } = context
  const conductor = new ApplicationConductor(application, listing, context)
  const currentPageStep = 2

  if (router.query.memberId) {
    memberId = parseInt(router.query.memberId.toString())
    member = application.householdMembers[memberId]
    saveText = t("application.household.member.updateHouseholdMember")
    cancelText = t("application.household.member.deleteThisPerson")
  } else {
    memberId = application.householdMembers.length
    member = new Member(memberId)
    saveText = t("application.household.member.saveHouseholdMember")
    cancelText = t("application.household.member.cancelAddingThisPerson")
  }

  /* Form Handler */
  const { register, handleSubmit, errors, watch } = useForm()
  const onSubmit = (data) => {
    application.householdMembers[memberId] = { ...member, ...data } as HouseholdMember
    conductor.sync()
    Router.push("/applications/household/add-members").then(() => window.scrollTo(0, 0))
  }
  const deleteMember = () => {
    if (member.id != undefined) {
      application.householdMembers.splice(member.id, 1)
      conductor.sync()
    }
    Router.push("/applications/household/add-members").then(() => window.scrollTo(0, 0))
  }

  const sameAddress = watch("sameAddress")
  const workInRegion = watch("workInRegion")

  return (
    <FormsLayout>
      <FormCard header="LISTING">
        <ProgressNav
          currentPageStep={currentPageStep}
          completedSteps={application.completedStep}
          totalNumberOfSteps={conductor.totalNumberOfSteps()}
          labels={["You", "Household", "Income", "Preferences", "Review"]}
        />
      </FormCard>

      <FormCard>
        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">
            {t("application.household.member.title")}
          </h2>
          <p className="mt-4 field-note">{t("application.household.member.subTitle")}</p>
        </div>

        {member && (
          <form className="" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-card__group border-b">
              <label className="field-label--caps" htmlFor="firstName">
                {t("application.household.member.name")}
              </label>

              <Field
                name="firstName"
                placeholder={t("application.name.firstName")}
                controlClassName="mt-2"
                defaultValue={member.firstName}
                validation={{ required: true }}
                error={errors.firstName}
                errorMessage={t("application.name.firstNameError")}
                register={register}
              />

              <Field
                name="middleName"
                placeholder={t("application.name.middleName")}
                defaultValue={member.middleName}
                register={register}
              />

              <Field
                name="lastName"
                placeholder={t("application.name.lastName")}
                defaultValue={member.lastName}
                validation={{ required: true }}
                error={errors.lastName}
                errorMessage={t("application.name.lastNameError")}
                register={register}
              />
            </div>

            <div className="form-card__group border-b">
              <label className="field-label--caps" htmlFor="birthMonth">
                {t("application.household.member.dateOfBirth")}
              </label>

              <div className="field-group--dob mt-2">
                <Field
                  name="birthMonth"
                  placeholder="MM"
                  defaultValue={"" + (member.birthMonth > 0 ? member.birthMonth : "")}
                  error={errors.birthMonth}
                  validation={{
                    required: true,
                    validate: {
                      monthRange: (value) => parseInt(value) > 0 && parseInt(value) <= 12,
                    },
                  }}
                  register={register}
                />
                <Field
                  name="birthDay"
                  placeholder="DD"
                  defaultValue={"" + (member.birthDay > 0 ? member.birthDay : "")}
                  error={errors.birthDay}
                  validation={{
                    required: true,
                    validate: {
                      dayRange: (value) => parseInt(value) > 0 && parseInt(value) <= 31,
                    },
                  }}
                  register={register}
                />
                <Field
                  name="birthYear"
                  placeholder="YYYY"
                  defaultValue={"" + (member.birthYear > 0 ? member.birthYear : "")}
                  error={errors.birthYear}
                  validation={{
                    required: true,
                    validate: {
                      yearRange: (value) =>
                        parseInt(value) > 1900 && parseInt(value) <= new Date().getFullYear() - 18,
                    },
                  }}
                  register={register}
                />
              </div>

              {(errors.birthMonth || errors.birthDay || errors.birthYear) && (
                <div className="field error">
                  <span className="error-message">{t("application.name.dateOfBirthError")}</span>
                </div>
              )}
            </div>

            <div className="form-card__group border-b">
              <label className="field-label--caps" htmlFor="sameAddress">
                {t("application.household.member.haveSameAddress")}
              </label>

              <div className={"field mt-4 " + (errors.sameAddress ? "error" : "")}>
                <input
                  type="radio"
                  id="sameAddressYes"
                  name="sameAddress"
                  value="yes"
                  defaultChecked={member.sameAddress == "yes"}
                  ref={register({ required: true })}
                />
                <label className="font-semibold" htmlFor="sameAddressYes">
                  {t("application.form.radio.yes")}
                </label>
              </div>
              <div className={"field " + (errors.sameAddress ? "error" : "")}>
                <input
                  type="radio"
                  id="sameAddressNo"
                  name="sameAddress"
                  value="no"
                  defaultChecked={member.sameAddress == "no"}
                  ref={register({ required: true })}
                />
                <label className="font-semibold" htmlFor="sameAddressNo">
                  {t("application.form.radio.no")}
                </label>

                <ErrorMessage error={errors.sameAddress}>
                  {t("application.form.errors.selectOption")}
                </ErrorMessage>
              </div>
              {(sameAddress == "no" || (!sameAddress && member.sameAddress == "no")) && (
                <>
                  <label className="field-label--caps" htmlFor="street">
                    {t("application.contact.address")}
                  </label>

                  <Field
                    id="addressStreet"
                    name="address.street"
                    placeholder={t("application.contact.streetAddress")}
                    defaultValue={member.address.street}
                    validation={{ required: true }}
                    error={errors.address?.street}
                    errorMessage={t("application.contact.streetError")}
                    register={register}
                  />

                  <Field
                    id="addressStreet2"
                    name="address.street2"
                    label={t("application.contact.apt")}
                    placeholder={t("application.contact.apt")}
                    defaultValue={member.address.street2}
                    register={register}
                  />

                  <div className="flex max-w-2xl">
                    <Field
                      id="addressCity"
                      name="address.city"
                      label={t("application.contact.cityName")}
                      placeholder={t("application.contact.cityName")}
                      defaultValue={member.address.city}
                      validation={{ required: true }}
                      error={errors.address?.city}
                      errorMessage={t("application.contact.cityError")}
                      register={register}
                    />

                    <StateSelect
                      id="addressState"
                      name="address.state"
                      label="State"
                      defaultValue={member.address.state}
                      validation={{ required: true }}
                      error={errors.address?.state}
                      errorMessage={t("application.contact.stateError")}
                      register={register}
                      controlClassName="control"
                    />
                  </div>

                  <Field
                    id="addressZipCode"
                    name="address.zipCode"
                    label="Zip"
                    placeholder="Zipcode"
                    defaultValue={member.address.zipCode}
                    validation={{ required: true }}
                    error={errors.address?.zipCode}
                    errorMessage={t("application.form.errors.pleaseEnterZipCode")}
                    register={register}
                  />
                </>
              )}
            </div>

            <div className="form-card__group border-b">
              <label className="field-label--caps" htmlFor="firstName">
                {t("application.household.member.workInRegion")}
              </label>
              <p className="field-note my-2">
                {t("application.household.member.workInRegionNote")}
              </p>

              <div className={"field mt-4 " + (errors.workInRegion ? "error" : "")}>
                <input
                  type="radio"
                  id="workInRegionYes"
                  name="workInRegion"
                  value="yes"
                  defaultChecked={member.workInRegion == "yes"}
                  ref={register({ required: true })}
                />
                <label className="font-semibold" htmlFor="workInRegionYes">
                  {t("application.form.radio.yes")}
                </label>
              </div>
              <div className={"field " + (errors.workInRegion ? "error" : "")}>
                <input
                  type="radio"
                  id="workInRegionNo"
                  name="workInRegion"
                  value="no"
                  defaultChecked={member.workInRegion == "no"}
                  ref={register({ required: true })}
                />
                <label className="font-semibold" htmlFor="workInRegionNo">
                  {t("application.form.radio.no")}
                </label>

                <ErrorMessage error={errors.workInRegion}>
                  {t("application.form.errors.selectOption")}
                </ErrorMessage>
              </div>
              {(workInRegion == "yes" || (!workInRegion && member.workInRegion == "yes")) && (
                <>
                  <label className="field-label--caps" htmlFor="street">
                    {t("application.contact.address")}
                  </label>

                  <Field
                    id="addressStreet"
                    name="workAddress.street"
                    placeholder={t("application.contact.streetAddress")}
                    defaultValue={member.workAddress.street}
                    validation={{ required: true }}
                    error={errors.workAddress?.street}
                    errorMessage={t("application.contact.streetError")}
                    register={register}
                  />

                  <Field
                    id="addressStreet2"
                    name="workAddress.street2"
                    label={t("application.contact.apt")}
                    placeholder={t("application.contact.apt")}
                    defaultValue={member.workAddress.street2}
                    register={register}
                  />

                  <div className="flex max-w-2xl">
                    <Field
                      id="addressCity"
                      name="workAddress.city"
                      label={t("application.contact.cityName")}
                      placeholder={t("application.contact.cityName")}
                      defaultValue={member.workAddress.city}
                      validation={{ required: true }}
                      error={errors.workAddress?.city}
                      errorMessage={t("application.contact.cityError")}
                      register={register}
                    />

                    <StateSelect
                      id="addressState"
                      name="workAddress.state"
                      label="State"
                      defaultValue={member.workAddress.state}
                      validation={{ required: true }}
                      error={errors.workAddress?.state}
                      errorMessage={t("application.contact.stateError")}
                      register={register}
                      controlClassName="control"
                    />
                  </div>

                  <Field
                    id="addressZipCode"
                    name="workAddress.zipCode"
                    label="Zip"
                    placeholder="Zipcode"
                    defaultValue={member.workAddress.zipCode}
                    validation={{ required: true }}
                    error={errors.workAddress?.zipCode}
                    errorMessage={t("application.form.errors.pleaseEnterZipCode")}
                    register={register}
                  />
                </>
              )}
            </div>

            <div className="form-card__group">
              <div className={"field " + (errors.relationship ? "error" : "")}>
                <label className="field-label--caps" htmlFor="relationship">
                  {t("application.household.member.whatIsTheirRelationship")}
                </label>
                <div className="control">
                  <select
                    id="relationship"
                    name="relationship"
                    defaultValue={member.relationship}
                    ref={register({ required: true })}
                    className="w-full"
                  >
                    <FormOptions
                      options={relotionshipKeys}
                      keyPrefix="application.form.options.relationship"
                    />
                  </select>
                </div>
                <ErrorMessage error={errors.relationship}>
                  {t("application.form.errors.selectOption")}
                </ErrorMessage>
              </div>
            </div>

            <div className="form-card__pager">
              <div className="form-card__pager-row primary">
                <Button
                  big={true}
                  filled={true}
                  className="w-full md:w-3/4"
                  onClick={() => {
                    //
                  }}
                >
                  {saveText}
                </Button>
              </div>
              <div className="form-card__pager-row py-8">
                <a href="#" className="lined text-tiny" onClick={deleteMember}>
                  {cancelText}
                </a>
              </div>
            </div>
          </form>
        )}
      </FormCard>
    </FormsLayout>
  )
}

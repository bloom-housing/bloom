/*
1.4 - Alternate Contact
Type of alternate contact
*/
import Link from "next/link"
import Router from "next/router"
import { Button, ErrorMessage, Field, FormCard, ProgressNav, t } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import { useContext } from "react"

export default () => {
  const context = useContext(AppSubmissionContext)
  const { application } = context
  const conductor = new ApplicationConductor(application, context)
  const currentPageStep = 1
  /* Form Handler */
  const { register, handleSubmit, errors, watch } = useForm<Record<string, any>>()
  const onSubmit = (data) => {
    application.alternateContact.phoneNumber = data.phoneNumber
    application.alternateContact.emailAddress = data.emailAddress
    application.alternateContact.mailingAddress.street = data.mailingAddress.street
    application.alternateContact.mailingAddress.state = data.mailingAddress.state
    application.alternateContact.mailingAddress.zipcode = data.mailingAddress.zipcode
    application.alternateContact.mailingAddress.city = data.mailingAddress.city
    conductor.sync()
    Router.push("/applications/household/live-alone").then(() => window.scrollTo(0, 0))
  }
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
        <p className="form-card__back">
          <strong>
            <Link href="/applications/contact/alternate-contact-name">
              <a>Back</a>
            </Link>
          </strong>
        </p>
        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">
            {t("application.alternateContact.contact.title")}
          </h2>
          <p className="field-note my-4">{t("application.alternateContact.contact.description")}</p>
        </div>
        <form id="applications-contact-alternate-contact" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group border-b">
            <label className="field-label--caps">
              {t("application.alternateContact.contact.phoneNumberFormLabel")}
            </label>
            <Field
              controlClassName="mt-2"
              id="phoneNumber"
              name="phoneNumber"
              placeholder={t("application.alternateContact.contact.phoneNumberFormPlaceHolder")}
              defaultValue={application.alternateContact.phoneNumber}
              register={register}
            />
          </div>
          <div className="form-card__group border-b">
            <label className="field-label--caps">
              {t("application.alternateContact.contact.emailAddressFormLabel")}
            </label>
            <Field
              controlClassName="mt-2"
              id="emailAddress"
              name="emailAddress"
              placeholder={t("application.alternateContact.contact.emailAddressFormPlaceHolder")}
              defaultValue={application.alternateContact.emailAddress}
              register={register}
            />
          </div>
          <div className="form-card__group border-b">
            <label className="field-label--caps">
              {t("application.alternateContact.contact.contactMailingAddressLabel")}
            </label>
            <p className="field-note my-2">
              {t("application.alternateContact.contact.contactMailingAddressHelperText")}
            </p>
            <label>{t("application.alternateContact.contact.streetFormLabel")}</label>
            <Field
              id="mailingAddress.street"
              name="mailingAddress.street"
              placeholder={t("application.alternateContact.contact.streetFormPlaceholder")}
              defaultValue={application.alternateContact.mailingAddress.street}
              register={register}
            />

            <div className="flex max-w-2xl">
              <Field
                id="mailingAddress.city"
                name="mailingAddress.city"
                label={t("application.alternateContact.contact.cityFormLabel")}
                placeholder={t("application.alternateContact.contact.cityFormPlaceholder")}
                defaultValue={application.alternateContact.mailingAddress.city}
                register={register}
              />

              <div className={"field"}>
                <label htmlFor="stuff">
                  {t("application.alternateContact.contact.stateFormPlaceholder")}
                </label>
                <div className="control">
                  <select
                    id="mailingAddress.state"
                    name="mailingAddress.state"
                    defaultValue={application.alternateContact.mailingAddress.state}
                    ref={register}
                  >
                    <option value="">Select One</option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="DC">District Of Columbia</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                  </select>
                </div>
              </div>
            </div>
            <label>{t("application.alternateContact.contact.zipcodeFormLabel")}</label>
            <Field
              id="mailingAddress.zipcode"
              name="mailingAddress.zipcode"
              placeholder={t("application.alternateContact.contact.zipcodeFormPlaceholder")}
              defaultValue={application.alternateContact.mailingAddress.zipcode}
              register={register}
            />
          </div>
          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button filled={true} onClick={() => {}}>
                Next
              </Button>
            </div>
          </div>
        </form>
      </FormCard>
    </FormsLayout>
  )
}

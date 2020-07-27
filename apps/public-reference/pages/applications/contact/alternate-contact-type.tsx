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
  const { application, listing } = context
  const conductor = new ApplicationConductor(application, listing, context)
  const currentPageStep = 1
  /* Form Handler */
  const { register, handleSubmit, errors, watch } = useForm<Record<string, any>>()
  const onSubmit = (data) => {
    application.alternateContact.type = data.type
    conductor.sync()
    if (data.type == "noContact") {
      Router.push("/applications/household/live-alone").then(() => window.scrollTo(0, 0))
    } else {
      Router.push("/applications/contact/alternate-contact-name").then(() => window.scrollTo(0, 0))
    }
  }
  const options = ["familyMember", "friend", "caseManager", "other", "noContact"]
  const type = watch("type")

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
            <Link href="/applications/contact/address">
              <a>Back</a>
            </Link>
          </strong>
        </p>
        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">
            {t("application.alternateContact.type.title")}
          </h2>
          <p className="field-note mt-4">{t("application.alternateContact.type.description")}</p>
        </div>
        <form id="applications-contact-alternate-type" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group">
            <label className="field-label--caps" htmlFor="type">
              {t("application.alternateContact.type.label")}
            </label>
            <p className="field-note mt-2 mb-4">
              {t("application.alternateContact.type.helperText")}
            </p>
            {options.map((option, i) => {
              return (
                <>
                  <div className={"field " + (errors.type ? "error" : "")}>
                    <input
                      key={option}
                      type="radio"
                      id={"type" + option}
                      name="type"
                      value={option}
                      defaultChecked={application.alternateContact.type === option}
                      ref={register({ required: true })}
                    />
                    <label className="font-semibold" htmlFor={"type" + option}>
                      {t("application.alternateContact.type.options." + option)}
                    </label>
                    {option === "other" && type === "other" && (
                      <Field
                        controlClassName="mt-4"
                        id="otherType"
                        name="otherType"
                        placeholder={t(
                          "application.alternateContact.type.otherTypeFormPlaceholder"
                        )}
                        defaultValue={application.alternateContact.otherType}
                        validation={{ required: true }}
                        error={errors.otherType}
                        errorMessage={t(
                          "application.alternateContact.type.otherTypeValidationErrorMessage"
                        )}
                        register={register}
                      />
                    )}
                    {i === options.length - 1 && (
                      <ErrorMessage error={errors.type}>
                        {t("application.alternateContact.type.validationErrorMessage")}
                      </ErrorMessage>
                    )}
                  </div>
                </>
              )
            })}
          </div>
          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button
                filled={true}
                onClick={() => {
                  //
                }}
              >
                Next
              </Button>
            </div>
          </div>
        </form>
      </FormCard>
    </FormsLayout>
  )
}

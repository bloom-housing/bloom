/*
2.5 Household Student
*/
import {
  AppearanceStyleType,
  AlertBox,
  Button,
  FieldGroup,
  Form,
  FormCard,
  ProgressNav,
  t,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import FormBackLink from "../../../src/forms/applications/FormBackLink"
import { useFormConductor } from "../../../lib/hooks"

const ApplicationHouseholdStudent = () => {
  const { conductor, application, listing } = useFormConductor("householdStudent")
  const currentPageSection = 2

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors } = useForm<Record<string, any>>({
    defaultValues: { householdStudent: application.householdStudent?.toString() },
    shouldFocusError: false,
  })
  const onSubmit = (data) => {
    conductor.completeSection(2)
    const { householdStudent } = data
    conductor.currentStep.save({
      householdStudent: householdStudent === "true",
    })
    conductor.routeToNextOrReturnUrl()
  }

  const onError = () => {
    window.scrollTo(0, 0)
  }

  const householdStudentValues = [
    {
      id: "householdStudentYes",
      value: "true",
      label: t("t.yes"),
    },
    {
      id: "householdStudentNo",
      value: "false",
      label: t("t.no"),
    },
  ]

  return (
    <FormsLayout>
      <FormCard header={listing?.name}>
        <ProgressNav
          currentPageSection={currentPageSection}
          completedSections={application.completedSections}
          labels={conductor.config.sections.map((label) => t(`t.${label}`))}
        />
      </FormCard>

      <FormCard>
        <FormBackLink
          url={conductor.determinePreviousUrl()}
          onClick={() => conductor.setNavigatedBack(true)}
        />

        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">
            {t("application.household.householdStudent.question")}
          </h2>

          <p className="field-note mt-5">{t("application.household.genericSubtitle")}</p>
        </div>

        {Object.entries(errors).length > 0 && (
          <AlertBox type="alert" inverted closeable>
            {t("errors.errorsToResolve")}
          </AlertBox>
        )}

        <Form onSubmit={handleSubmit(onSubmit, onError)}>
          <div
            className={`form-card__group field text-lg ${errors.householdStudent ? "error" : ""}`}
          >
            <fieldset>
              <p className="field-note mb-4">{t("t.pleaseSelectYesNo")}</p>
              <FieldGroup
                type="radio"
                name="householdStudent"
                error={errors.householdStudent}
                errorMessage={t("errors.selectAnOption")}
                register={register}
                validation={{ required: true }}
                fields={householdStudentValues}
                dataTestId={"app-student"}
              />
            </fieldset>
          </div>

          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button
                styleType={AppearanceStyleType.primary}
                onClick={() => conductor.setNavigatedBack(false)}
                data-test-id={"app-next-step-button"}
              >
                {t("t.next")}
              </Button>
            </div>
          </div>
        </Form>
      </FormCard>
    </FormsLayout>
  )
}

export default ApplicationHouseholdStudent

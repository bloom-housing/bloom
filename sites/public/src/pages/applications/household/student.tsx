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
import FormBackLink from "../../../components/applications/FormBackLink"
import { useFormConductor } from "../../../lib/hooks"
import { OnClientSide, PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { useContext, useEffect } from "react"
import { UserStatus } from "../../../lib/constants"

const ApplicationHouseholdStudent = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("householdStudent")
  const currentPageSection = 2

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, getValues } = useForm<Record<string, any>>({
    defaultValues: { householdStudent: application.householdStudent?.toString() },
    shouldFocusError: false,
  })
  const onSubmit = (data) => {
    const { householdStudent } = data
    conductor.currentStep.save({
      householdStudent: householdStudent === "true",
    })
    conductor.completeSection(2)
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

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Household Student",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout>
      <FormCard
        header={{
          isVisible: true,
          title: listing?.name,
        }}
      >
        <ProgressNav
          currentPageSection={currentPageSection}
          completedSections={application.completedSections}
          labels={conductor.config.sections.map((label) => t(`t.${label}`))}
          mounted={OnClientSide()}
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
              <FieldGroup
                fieldGroupClassName="grid grid-cols-1"
                fieldClassName="ml-0"
                type="radio"
                name="householdStudent"
                error={errors.householdStudent}
                errorMessage={t("errors.selectAnOption")}
                register={register}
                fields={householdStudentValues}
                dataTestId={"app-student"}
                validation={{
                  validate: () => {
                    return !!Object.values(getValues()).filter((value) => value).length
                  },
                }}
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

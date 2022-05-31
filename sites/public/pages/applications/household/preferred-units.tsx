/*
2.3.2 - Preferred Unit Size
Applicant can designate which unit sizes they prefer
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
  AuthContext,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import {
  createUnitTypeId,
  getUniqueUnitTypes,
  OnClientSide,
  PageView,
  pushGtmEvent,
} from "@bloom-housing/shared-helpers"
import FormBackLink from "../../../src/forms/applications/FormBackLink"
import { useFormConductor } from "../../../lib/hooks"
import { useContext, useEffect } from "react"
import { UserStatus } from "../../../lib/constants"

const ApplicationPreferredUnits = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("preferredUnitSize")
  const currentPageSection = 2

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors } = useForm()

  const onSubmit = (data) => {
    const { preferredUnit } = data

    // save units always as an array (when is only one option, react-hook-form stores an option as string)
    if (Array.isArray(preferredUnit)) {
      application.preferredUnit = createUnitTypeId(preferredUnit)
    } else {
      application.preferredUnit = createUnitTypeId([preferredUnit])
    }

    conductor.sync()
    conductor.routeToNextOrReturnUrl()
  }
  const onError = () => {
    window.scrollTo(0, 0)
  }

  const unitTypes = getUniqueUnitTypes(listing?.units)

  const preferredUnitOptions = unitTypes?.map((item) => ({
    id: item.id,
    label: t(`application.household.preferredUnit.options.${item.name}`),
    value: item.id,
    defaultChecked: !!application.preferredUnit?.find((unit) => unit.id === item.id),
  }))

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Preferred Unit Size",
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
            {t("application.household.preferredUnit.title")}
          </h2>
          <p className="mt-4 field-note">{t("application.household.preferredUnit.subTitle")}</p>
        </div>

        {Object.entries(errors).length > 0 && (
          <AlertBox type="alert" inverted closeable>
            {t("errors.errorsToResolve")}
          </AlertBox>
        )}

        <Form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="form-card__group is-borderless">
            <fieldset>
              <legend className="sr-only">{t("application.household.preferredUnit.legend")}</legend>
              <FieldGroup
                type="checkbox"
                name="preferredUnit"
                groupNote={t("application.household.preferredUnit.optionsLabel")}
                fields={preferredUnitOptions}
                error={!!errors.preferredUnit}
                errorMessage={t("errors.selectAtLeastOne")}
                validation={{ required: true }}
                register={register}
                dataTestId={"app-preferred-units"}
              />
            </fieldset>
          </div>

          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button styleType={AppearanceStyleType.primary} data-test-id={"app-next-step-button"}>
                {t("t.next")}
              </Button>
            </div>
          </div>
        </Form>
      </FormCard>
    </FormsLayout>
  )
}

export default ApplicationPreferredUnits

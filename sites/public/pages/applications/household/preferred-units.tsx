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
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import {
  createUnitTypeId,
  getUniqueUnitTypes,
} from "@bloom-housing/ui-components/src/helpers/unitTypes"
import FormBackLink from "../../../src/forms/applications/FormBackLink"
import { useFormConductor } from "../../../lib/hooks"

const ApplicationPreferredUnits = () => {
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
              />
            </fieldset>
          </div>

          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button styleType={AppearanceStyleType.primary}>Next</Button>
            </div>
          </div>

          {/* <div className="p-8 text-center">
            <Link href="/">
              <a className="lined text-tiny">{t("application.form.general.saveAndFinishLater")}</a>
            </Link>
          </div> */}
        </Form>
      </FormCard>
    </FormsLayout>
  )
}

export default ApplicationPreferredUnits

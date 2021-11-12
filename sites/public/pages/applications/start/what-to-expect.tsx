/*
0.2 - What To Expect
A notice regarding application process and rules
*/
import {
  AppearanceStyleType,
  Button,
  FormCard,
  t,
  ProgressNav,
  Form,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { useFormConductor } from "../../../lib/hooks"
import { OnClientSide } from "@bloom-housing/shared-helpers"

const ApplicationWhatToExpect = () => {
  const { conductor, application, listing } = useFormConductor("whatToExpect")
  const currentPageSection = 1

  /* Form Handler */
  const { handleSubmit } = useForm()
  const onSubmit = () => {
    conductor.routeToNextOrReturnUrl()
  }

  return (
    <FormsLayout>
      <FormCard header={listing?.name}>
        <ProgressNav
          currentPageSection={currentPageSection}
          completedSections={application.completedSections}
          labels={conductor.config.sections.map((label) => t(`t.${label}`))}
          mounted={OnClientSide()}
        />
      </FormCard>
      <FormCard>
        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless mt-4">
            {t("application.start.whatToExpect.title")}
          </h2>
        </div>
        <div className="form-card__pager-row px-16">
          <p className="field-note py-2">{t("application.start.whatToExpect.info1")}</p>
          <p className="field-note py-2">{t("application.start.whatToExpect.info2")}</p>
          <p className="field-note py-2">{t("application.start.whatToExpect.info3")}</p>
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
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

export default ApplicationWhatToExpect

/*
2.3.3.c - Housing Situation
Ask housing applicant if their current is temporary or homeless
*/
import Link from "next/link"
import { useRouter } from "next/router"
import {
  AppearanceStyleType,
  Button,
  FormCard,
  ProgressNav,
  t,
  Form,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import React, { useContext } from "react"

export default () => {
  const { conductor, application } = useContext(AppSubmissionContext)
  const router = useRouter()
  const currentPageSection = 2

  /* Form Handler */
  const { handleSubmit } = useForm()
  const onSubmit = () => {
    void router.push("/applications/household/ada")
  }

  return (
    <FormsLayout>
      <FormCard>
        <h5 className="font-alt-sans text-center mb-5">LISTING</h5>

        <ProgressNav
          currentPageSection={currentPageSection}
          completedSections={application.completedSections}
          labels={conductor.config.sections.map((label) => t(`t.${label}`))}
        />
      </FormCard>

      <FormCard>
        <p className="text-bold">
          <strong>
            <Link href="/applications/household/preferred-units">
              <a>{t("t.back")}</a>
            </Link>
          </strong>
        </p>

        <h2 className="form-card__title is-borderless">Housing Situation</h2>

        <hr />

        <Form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
          (FORM)
          <div className="text-center mt-6">
            <Button styleType={AppearanceStyleType.primary}>Next</Button>
          </div>
        </Form>
      </FormCard>
    </FormsLayout>
  )
}

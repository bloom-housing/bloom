import React from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import Layout from "../../layouts"
import {
  AppearanceStyleType,
  Button,
  FormCard,
  t,
  FieldGroup,
  Form,
  SiteAlert,
} from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import { useForm } from "react-hook-form"

const TermsPage = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors } = useForm()
  const router = useRouter()

  const onSubmit = () => {
    void router.push("/")
  }

  const agreeField = [
    {
      id: "agree",
      label: t("application.review.terms.confirmCheckboxText"),
    },
  ]

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>

      <div className="md:mb-20 md:mt-12 mx-auto max-w-lg print:my-0 print:max-w-full">
        <div className="flex top-21 right-4 absolute z-50 flex-col items-center">
          <SiteAlert type="success" timeout={5000} dismissable />
          <SiteAlert type="alert" timeout={5000} dismissable />
        </div>

        <FormCard>
          <div className="form-card__lead border-b">
            <h2 className="form-card__title is-borderless">
              {t("application.review.terms.title")}
            </h2>
          </div>
          <div className="mt-12">
            <Form id="review-terms" className="mt-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-card__pager-row">
                <Markdown options={{ disableParsingRawHTML: false }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris commodo enim sed
                  felis iaculis, in mattis diam dictum. Quisque consequat tellus lorem, et pharetra
                  nibh facilisis a. Curabitur vel viverra felis, sed vulputate magna. Nunc ut orci
                  iaculis, placerat nunc non, dignissim purus. Vivamus tristique, sapien ac gravida
                  cursus, augue ex fringilla leo, in dignissim lacus quam nec mauris. Cras a lacus
                  quis nisl eleifend ornare. Ut sagittis eros libero, ac accumsan nibh lobortis ut.
                  Mauris tempor mauris ac vulputate bibendum. Ut placerat lacinia molestie. Aliquam
                  diam sem, lobortis ac velit aliquam, feugiat venenatis metus.
                </Markdown>

                <div className="mt-4">
                  <FieldGroup
                    name="agree"
                    type="checkbox"
                    fields={agreeField}
                    register={register}
                    validation={{ required: true }}
                    error={errors.agree}
                    errorMessage={t("errors.agreeError")}
                    fieldLabelClassName={"text-primary"}
                    dataTestId={"account-terms-agree"}
                  />
                </div>
              </div>
              <div className="form-card__pager">
                <div className="form-card__pager-row primary">
                  <Button
                    styleType={AppearanceStyleType.primary}
                    type="submit"
                    data-test-id={"account-terms-submit-button"}
                  >
                    {t("t.next")}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </FormCard>
      </div>
    </Layout>
  )
}

export { TermsPage as default, TermsPage }

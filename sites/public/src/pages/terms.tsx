import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button, Alert } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { FieldGroup, Form, t, SiteAlert } from "@bloom-housing/ui-components"
import {
  PageView,
  pushGtmEvent,
  useCatchNetworkError,
  BloomCard,
} from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"
import FormsLayout from "../layouts/forms"
import styles from "../../styles/verify.module.scss"

const Terms = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors } = useForm()
  const { determineNetworkError } = useCatchNetworkError()

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Verify",
      status: UserStatus.NotLoggedIn,
    })
  }, [])

  const onSubmit = async (data: { code: string }) => {
    // potentially create an account, potentially redirect to an application

    try {
    } catch (error) {
      const { status } = error.response || {}
      determineNetworkError(status, error)
    }
    // setSiteAlertMessage(t(`authentication.forgotPassword.message`), "notice")
    // await router.push("/sign-in")
  }

  const agreeField = [
    {
      id: "agree",
      label: t("application.review.terms.confirmCheckboxText"),
    },
  ]

  return (
    <FormsLayout>
      <BloomCard title={t("account.reviewTerms")} iconSymbol={"profile"}>
        <>
          <SiteAlert type="notice" dismissable />

          <CardSection>
            {!!Object.keys(errors).length && (
              <Alert
                className={styles["verify-error"]}
                variant="alert"
                fullwidth
                id={"verify-alert-box"}
              >
                {t("errors.errorsToResolve")}
              </Alert>
            )}
            <div className={"mb-4"}>
              <p className={"mb-4"}> {t("account.reviewTermsHelper")}</p>
              <p>
                Terms of Use Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris commodo
                enim sed felis iaculis, in mattis diam dictum. Quisque consequat tellus lorem, et
                pharetra nibh facilisis a. Curabitur vel viverra felis, sed vulputate magna. Nunc ut
                orci iaculis, placerat nunc non, dignissim purus. Vivamus tristique, sapien ac
                gravida cursus, augue ex fringilla leo, in dignissim lacus quam nec mauris. Cras a
                lacus quis nisl eleifend ornare. Ut sagittis eros libero, ac accumsan nibh lobortis
                ut. Mauris tempor mauris ac vulputate bibendum. Ut placerat lacinia molestie.
                Aliquam diam sem, lobortis ac velit aliquam, feugiat venenatis metus. I have had the
                opportunity to review the Terms of Use for this Website, as that term is defined in
                the Terms of Use, and agree to comply with all requirements described therein that
                relate to my personal use.
              </p>
              <p>
                Terms of Use Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris commodo
                enim sed felis iaculis, in mattis diam dictum. Quisque consequat tellus lorem, et
                pharetra nibh facilisis a. Curabitur vel viverra felis, sed vulputate magna. Nunc ut
                orci iaculis, placerat nunc non, dignissim purus. Vivamus tristique, sapien ac
                gravida cursus, augue ex fringilla leo, in dignissim lacus quam nec mauris. Cras a
                lacus quis nisl eleifend ornare. Ut sagittis eros libero, ac accumsan nibh lobortis
                ut. Mauris tempor mauris ac vulputate bibendum. Ut placerat lacinia molestie.
                Aliquam diam sem, lobortis ac velit aliquam, feugiat venenatis metus. I have had the
                opportunity to review the Terms of Use for this Website, as that term is defined in
                the Terms of Use, and agree to comply with all requirements described therein that
                relate to my personal use.
              </p>
            </div>

            <Form id="verify" onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup
                name="agree"
                type="checkbox"
                fields={agreeField}
                register={register}
                validation={{ required: true }}
                error={errors.agree}
                errorMessage={t("errors.agreeError")}
                fieldLabelClassName={"text-primary"}
                dataTestId={"app-terms-agree"}
                fieldGroupClassName={"mb-4"}
              />

              <Button type="submit" variant="primary">
                {t("t.finish")}
              </Button>
            </Form>
          </CardSection>
        </>
      </BloomCard>
    </FormsLayout>
  )
}

export { Terms as default, Terms }

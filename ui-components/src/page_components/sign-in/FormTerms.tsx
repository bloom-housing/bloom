import React, { useState, useContext, useCallback, useMemo } from "react"
import {
  AuthContext,
  AppearanceStyleType,
  Button,
  Field,
  Form,
  FormCard,
  Icon,
  Modal,
  MarkdownSection,
  t,
} from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import { useForm } from "react-hook-form"

type FormTermsInValues = {
  agree: boolean
}

const FormTerms = () => {
  const [termsModalVisible, setTermsModalVisible] = useState(false)
  const { profile, userProfileService, loadProfile } = useContext(AuthContext)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register, errors } = useForm<FormTermsInValues>()

  const onSubmit = useCallback(async () => {
    if (!profile) return

    const jurisdictionIds =
      profile?.jurisdictions.map((item) => ({
        id: item.id,
      })) || []

    await userProfileService?.update({
      body: { ...profile, jurisdictions: jurisdictionIds, agreedToTermsOfService: true },
    })

    loadProfile?.("/")
  }, [loadProfile, profile, userProfileService])

  const jurisdictionTerms = useMemo(() => {
    return profile?.jurisdictions[0].partnerTerms
  }, [profile])

  return (
    <>
      <FormCard>
        <div className="form-card__lead text-center">
          <Icon size="2xl" symbol="settings" />
          <h2 className="form-card__title">{t(`authentication.terms.reviewToc`)}</h2>
          <p className="field-note mt-4 text-center">
            {t(`authentication.terms.youMustAcceptToc`)}&nbsp;
            <Button type="button" inline={true} onClick={() => setTermsModalVisible(true)}>
              {t(`authentication.terms.termsOfService`)}
            </Button>
          </p>
        </div>

        <div className="border-b" />

        <div className="form-card__group pt-0">
          <Form id="terms" className="mt-10" onSubmit={handleSubmit(onSubmit)}>
            <Field
              id="agree"
              name="agree"
              type="checkbox"
              className="flex flex-col justify-center items-center"
              label={t(`authentication.terms.acceptToc`)}
              register={register}
              validation={{ required: true }}
              error={!!errors.agree}
              errorMessage={t("errors.agreeError")}
              dataTestId="agree"
            />

            <div className="text-center mt-6">
              <Button styleType={AppearanceStyleType.primary} data-test-id="form-submit">
                {t("t.submit")}
              </Button>
            </div>
          </Form>
        </div>
      </FormCard>
      <Modal
        open={!!termsModalVisible}
        title={t("application.review.terms.title")}
        onClose={() => setTermsModalVisible(false)}
        actions={[
          <Button
            styleType={AppearanceStyleType.primary}
            onClick={() => {
              setTermsModalVisible(false)
            }}
          >
            {t("t.ok")}
          </Button>,
        ]}
        slim={true}
      >
        <div className="overflow-y-auto max-h-96">
          {jurisdictionTerms && (
            <MarkdownSection padding={false} fullwidth={true}>
              <Markdown options={{ disableParsingRawHTML: false }}>{jurisdictionTerms}</Markdown>
            </MarkdownSection>
          )}
        </div>
      </Modal>
    </>
  )
}

export { FormTerms as default, FormTerms }

import React from "react"
import {
  Button,
  Field,
  Form,
  FormCard,
  Icon,
  MarkdownSection,
} from "../../.."
import Markdown from "markdown-to-jsx"
import { useForm } from "react-hook-form"
import { AppearanceStyleType, t } from "@bloom-housing/ui-components"

type FormTermsInValues = {
  agree: boolean
}

export type FormTermsProps = {
  onSubmit: () => void
  terms?: string
}

const FormTerms = (props: FormTermsProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register, errors } = useForm<FormTermsInValues>()

  return (
    <Form id="terms" className="mt-10" onSubmit={handleSubmit(props.onSubmit)}>
      <FormCard>
        <div className="form-card__lead text-center">
          <Icon size="2xl" symbol="settings" />
          <h2 className="form-card__title">{t(`authentication.terms.reviewToc`)}</h2>
          <p className="field-note mt-4 text-center">
            {t(`authentication.terms.youMustAcceptToc`)}
          </p>

          <div className="overflow-y-auto max-h-96 mt-5 pr-4 text-left">
            {props.terms && (
              <MarkdownSection padding={false} fullwidth={true}>
                <Markdown options={{ disableParsingRawHTML: false }}>{props.terms}</Markdown>
              </MarkdownSection>
            )}
          </div>
        </div>

        <div className="form-card__group pt-0">
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
        </div>

        <div className="border-b" />

        <div className="form-card__pager">
          <div className="form-card__pager-row primary">
            <Button styleType={AppearanceStyleType.primary} data-testid="form-submit">
              {t("t.submit")}
            </Button>
          </div>
        </div>
      </FormCard>
    </Form>
  )
}

export { FormTerms as default, FormTerms }

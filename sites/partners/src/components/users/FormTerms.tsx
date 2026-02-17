import React from "react"
import Markdown from "markdown-to-jsx"
import { useForm } from "react-hook-form"
import { Field, Form, MarkdownSection, t } from "@bloom-housing/ui-components"
import { Button, Card, LoadingState } from "@bloom-housing/ui-seeds"
import { BloomCard } from "@bloom-housing/shared-helpers"

type FormTermsInValues = {
  agree: boolean
}

export type FormTermsProps = {
  onSubmit: () => void
  terms?: string
}

const FormTerms = (props: FormTermsProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register, errors, clearErrors } = useForm<FormTermsInValues>()

  return (
    <BloomCard
      iconSymbol="cog"
      title={t(`authentication.terms.reviewToc`)}
      headingPriority={1}
      iconClass={"card-icon"}
      iconOutlined={true}
      headingClass="seeds-large-heading"
      subtitle={t(`authentication.terms.youMustAcceptToc`)}
    >
      <Form id="terms" onSubmit={handleSubmit(props.onSubmit)}>
        <Card.Section>
          <LoadingState loading={!props.terms}>
            <div className="overflow-y-auto max-h-96 text-left">
              {props.terms && (
                <MarkdownSection padding={false} fullwidth={true}>
                  <Markdown options={{ disableParsingRawHTML: false }}>{props.terms}</Markdown>
                </MarkdownSection>
              )}
            </div>
          </LoadingState>

          <Field
            id="agree"
            name="agree"
            type="checkbox"
            className="seeds-m-bs-content"
            label={t(`authentication.terms.acceptToc`)}
            register={register}
            validation={{ required: true }}
            error={!!errors.agree}
            errorMessage={t("errors.agreeError")}
            dataTestId="agree"
            inputProps={{
              onChange: () => clearErrors("agree"),
            }}
          />
        </Card.Section>

        <Card.Section className={"primary-bg seeds-m-bs-section"}>
          <Button type="submit" variant="primary" id="form-submit">
            {t("t.submit")}
          </Button>
        </Card.Section>
      </Form>
    </BloomCard>
  )
}

export { FormTerms as default, FormTerms }

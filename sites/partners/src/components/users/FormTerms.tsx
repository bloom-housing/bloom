import React from "react"
import { Field, t } from "@bloom-housing/ui-components"
import { Button, Card } from "@bloom-housing/ui-seeds"
import Markdown from "markdown-to-jsx"
import { useForm } from "react-hook-form"
import { BloomCard, Form } from "@bloom-housing/shared-helpers"

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
    <BloomCard
      iconSymbol="cog"
      title={t(`authentication.terms.reviewToc`)}
      subtitle={t(`authentication.terms.youMustAcceptToc`)}
    >
      <Form id="terms" disableSubmitOnEnter onSubmit={handleSubmit(props.onSubmit)}>
        <Card.Section>
          <div className="overflow-y-auto max-h-96 pr-4">
            {props.terms && (
              <Markdown className="bloom-markdown" options={{ disableParsingRawHTML: false }}>
                {props.terms}
              </Markdown>
            )}
          </div>
        </Card.Section>
        <Card.Section>
          <Field
            id="agree"
            name="agree"
            type="checkbox"
            label={t(`authentication.terms.acceptToc`)}
            register={register}
            validation={{ required: true }}
            error={!!errors.agree}
            errorMessage={t("errors.agreeError")}
            dataTestId="agree"
          />
        </Card.Section>
        <Card.Footer>
          <Card.Section>
            <Button type="submit" variant="primary" id="form-submit">
              {t("t.submit")}
            </Button>
          </Card.Section>
        </Card.Footer>
      </Form>
    </BloomCard>
  )
}

export { FormTerms as default, FormTerms }

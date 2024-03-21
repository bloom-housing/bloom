import React, { useState } from "react"
import { faGear } from "@fortawesome/free-solid-svg-icons"
import { Field, Form, t } from "@bloom-housing/ui-components"
import { Button, Heading } from "@bloom-housing/ui-seeds"
import Markdown from "markdown-to-jsx"
import { useForm } from "react-hook-form"
import { BloomCard } from "../../../../../shared-helpers/src/views/components/BloomCard"
import { CardSection, CardFooter } from "@bloom-housing/ui-seeds/src/blocks/Card"
import styles from "../../../../../shared-helpers/src/views/terms/form-terms.module.scss"

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
  const [notChecked, setChecked] = useState(true)

  return (
    <Form id="terms" onSubmit={handleSubmit(props.onSubmit)}>
      <BloomCard
        standardIcon={faGear}
        title={t("authentication.terms.reviewToc")}
        headingPriority={1}
        iconClassName={styles["form-icon-partners"]}
      >
        <>
          <CardSection className={styles["form-terms"]}>
            <p>{t("authentication.terms.partnersAccept")}</p>
            <Heading size="lg" priority={2}>
              {t("authentication.terms.termsOfUse")}
            </Heading>
            <Markdown>{t("authentication.terms.partnersTerms")}</Markdown>
          </CardSection>
          <CardSection className={styles["form-accept"]}>
            <Field
              id="agree"
              name="agree"
              type="checkbox"
              label={t(`authentication.terms.acceptExtended`)}
              register={register}
              validation={{ required: true }}
              error={!!errors.agree}
              errorMessage={t("errors.agreeError")}
              dataTestId="agree"
              onChange={() => setChecked(!notChecked)}
            />
          </CardSection>
          <CardFooter className={styles["form-submit-partners"]}>
            <Button disabled={notChecked} type="submit" variant="primary" id="form-submit">
              {t("t.submit")}
            </Button>
          </CardFooter>
        </>
      </BloomCard>
    </Form>
  )
}

export { FormTerms as default, FormTerms }

import React from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, GridCell, Field } from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"
import { YesNoAnswer } from "../../../../lib/helpers"

const FormTerms = () => {
  const formMethods = useFormContext()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  return (
    <GridSection title={t("application.review.terms.title")} separator>
      <GridCell>
        <FieldValue label={t("application.details.signatureOnTerms")}>
          <div className="flex h-12 items-center">
            <Field
              id="application.acceptedTermsYes"
              name="application.acceptedTerms"
              className="m-0"
              type="radio"
              label={t("t.yes")}
              register={register}
              inputProps={{
                value: YesNoAnswer.Yes,
              }}
            />

            <Field
              id="application.acceptedTermsNo"
              name="application.acceptedTerms"
              className="m-0"
              type="radio"
              label={t("t.no")}
              register={register}
              inputProps={{
                value: YesNoAnswer.No,
              }}
            />
          </div>
        </FieldValue>
      </GridCell>
    </GridSection>
  )
}

export { FormTerms as default, FormTerms }

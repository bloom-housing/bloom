import React from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, ViewItem, GridCell, Field } from "@bloom-housing/ui-components"

export enum FormTermsFields {
  AcceptedTerms = "application.acceptedTerms",
}

export enum FormTermsAcceptedValue {
  Yes = "yes",
  No = "no",
}

const FormTerms = () => {
  const formMethods = useFormContext()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  return (
    <GridSection title={t("application.review.terms.title")} separator>
      <GridCell>
        <ViewItem label={t("application.details.signatureOnTerms")}>
          <div className="flex h-12 items-center">
            <Field
              id={`${FormTermsFields.AcceptedTerms}Yes`}
              name={FormTermsFields.AcceptedTerms}
              className="m-0"
              type="radio"
              label={t("t.yes")}
              register={register}
              inputProps={{
                value: FormTermsAcceptedValue.Yes,
              }}
            />

            <Field
              id={`${FormTermsFields.AcceptedTerms}No`}
              name={FormTermsFields.AcceptedTerms}
              className="m-0"
              type="radio"
              label={t("t.no")}
              register={register}
              inputProps={{
                value: FormTermsAcceptedValue.No,
              }}
            />
          </div>
        </ViewItem>
      </GridCell>
    </GridSection>
  )
}

export { FormTerms as default, FormTerms }

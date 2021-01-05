import React from "react"
import { t, GridSection, ViewItem, GridCell, Field } from "@bloom-housing/ui-components"
import { FormMethods } from "./types"

type FormTermsProps = FormMethods

const FormTerms = ({ register }: FormTermsProps) => {
  return (
    <GridSection title={t("application.review.terms.title")} separator>
      <GridCell>
        <ViewItem label={t("application.details.signatureOnTerms")}>
          <div className="flex h-12 items-center">
            <Field
              id="application.acceptedTermsYes"
              name="application.acceptedTerms"
              className="m-0"
              type="radio"
              label={t("t.yes")}
              register={register}
              inputProps={{
                value: "yes",
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
                value: "no",
              }}
            />
          </div>
        </ViewItem>
      </GridCell>
    </GridSection>
  )
}

export { FormTerms as default, FormTerms }

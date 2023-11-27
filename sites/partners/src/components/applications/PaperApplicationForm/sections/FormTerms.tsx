import React from "react"
import { useFormContext } from "react-hook-form"
import { t, Field } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { YesNoAnswer } from "../../../../lib/helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"

const FormTerms = () => {
  const formMethods = useFormContext()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid heading={t("application.review.terms.title")}>
        <Grid.Row>
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
        </Grid.Row>
      </SectionWithGrid>
    </>
  )
}

export { FormTerms as default, FormTerms }

import React from "react"
import { useFormContext } from "react-hook-form"
import { t, Field } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { YesNoEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
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
          <Grid.Cell>
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
                    value: YesNoEnum.yes,
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
                    value: YesNoEnum.no,
                  }}
                />
              </div>
            </FieldValue>
          </Grid.Cell>
        </Grid.Row>
      </SectionWithGrid>
    </>
  )
}

export { FormTerms as default, FormTerms }

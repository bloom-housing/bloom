import React from "react"
import { useFormContext } from "react-hook-form"
import { t, GridSection, Field } from "@bloom-housing/ui-components"

const Verification = ({
  setAlert,
}: {
  setAlert: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  return (
    <div id="isVerifiedContainer">
      <GridSection
        grid={false}
        separator
        title={t("listings.sections.verification")}
        description={t("listings.sections.verificationSubtitle")}
      >
        <GridSection columns={2}>
          <Field
            label={t("listings.sections.isVerified")}
            name={"isVerified"}
            id={"isVerified"}
            type={"checkbox"}
            register={register}
            inputProps={{
              onChange: (e) => {
                setAlert(!e.target.checked)
              },
            }}
          />
        </GridSection>
      </GridSection>
    </div>
  )
}

export default Verification

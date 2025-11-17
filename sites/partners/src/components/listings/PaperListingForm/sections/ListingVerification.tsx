import { Field, t } from "@bloom-housing/ui-components"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { useFormContext } from "react-hook-form"
import { useContext } from "react"
import { AuthContext } from "@bloom-housing/shared-helpers"
import styles from "../ListingForm.module.scss"

type ListingVerificationProps = {
  jurisdiction: string
}

const ListingVerification = (props: ListingVerificationProps) => {
  const { doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  const enableIsVerified = doJurisdictionsHaveFeatureFlagOn("enableIsVerified", props.jurisdiction)

  return (
    <>
      {enableIsVerified && (
        <SectionWithGrid
          heading={t("listings.sections.verificationTitle")}
          subheading={t("listings.sections.verificationSubtitle")}
        >
          <Field
            id="isVerified"
            name="isVerified"
            type="checkbox"
            label={t("listings.sections.verificationLabel")}
            dataTestId="verifyListing"
            register={register}
            labelClassName={styles["label-option"]}
          />
        </SectionWithGrid>
      )}
    </>
  )
}

export default ListingVerification

import { Field, t } from "@bloom-housing/ui-components"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { useFormContext } from "react-hook-form"
import styles from "../ListingForm.module.scss"

type ListingVerificationProps = {
  enableIsVerified?: boolean
}

const ListingVerification = (props: ListingVerificationProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  return (
    <>
      {props.enableIsVerified && (
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

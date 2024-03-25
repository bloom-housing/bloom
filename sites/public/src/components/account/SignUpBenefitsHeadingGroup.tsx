import React from "react"
import { t } from "@bloom-housing/ui-components"
import { HeadingGroup } from "@bloom-housing/ui-seeds"
import styles from "./SignUpBenefitsHeadingGroup.module.scss"

const SignUpBenefitsHeadingGroup = (props: { mobileView: boolean }) => {
  return (
    <HeadingGroup
      heading={t("account.signUpSaveTime.title")}
      subheading={t("account.signUpSaveTime.subTitle")}
      size="2xl"
      className={props.mobileView ? styles["sign-up-benefits-heading-group"] : ""}
    />
  )
}

export default SignUpBenefitsHeadingGroup

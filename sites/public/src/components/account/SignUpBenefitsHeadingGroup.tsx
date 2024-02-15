import React from "react"
import { t } from "@bloom-housing/ui-components"
import { HeadingGroup } from "@bloom-housing/ui-seeds"

const SignUpBenefitsHeadingGroup = (props: { mobileView: boolean }) => {
  const classNames = props.mobileView ? "py-6 px-4" : ""
  return (
    <HeadingGroup
      heading={t("account.signUpSaveTime.title")}
      subheading={t("account.signUpSaveTime.subTitle")}
      size="2xl"
      className={classNames}
    />
  )
}

export default SignUpBenefitsHeadingGroup

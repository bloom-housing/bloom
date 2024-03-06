import { t } from "@bloom-housing/ui-components"
import { HeadingGroup } from "@bloom-housing/ui-seeds"

const SignUpBenefitsHeadingGroup = (props: { mobileView: boolean }) => {
  const classNames = props.mobileView ? "pt-6 pb-2 md:pb-6 sm:pt-0 px-4" : ""
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

import { Icon } from "@bloom-housing/ui-seeds"
import { CustomIconMap } from "@bloom-housing/shared-helpers"
import ClockIcon from "@heroicons/react/24/solid/ClockIcon"
import EyeIcon from "@heroicons/react/24/solid/EyeIcon"
import { t } from "@bloom-housing/ui-components"
import styles from "./SignUpBenefits.module.scss"

type SignUpBenefitsProps = {
  className?: string
  idTag?: string
}
const SignUpBenefits = (props: SignUpBenefitsProps) => {
  const iconListItems = [
    { icon: <ClockIcon />, text: t("account.signUpSaveTime.applyFaster") },
    { icon: <EyeIcon />, text: t("account.signUpSaveTime.checkStatus") },
    { icon: CustomIconMap.lockClosed, text: t("account.signUpSaveTime.resetPassword") },
  ]
  const classNames = [styles["sign-up-benefits-container"]]
  if (props.className) classNames.push(props.className)
  return (
    <ul className={classNames.join(" ")}>
      {iconListItems.map((item) => (
        <li className={styles["sign-up-benefits-item"]} key={`${item.text}-${props.idTag}`}>
          <Icon size="xl" className={styles["icon"]}>
            {item.icon}
          </Icon>
          <p className={styles["text"]}>{item.text}</p>
        </li>
      ))}
    </ul>
  )
}

export default SignUpBenefits

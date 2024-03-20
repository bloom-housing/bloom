import { Icon } from "@bloom-housing/ui-seeds"
import { faStopwatch, faEye, faLock } from "@fortawesome/free-solid-svg-icons"
import { t } from "@bloom-housing/ui-components"
import styles from "./SignUpBenefits.module.scss"

type SignUpBenefitsProps = {
  className?: string
  idTag?: string
}
const SignUpBenefits = (props: SignUpBenefitsProps) => {
  const iconListItems = [
    { icon: faStopwatch, text: t("account.signUpSaveTime.applyFaster") },
    { icon: faEye, text: t("account.signUpSaveTime.checkStatus") },
    {
      icon: faLock,
      text: process.env.showPwdless
        ? t("account.signUpSaveTime.useACode")
        : t("account.signUpSaveTime.resetPassword"),
    },
  ]

  const classNames = [styles["sign-up-benefits-container"]]
  if (props.className) classNames.push(props.className)
  return (
    <ul className={classNames.join(" ")}>
      {iconListItems.map((item) => (
        <li className={styles["sign-up-benefits-item"]} key={`${item.text}-${props.idTag}`}>
          <Icon icon={item.icon} size="xl" className={styles["icon"]} />
          <p className={styles["text"]}>{item.text}</p>
        </li>
      ))}
    </ul>
  )
}

export default SignUpBenefits

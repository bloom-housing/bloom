import React from "react"
import { Icon } from "@bloom-housing/ui-seeds"
import { CustomIconMap } from "@bloom-housing/shared-helpers"
import { t } from "@bloom-housing/ui-components"
import styles from "./SignUpBenefits.module.scss"

// We're still using Font Awesome for these particular icons

const StopwatchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
    <path d="M176 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h16V98.4C92.3 113.8 16 200 16 304c0 114.9 93.1 208 208 208s208-93.1 208-208c0-41.8-12.3-80.7-33.5-113.2l24.1-24.1c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L355.7 143c-28.1-23-62.2-38.8-99.7-44.6V64h16c17.7 0 32-14.3 32-32s-14.3-32-32-32H224 176zm72 192V320c0 13.3-10.7 24-24 24s-24-10.7-24-24V192c0-13.3 10.7-24 24-24s24 10.7 24 24z" />
  </svg>
)

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
    <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
  </svg>
)

type SignUpBenefitsProps = {
  className?: string
  idTag?: string
}
const SignUpBenefits = (props: SignUpBenefitsProps) => {
  const iconListItems = [
    { icon: <StopwatchIcon />, size: "lg", text: t("account.signUpSaveTime.applyFaster") },
    { icon: <EyeIcon />, size: "lg", text: t("account.signUpSaveTime.checkStatus") },
    {
      icon: CustomIconMap.lockClosed,
      size: "xl",
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
          <Icon size="xl" className={[styles["icon"], styles[`icon-size-${item.size}`]].join(" ")}>
            {item.icon}
          </Icon>
          <p className={styles["text"]}>{item.text}</p>
        </li>
      ))}
    </ul>
  )
}

export default SignUpBenefits

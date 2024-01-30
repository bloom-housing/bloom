import { Icon } from "@bloom-housing/ui-seeds"
import { faStopwatch, faEye, faLock } from "@fortawesome/free-solid-svg-icons"
import { t } from "@bloom-housing/ui-components"

type SignUpBenefitsProps = {
  className?: string
  idTag?: string
}
const SignUpBenefits = (props: SignUpBenefitsProps) => {
  const iconListItems = [
    { icon: faStopwatch, text: t("account.signUpSaveTime.applyFaster") },
    { icon: faEye, text: t("account.signUpSaveTime.checkStatus") },
    { icon: faLock, text: t("account.signUpSaveTime.resetPassword") },
  ]
  const classNames = ["flex flex-col pt-6 pb-6 pr-4 pl-4 md:p-0"]
  if (props.className) classNames.push(props.className)
  return (
    <ul className={classNames.join(" ")}>
      {iconListItems.map((item) => (
        <li className="flex flex-row mb-2 items-center" key={`${item.text}-${props.idTag}`}>
          <Icon
            icon={item.icon}
            size="xl"
            className="border border-white bg-white rounded-full p-2.5"
          />
          <p className="ml-3">{item.text}</p>
        </li>
      ))}
    </ul>
  )
}

export default SignUpBenefits

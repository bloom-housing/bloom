import * as React from "react"
import { t } from "../../../helpers/translator"
import { Icon } from "../../../icons/Icon"

interface ReferralApplicationProps {
  description: string
  phoneNumber: string
  title: string
}

const ReferralApplication = (props: ReferralApplicationProps) => {
  const linkedPhoneNumber = `tel:${props.phoneNumber.replace(/[-()]/g, "")}`

  return (
    <section className="aside-block -mx-4 pt-0 md:mx-0 md:pt-4">
      <h2 className="text-caps-underline">{props.title}</h2>
      <p>
        <a href={linkedPhoneNumber}>
          <Icon symbol="phone" size="medium" /> {t("t.call")} {props.phoneNumber}
        </a>
      </p>
      <p className="text-tiny mt-4 text-gray-800">{props.description}</p>
    </section>
  )
}

export { ReferralApplication as default, ReferralApplication }

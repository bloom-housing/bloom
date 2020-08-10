import React from "react"
import { useRouter } from "next/router"
import { HouseholdMember } from "@bloom-housing/core"
import { t } from "../helpers/translator"

const HouseholdMemberForm = (props: { member: HouseholdMember; type: string }) => {
  const { member, type } = props
  const router = useRouter()

  const editMember = () => {
    if (member.id != undefined && member.id >= 0) {
      router
        .push({
          pathname: "/applications/household/member",
          query: { memberId: member.id },
        })
        .then(() => window.scrollTo(0, 0))
    } else {
      router.push("/applications/contact/name").then(() => window.scrollTo(0, 0))
    }
  }
  return (
    <div className="info-item mb-4 pb-4 border-b text-left">
      <p className="info-item__value">
        {member.firstName} {member.lastName}
      </p>
      <h4 className="info-item__label">{type}</h4>
      <a className="edit-link info-item__link" href="#" onClick={editMember}>
        {t("label.edit")}
      </a>
    </div>
  )
}

export { HouseholdMemberForm as default, HouseholdMemberForm }

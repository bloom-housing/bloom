import React from "react"
import Router from "next/router"
import { HouseholdMember } from "@bloom-housing/core"
import { t } from "../helpers/translator"

const HouseholdMemberForm = (props: { member: HouseholdMember; type: string }) => {
  const { member, type } = props
  const editMember = () => {
    if (member.id != undefined && member.id >= 0) {
      Router.push({
        pathname: "/applications/household/member",
        query: { memberId: member.id },
      }).then(() => window.scrollTo(0, 0))
    } else {
      Router.push("/applications/contact/name").then(() => window.scrollTo(0, 0))
    }
  }
  return (
    <div className="info-item mb-4 pb-4 border-b text-left">
      <p className="info-item__value">
        {member.firstName} {member.lastName}
      </p>
      <h4 className="info-item__name">{type}</h4>
      <a className="edit-link info-item__link" href="#" onClick={editMember}>
        {t("label.edit")}
      </a>
    </div>
  )
}

export { HouseholdMemberForm as default, HouseholdMemberForm }

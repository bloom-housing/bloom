import React from "react"
import { useRouter } from "next/router"
import { HouseholdMember } from "@bloom-housing/core"
import { t } from "../helpers/translator"
import { ViewItem } from "../blocks/ViewItem"

const HouseholdMemberForm = (props: { member: HouseholdMember; type: string }) => {
  const { member, type } = props
  const router = useRouter()

  const editMember = () => {
    if (member.id != undefined && member.id >= 0) {
      void router
        .push({
          pathname: "/applications/household/member",
          query: { memberId: member.id },
        })
        .then(() => window.scrollTo(0, 0))
    } else {
      void router.push("/applications/contact/name").then(() => window.scrollTo(0, 0))
    }
  }
  return (
    <ViewItem helper={type} className="pb-4 border-b text-left">
      {member.firstName} {member.lastName}
      <a className="edit-link" href="#" onClick={editMember}>
        {t("label.edit")}
      </a>
    </ViewItem>
  )
}

export { HouseholdMemberForm as default, HouseholdMemberForm }

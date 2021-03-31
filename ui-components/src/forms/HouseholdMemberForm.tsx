import React from "react"
import { useRouter } from "next/router"
import { HouseholdMemberUpdate } from "@bloom-housing/backend-core/types"
import { t } from "../helpers/translator"
import { ViewItem } from "../blocks/ViewItem"

const HouseholdMemberForm = (props: { member: HouseholdMemberUpdate; type: string }) => {
  const { member, type } = props
  const router = useRouter()

  const editMember = () => {
    if (member.orderId != undefined && member.orderId >= 0) {
      void router.push({
        pathname: "/applications/household/member",
        query: { memberId: member.orderId },
      })
    } else {
      void router.push("/applications/contact/name")
    }
  }
  return (
    <ViewItem helper={type} className="pb-4 border-b text-left">
      {member.firstName} {member.lastName}
      <a id="edit-member" className="edit-link" href="#" onClick={editMember}>
        {t("t.edit")}
      </a>
    </ViewItem>
  )
}

export { HouseholdMemberForm as default, HouseholdMemberForm }

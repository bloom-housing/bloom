import React from "react"
import { useRouter } from "next/router"
import { HouseholdMemberUpdate } from "@bloom-housing/backend-core/types"
import { t } from "../helpers/translator"
import { AppearanceStyleType } from "../global/AppearanceTypes"
import { Icon } from "../icons/Icon"
import { ViewItem } from "../blocks/ViewItem"

const HouseholdMemberForm = (props: {
  member: HouseholdMemberUpdate
  type: string
  editMode?: boolean
}) => {
  const { member, type } = props
  const router = useRouter()
  const editMode = props.editMode !== false // undefined should default to true

  const editMember = () => {
    if (member.orderId != undefined && member.orderId >= 0) {
      void router
        .push({
          pathname: "/applications/household/member",
          query: { memberId: member.orderId },
        })
        .then(() => window.scrollTo(0, 0))
    } else {
      void router.push("/applications/contact/name").then(() => window.scrollTo(0, 0))
    }
  }
  return (
    <ViewItem helper={type} className="pb-4 border-b text-left">
      {member.firstName} {member.lastName}
      {editMode ? (
        <a id="edit-member" className="edit-link" href="#" onClick={editMember}>
          {t("t.edit")}
        </a>
      ) : (
        <Icon
          className="ml-2 absolute top-0 right-0"
          size="medium"
          symbol="lock"
          styleType={AppearanceStyleType.primary}
        />
      )}
    </ViewItem>
  )
}

export { HouseholdMemberForm as default, HouseholdMemberForm }

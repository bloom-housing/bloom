import React from "react"
import { t } from "../helpers/translator"
import { Icon, IconFillColors } from "../icons/Icon"
import { ViewItem } from "../blocks/ViewItem"

export interface HouseholdMemberFormProps {
  editMember?: (memberId: number | undefined) => void
  editMode?: boolean
  memberFirstName: string
  memberId?: number
  memberLastName: string
  subtitle: string
}

const HouseholdMemberForm = (props: HouseholdMemberFormProps) => {
  const editMode = props.editMode !== false && props.editMember // undefined should default to true

  return (
    <ViewItem helper={props.subtitle} className="pb-4 border-b text-left">
      {props.memberFirstName} {props.memberLastName}
      {editMode ? (
        <button
          id="edit-member"
          className="edit-link"
          onClick={() => props.editMember && props.editMember(props.memberId)}
        >
          {t("t.edit")}
        </button>
      ) : (
        <Icon
          className="ml-2 absolute top-0 right-0"
          size="medium"
          symbol="lock"
          fill={IconFillColors.primary}
        />
      )}
    </ViewItem>
  )
}

export { HouseholdMemberForm as default, HouseholdMemberForm }

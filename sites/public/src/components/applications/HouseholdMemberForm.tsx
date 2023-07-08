import React from "react"
import { ViewItem, t } from "@bloom-housing/ui-components"
import { Icon } from "@bloom-housing/ui-seeds"
import { faLock } from "@fortawesome/free-solid-svg-icons"

export interface HouseholdMemberFormProps {
  editMember?: (memberId: number | undefined) => void
  editMode?: boolean
  memberFirstName: string
  memberId?: number
  memberLastName: string
  subtitle: string
  strings?: {
    edit?: string
  }
}

const HouseholdMemberForm = (props: HouseholdMemberFormProps) => {
  const editMode = props.editMode !== false && props.editMember // undefined should default to true

  return (
    <ViewItem helper={props.subtitle} className="pb-4 border-b text-left">
      {props.memberFirstName} {props.memberLastName}
      {editMode ? (
        <button
          id={`edit-member-${props.memberFirstName}-${props.memberLastName}`}
          className="edit-link"
          onClick={() => props.editMember && props.editMember(props.memberId)}
          type={"button"}
          data-testid={"app-household-member-edit-button"}
        >
          {props.strings?.edit ?? t("t.edit")}
        </button>
      ) : (
        <Icon icon={faLock} className="ml-2 absolute top-0 right-0 text-primary" />
      )}
    </ViewItem>
  )
}

export { HouseholdMemberForm as default, HouseholdMemberForm }

import React from "react"
import { Icon, IconFillColors, t } from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"

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
    <FieldValue helper={props.subtitle} className="pb-4 border-b text-left">
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
        <Icon
          className="ml-2 absolute top-0 right-0"
          size="medium"
          symbol="lock"
          fill={IconFillColors.primary}
        />
      )}
    </FieldValue>
  )
}

export { HouseholdMemberForm as default, HouseholdMemberForm }

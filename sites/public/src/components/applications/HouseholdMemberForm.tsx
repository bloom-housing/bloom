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
    <div className="flex justify-between flex-row border-b">
      <FieldValue helpText={props.subtitle} className="py-4 text-left">
        {props.memberFirstName} {props.memberLastName}
      </FieldValue>
      <div>
        {editMode ? (
          <button
            id={`edit-member-${props.memberFirstName}-${props.memberLastName}`}
            className="edit-link pt-4"
            onClick={() => props.editMember && props.editMember(props.memberId)}
            type={"button"}
            data-testid={"app-household-member-edit-button"}
          >
            {props.strings?.edit ?? t("t.edit")}
          </button>
        ) : (
          <Icon
            className="ml-2 pt-4 block"
            size="medium"
            symbol="lock"
            fill={IconFillColors.primary}
          />
        )}
      </div>
    </div>
  )
}

export { HouseholdMemberForm as default, HouseholdMemberForm }

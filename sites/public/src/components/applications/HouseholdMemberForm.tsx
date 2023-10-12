import React from "react"
import { Icon, IconFillColors, t } from "@bloom-housing/ui-components"
import { Button, FieldValue } from "@bloom-housing/ui-seeds"

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
          <Button
            id={`edit-member-${props.memberFirstName}-${props.memberLastName}`}
            type="button"
            variant="text"
            className="pt-4 app-household-member-edit-button"
            onClick={() => props.editMember && props.editMember(props.memberId)}
          >
            {props.strings?.edit ?? t("t.edit")}
          </Button>
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

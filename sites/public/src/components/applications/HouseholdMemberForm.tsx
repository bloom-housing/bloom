import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, FieldValue, Icon } from "@bloom-housing/ui-seeds"
import { CustomIconMap } from "@bloom-housing/shared-helpers"

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
          <Icon className="ml-2 mt-4 text-primary" size="md">
            {CustomIconMap.lockClosed}
          </Icon>
        )}
      </div>
    </div>
  )
}

export { HouseholdMemberForm as default, HouseholdMemberForm }

import React from "react"
import { Icon, IconFillColors, t } from "@bloom-housing/ui-components"
import { Button, FieldValue } from "@bloom-housing/ui-seeds"
import styles from "../../layouts/application-form.module.scss"

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
    <div className={styles["application-form-household-member"]}>
      <FieldValue helpText={props.subtitle}>
        {props.memberFirstName} {props.memberLastName}
      </FieldValue>
      <div>
        {editMode ? (
          <Button
            id={`edit-member-${props.memberFirstName}-${props.memberLastName}`}
            type="button"
            variant="text"
            className="app-household-member-edit-button pb-1"
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

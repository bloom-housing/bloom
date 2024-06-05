import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, FieldValue, Icon } from "@bloom-housing/ui-seeds"
import { CustomIconMap } from "@bloom-housing/shared-helpers"
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
      <FieldValue
        className={styles["application-form-household-field-value"]}
        helpText={props.subtitle}
      >
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
          <Icon className="ml-2 mt-4 text-primary" size="md">
            {CustomIconMap.lockClosed}
          </Icon>
        )}
      </div>
    </div>
  )
}

export { HouseholdMemberForm as default, HouseholdMemberForm }

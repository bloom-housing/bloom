import React from "react"
import { faClone, faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons"
import { Icon, IconFillColors } from "@bloom-housing/ui-components"

type IconContentProps = {
  onCopy: () => void
  copyTestId: string
  onDelete?: () => void
  deleteTestId?: string
  onEdit: () => void
  editTestId: string
}

const ManageIconSection = (props: IconContentProps) => {
  return (
    <div className={"flex justify-end"}>
      <div className={"w-max"}>
        <button onClick={props.onEdit} aria-label={"Edit"} data-test-id={props.editTestId}>
          <Icon
            symbol={faPenToSquare}
            size={"medium"}
            fill={IconFillColors.primary}
            className={"mr-5"}
          />
        </button>
        <button onClick={props.onCopy} aria-label={"Copy"} data-test-id={props.copyTestId}>
          <Icon
            symbol={faClone}
            size={"medium"}
            fill={IconFillColors.primary}
            className={`${props.onDelete && "mr-5"}`}
          />
        </button>
        {props.onDelete && (
          <button
            onClick={props.onDelete}
            aria-label={"Delete"}
            data-test-id={props.deleteTestId}
            data-testid={props.deleteTestId}
          >
            <Icon symbol={faTrashCan} size={"medium"} fill={IconFillColors.alert} />
          </button>
        )}
      </div>
    </div>
  )
}

export default ManageIconSection

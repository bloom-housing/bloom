import React from "react"
import { faClone, faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons"
import { Icon } from "@bloom-housing/ui-seeds"

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
        <button onClick={props.onEdit} aria-label={"Edit"} data-testid={props.editTestId}>
          <Icon icon={faPenToSquare} className={"mr-5 text-primary"} />
        </button>
        <button onClick={props.onCopy} aria-label={"Copy"} data-testid={props.copyTestId}>
          <Icon icon={faClone} className={`${props.onDelete && "mr-5"} text-primary`} />
        </button>
        {props.onDelete && (
          <button onClick={props.onDelete} aria-label={"Delete"} data-testid={props.deleteTestId}>
            <Icon icon={faTrashCan} className="text-alert" />
          </button>
        )}
      </div>
    </div>
  )
}

export default ManageIconSection

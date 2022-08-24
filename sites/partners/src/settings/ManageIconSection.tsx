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
        <button
          onClick={props.onEdit}
          className={"cursor-pointer"}
          aria-label={"Edit"}
          data-test-id={props.editTestId}
        >
          <Icon
            symbol={faPenToSquare}
            size={"medium"}
            fill={IconFillColors.primary}
            className={"mr-5"}
          />
        </button>
        <button
          onClick={props.onCopy}
          className={"cursor-pointer"}
          aria-label={"Copy"}
          data-test-id={props.copyTestId}
        >
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
            className={"cursor-pointer"}
            aria-label={"Delete"}
            data-test-id={props.deleteTestId}
          >
            <Icon symbol={faTrashCan} size={"medium"} fill={IconFillColors.alert} />
          </button>
        )}
      </div>
    </div>
  )
}

export default ManageIconSection

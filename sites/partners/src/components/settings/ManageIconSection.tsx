import React from "react"
import { faClone, faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons"
import { Icon, IconFillColors, UniversalIconType } from "@bloom-housing/ui-components"

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
          <Icon
            symbol={faPenToSquare as UniversalIconType}
            size={"medium"}
            fill={IconFillColors.primary}
            className={"mr-5"}
          />
        </button>
        <button onClick={props.onCopy} aria-label={"Copy"} data-testid={props.copyTestId}>
          <Icon
            symbol={faClone as UniversalIconType}
            size={"medium"}
            fill={IconFillColors.primary}
            className={`${props.onDelete && "mr-5"}`}
          />
        </button>
        {props.onDelete && (
          <button onClick={props.onDelete} aria-label={"Delete"} data-testid={props.deleteTestId}>
            <Icon
              symbol={faTrashCan as UniversalIconType}
              size={"medium"}
              fill={IconFillColors.alert}
            />
          </button>
        )}
      </div>
    </div>
  )
}

export default ManageIconSection

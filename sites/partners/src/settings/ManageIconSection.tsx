import React from "react"
import { faClone, faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons"
import { Icon, IconFillColors } from "@bloom-housing/ui-components"

type IconContentProps = {
  onCopy: () => void
  onDelete?: () => void
  onEdit: () => void
}

const ManageIconSection = (props: IconContentProps) => {
  return (
    <div className={"flex justify-end"}>
      <div className={"w-max"}>
        <button onClick={props.onEdit} className={"cursor-pointer"}>
          <Icon
            symbol={faPenToSquare}
            size={"medium"}
            fill={IconFillColors.primary}
            className={"mr-5"}
          />
        </button>
        <button onClick={props.onCopy} className={"cursor-pointer"}>
          <Icon
            symbol={faClone}
            size={"medium"}
            fill={IconFillColors.primary}
            className={`${props.onDelete && "mr-5"}`}
          />
        </button>
        {props.onDelete && (
          <button onClick={props.onDelete} className={"cursor-pointer"}>
            <Icon symbol={faTrashCan} size={"medium"} fill={IconFillColors.alert} />
          </button>
        )}
      </div>
    </div>
  )
}

export default ManageIconSection

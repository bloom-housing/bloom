import React from "react"
import { Icon } from "@bloom-housing/ui-seeds"
import DocumentDuplicateIcon from "@heroicons/react/24/solid/DocumentDuplicateIcon"
import PencilSquareIcon from "@heroicons/react/24/solid/PencilSquareIcon"
import TrashIcon from "@heroicons/react/24/solid/TrashIcon"

type IconContentProps = {
  onCopy: () => void
  copyTestId: string
  onDelete?: () => void
  deleteTestId?: string
  onEdit: () => void
  editTestId: string
  align?: "end" | "start"
}

const ManageIconSection = ({ align = "end", ...props }: IconContentProps) => {
  return (
    <div className={`flex justify-${align} gap-5`}>
      <button
        className="text-primary"
        onClick={props.onEdit}
        aria-label={"Edit"}
        data-testid={props.editTestId}
      >
        <Icon size="md">
          <PencilSquareIcon />
        </Icon>
      </button>
      <button
        className="text-primary"
        onClick={props.onCopy}
        aria-label={"Copy"}
        data-testid={props.copyTestId}
      >
        <Icon size="md">
          <DocumentDuplicateIcon />
        </Icon>
      </button>
      {props.onDelete && (
        <button
          className="text-alert"
          onClick={props.onDelete}
          aria-label={"Delete"}
          data-testid={props.deleteTestId}
        >
          <Icon size="md">
            <TrashIcon />
          </Icon>
        </button>
      )}
    </div>
  )
}

export default ManageIconSection

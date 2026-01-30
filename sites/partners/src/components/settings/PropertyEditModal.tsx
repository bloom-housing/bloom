import React, { useMemo } from "react"
import { MinimalTable, t } from "@bloom-housing/ui-components"
import { Button, Dialog, Link } from "@bloom-housing/ui-seeds"
import { Property } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

type PropertyEditModalProps = {
  onClose: () => void
  onEdit: () => void
  properties: Property[]
  selectedPropertyId: string
}

export const PropertyEditModal = ({
  properties,
  selectedPropertyId,
  onClose,
  onEdit,
}: PropertyEditModalProps) => {
  const property = properties.find((property) => property?.id === selectedPropertyId)

  const listingsTableData = useMemo(
    () =>
      [property]?.map((listing) => ({
        name: {
          content: <Link href={`/listings/${listing?.id}`}>{listing?.name}</Link>,
        },
      })),
    [property]
  )

  if (properties?.length === 0) {
    onEdit()
    onClose()
    return null
  }

  return (
    <Dialog
      isOpen={properties.length > 1}
      onClose={onClose}
      ariaLabelledBy="preference-changes-modal-header"
      ariaDescribedBy="preference-changes-modal-description"
    >
      <Dialog.Header id="preference-changes-modal-header">
        {t("settings.preferenceChangesRequiredEdit")}
      </Dialog.Header>
      <Dialog.Content>
        <div className="pb-3" id="preference-changes-modal-description">
          {t("settings.preferenceEditError")}
        </div>
        <MinimalTable
          headers={{ name: "listings.listingName" }}
          data={listingsTableData}
          cellClassName={" "}
        />
      </Dialog.Content>
      <Dialog.Footer>
        <Button type="button" variant="primary" onClick={onClose} size="sm">
          {t("t.done")}
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}

import React, { useMemo } from "react"
import { MinimalTable, t } from "@bloom-housing/ui-components"
import { Button, Dialog, Link } from "@bloom-housing/ui-seeds"
import { Listing, Property } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

type PropertyEditModalProps = {
  onClose: () => void
  onEdit: () => void
  property: Property
  listings: Listing[]
}

export const PropertyEditModal = ({
  property,
  listings,
  onClose,
  onEdit,
}: PropertyEditModalProps) => {
  const listingsWithProperty = listings?.filter((listing) => listing.property?.id === property?.id)

  const listingsTableData = useMemo(
    () =>
      listingsWithProperty?.map((listing) => ({
        name: {
          content: <Link href={`/listings/${listing.id}`}>{listing.name}</Link>,
        },
      })),
    [listingsWithProperty]
  )

  if (listingsWithProperty?.length === 0) {
    onEdit()
    return null
  }

  return (
    <Dialog
      isOpen={!!property}
      onClose={onClose}
      ariaLabelledBy="property-changes-modal-header"
      ariaDescribedBy="property-changes-modal-description"
    >
      <Dialog.Header id="property-changes-modal-header">
        {t("proerties.propertyChangesRequiredEdit")}
      </Dialog.Header>
      <Dialog.Content>
        <div className="pb-3" id="property-changes-modal-description">
          {t("properties.propertyEditError")}
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

import React, { useContext, useMemo } from "react"
import { MinimalTable, t } from "@bloom-housing/ui-components"
import { Button, Dialog, Link } from "@bloom-housing/ui-seeds"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import { Listing, Property } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

type PreferenceDeleteModalProps = {
  onClose: () => void
  property: Property
  listings: Listing[]
}

export const PropertyDeleteModal = ({
  property,
  listings,
  onClose,
}: PreferenceDeleteModalProps) => {
  const { propertiesService } = useContext(AuthContext)
  const { addToast } = useContext(MessageContext)

  const listingsWithProperty = listings.filter((listing) => listing.property?.id === property?.id)

  const listingsTableData = useMemo(
    () =>
      listingsWithProperty?.map((listing) => ({
        name: {
          content: <Link href={`/listings/${listing.id}`}>{listing.name}</Link>,
        },
      })),
    [listingsWithProperty]
  )

  const deleteProperty = () => {
    propertiesService
      .deleteById({
        body: { id: property.id },
      })
      .then(() => {
        addToast(t("properties.propertyAlertDeleted"), { variant: "success" })
        onClose()
      })
      .catch((e) => {
        addToast(t("errors.alert.timeoutPleaseTryAgain"), { variant: "alert" })
        console.log(e)
      })
  }

  if (listingsWithProperty.length > 0) {
    return (
      <Dialog
        isOpen={!!property}
        onClose={onClose}
        ariaLabelledBy="property-changes-modal-header"
        ariaDescribedBy="property-changes-modal-description"
      >
        <Dialog.Header id="property-changes-modal-header">
          {t("properties.propertyChangesRequired")}
        </Dialog.Header>
        <Dialog.Content>
          <div className="pb-3" id="property-changes-modal-description">
            {t("properties.propertyDeleteError")}
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

  return (
    <Dialog
      isOpen={!!property}
      onClose={onClose}
      ariaLabelledBy="property-delete-modal-header"
      ariaDescribedBy="property-delete-modal-description"
    >
      <Dialog.Header id="property-delete-modal-header">{t("t.areYouSure")}</Dialog.Header>
      <Dialog.Content id="property-delete-modal-description">
        {t("properties.propertyDeleteConfirmation")}
      </Dialog.Content>
      <Dialog.Footer>
        <Button type="button" variant="alert" onClick={deleteProperty} size="sm">
          {t("t.delete")}
        </Button>
        <Button
          type="button"
          onClick={onClose}
          ariaLabel={t("t.cancel")}
          variant="primary-outlined"
          size="sm"
        >
          {t("t.cancel")}
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}

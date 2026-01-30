import React, { useContext } from "react"
import { MinimalTable, t } from "@bloom-housing/ui-components"
import { Button, Dialog, Link } from "@bloom-housing/ui-seeds"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import { ListingViews, Property } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { useListingsData } from "../../lib/hooks"

type PreferenceDeleteModalProps = {
  onClose: () => void
  property: Property
}

export const PropertyDeleteModal = ({ property, onClose }: PreferenceDeleteModalProps) => {
  const { multiselectQuestionsService } = useContext(AuthContext)
  const { addToast } = useContext(MessageContext)
  const { listingDtos, listingsLoading } = useListingsData({
    limit: "all",
    view: ListingViews.name,
  })

  const listing = listingDtos?.items.find((listing) => listing.property?.id === property?.id)

  const listingsTableData = {
    name: {
      content: <Link href={`/listings/${listing?.id}`}>{listing?.name}</Link>,
    },
  }

  if (listingsLoading) {
    return null
  }

  const deletePreference = () => {
    multiselectQuestionsService
      .delete({
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

  if (listing?.property) {
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
            data={[listingsTableData]}
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
        {t("properties.propertyDeleteConfirmationn")}
      </Dialog.Content>
      <Dialog.Footer>
        <Button type="button" variant="alert" onClick={deletePreference} size="sm">
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

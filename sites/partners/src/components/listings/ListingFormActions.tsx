import React, { useContext, useMemo } from "react"
import { useRouter } from "next/router"
import dayjs from "dayjs"
import { t, StatusMessages, Icon, setSiteAlertMessage } from "@bloom-housing/ui-components"
import { Button, Link, Grid } from "@bloom-housing/ui-seeds"
import { pdfUrlFromListingEvents, AuthContext } from "@bloom-housing/shared-helpers"
import { ListingContext } from "./ListingContext"
import { ListingEventType, ListingStatus } from "@bloom-housing/backend-core/types"
import { StatusAside } from "../shared/StatusAside"

export enum ListingFormActionsType {
  add = "add",
  edit = "edit",
  details = "details",
}

type ListingFormActionsProps = {
  type: ListingFormActionsType
  showCloseListingModal?: () => void
  showLotteryResultsDrawer?: () => void
  showRequestChangesModal?: () => void
  showSubmitForApprovalModal?: () => void
  submitFormWithStatus?: (confirm?: boolean, status?: ListingStatus) => void
}

const ListingFormActions = ({
  type,
  showCloseListingModal,
  showLotteryResultsDrawer,
  showRequestChangesModal,
  showSubmitForApprovalModal,
  submitFormWithStatus,
}: ListingFormActionsProps) => {
  const listing = useContext(ListingContext)
  const { profile, listingsService } = useContext(AuthContext)
  const router = useRouter()

  const isListingApprover = profile?.roles?.isAdmin

  const listingId = listing?.id

  const recordUpdated = useMemo(() => {
    if (!listing) return null

    const dayjsDate = dayjs(listing.updatedAt)

    return dayjsDate.format("MMMM DD, YYYY")
  }, [listing])

  const actions = useMemo(() => {
    const cancelButton = (
      <Grid.Cell className="flex" key="btn-cancel">
        <Link
          className="w-full justify-center p-3"
          href={type === "add" ? "/" : `/listings/${listingId}`}
        >
          {t("t.cancel")}
        </Link>
      </Grid.Cell>
    )

    const editFromDetailButton = (
      <Grid.Cell key="btn-edit">
        <Button
          className="w-full"
          href={`/listings/${listingId}/edit`}
          type="button"
          dataTestId="listingEditButton"
        >
          {t("t.edit")}
        </Button>
      </Grid.Cell>
    )

    const publishButton = (
      <Grid.Cell key="btn-publish">
        <Button
          id="publishButton"
          type="button"
          className="w-full"
          onClick={() => {
            submitFormWithStatus(true, ListingStatus.active)
          }}
        >
          {t("listings.actions.publish")}
        </Button>
      </Grid.Cell>
    )

    const saveDraftButton = (
      <Grid.Cell key="btn-draft">
        <Button
          type="button"
          variant="primary-outlined"
          className="w-full"
          onClick={() => submitFormWithStatus(false, ListingStatus.pending)}
        >
          {t("listings.actions.draft")}
        </Button>
      </Grid.Cell>
    )

    const saveExitButton = (
      <Grid.Cell key="btn-save">
        <Button
          type="button"
          className="w-full"
          onClick={() => submitFormWithStatus(true, listing.status)}
          dataTestId={"saveAndExitButton"}
        >
          {t("t.saveExit")}
        </Button>
      </Grid.Cell>
    )

    const closeButton = (
      <Grid.Cell key="btn-close">
        <Button
          type="button"
          variant="primary-outlined"
          className="w-full"
          onClick={() => showCloseListingModal && showCloseListingModal()}
        >
          {t("listings.actions.close")}
        </Button>
      </Grid.Cell>
    )

    const unpublishButton = (
      <Grid.Cell key="btn-unpublish">
        <Button
          variant="alert-outlined"
          className="w-full"
          type="button"
          onClick={() => submitFormWithStatus(false, ListingStatus.pending)}
        >
          {t("listings.actions.unpublish")}
        </Button>
      </Grid.Cell>
    )

    const editPostedResultsButton = (lotteryResults) => (
      <Grid.Cell className="flex" key="btn-edit-lottery">
        <Button
          type="button"
          variant="text"
          tailIcon={<Icon size="medium" symbol="edit" className="ml-2" />}
          className="w-full p-3"
          onClick={() => showLotteryResultsDrawer && showLotteryResultsDrawer()}
        >
          {t("listings.actions.resultsPosted")}{" "}
          {dayjs(lotteryResults?.startTime).format("MMMM DD, YYYY")}
        </Button>
      </Grid.Cell>
    )

    const postResultsButton = (
      <Grid.Cell key="btn-post-results">
        <Button
          type="button"
          variant="primary-outlined"
          className="w-full"
          onClick={() => showLotteryResultsDrawer && showLotteryResultsDrawer()}
        >
          {t("listings.actions.postResults")}
        </Button>
      </Grid.Cell>
    )

    const previewButton = (
      <Grid.Cell key="btn-preview">
        <Button
          variant="primary-outlined"
          className="w-full"
          href={`${listing?.jurisdiction.publicUrl}/preview/listings/${listingId}`}
        >
          {t("listings.actions.preview")}
        </Button>
      </Grid.Cell>
    )

    const viewPostedResultsButton = (eventUrl: string) => (
      <Grid.Cell key="btn-preview-results">
        <Link
          href={`${listing?.jurisdiction.publicUrl}/preview/listings/${listingId}`}
          tailIcon={<Icon size="medium" symbol="link" className="ml-2" />}
          className="w-full justify-center p-3"
        >
          {t("listings.actions.previewLotteryResults")}{" "}
        </Link>
      </Grid.Cell>
    )

    const submitButton = (
      <Grid.Cell key="btn-submit">
        <Button
          id="submitButton"
          type="button"
          className="w-full"
          onClick={() => showSubmitForApprovalModal && showSubmitForApprovalModal()}
        >
          {t("t.submit")}
        </Button>
      </Grid.Cell>
    )

    const approveAndPublishButton = (
      <Grid.Cell key="btn-approve-and-publish">
        <Button
          id="approveAndPublishButton"
          type="button"
          className="w-full"
          onClick={async () => {
            // utilize same submit logic if updating status from edit view
            if (type === ListingFormActionsType.edit) {
              submitFormWithStatus(false, ListingStatus.active)
            } else {
              // button only exists for listings approval so can call updateAndNotify directly
              try {
                const result = await listingsService.updateAndNotify({
                  id: listing.id,
                  body: { ...listing, status: ListingStatus.active },
                })
                if (result) {
                  setSiteAlertMessage(t("listings.approval.listingPublished"), "success")
                  await router.push(`/`)
                }
              } catch (err) {
                setSiteAlertMessage(
                  err.response?.data?.message === "email failed"
                    ? "errors.alert.listingsApprovalEmailError"
                    : "errors.somethingWentWrong",
                  "warn"
                )
              }
            }
          }}
        >
          {t("listings.approval.approveAndPublish")}
        </Button>
      </Grid.Cell>
    )

    const requestChangesButton = (
      <Grid.Cell key="btn-request-changes">
        <Button
          id="requestChangesButton"
          variant="alert-outlined"
          type="button"
          className="w-full"
          onClick={() => showRequestChangesModal && showRequestChangesModal()}
        >
          {t("listings.approval.requestChanges")}
        </Button>
      </Grid.Cell>
    )

    const reopenButton = (
      <Grid.Cell key="btn-reopen">
        <Button
          id="publishButton"
          type="button"
          className="w-full"
          onClick={() => {
            // TODO throw a modal
            submitFormWithStatus(true, ListingStatus.active)
          }}
        >
          {t("listings.approval.reopen")}
        </Button>
      </Grid.Cell>
    )

    const lotteryResultsButton = (elements) => {
      if (listing.events.find((event) => event.type === ListingEventType.lotteryResults)) {
        const eventUrl = pdfUrlFromListingEvents(
          listing?.events,
          ListingEventType.lotteryResults,
          process.env.cloudinaryCloudName
        )
        elements.push(viewPostedResultsButton(eventUrl))
      }
    }

    const getApprovalActions = () => {
      const elements = []
      // read-only form
      if (type === ListingFormActionsType.details) {
        if (isListingApprover) {
          // admins can approve and publish if pending approval or changes requested
          if (
            listing.status === ListingStatus.pendingReview ||
            listing.status === ListingStatus.changesRequested
          )
            elements.push(approveAndPublishButton)
          // admins can always edit
          elements.push(editFromDetailButton)
        } else {
          // partners cannot edit if pending approval
          if (listing.status !== ListingStatus.pendingReview) elements.push(editFromDetailButton)
        }

        // all users can preview
        elements.push(previewButton)

        // all users can view lottery results if posted
        lotteryResultsButton(elements)
      }

      // new unsaved listing
      if (type === ListingFormActionsType.add) {
        // admins can publish, partners can only submit for approval
        elements.push(isListingApprover ? publishButton : submitButton)
        // all users can save a draft
        elements.push(saveDraftButton)
        elements.push(cancelButton)
      }

      // listing saved at least once
      if (type === ListingFormActionsType.edit) {
        if (isListingApprover) {
          // admins can publish a draft
          if (listing.status === ListingStatus.pending) elements.push(publishButton)
          // admins can approve and publish a pending approval or changes requested listing
          if (
            listing.status === ListingStatus.pendingReview ||
            listing.status === ListingStatus.changesRequested
          )
            elements.push(approveAndPublishButton)
          // admins can reopen a closed listing
          if (listing.status === ListingStatus.closed) elements.push(reopenButton)
        } else {
          // partners can submit for approval a draft or changes requested listing
          if (
            listing.status === ListingStatus.pending ||
            listing.status === ListingStatus.changesRequested
          )
            elements.push(submitButton)
        }

        // all users can make updates to an open listing
        elements.push(saveExitButton)

        // admins can request changes on pending review listings
        if (isListingApprover && listing.status === ListingStatus.pendingReview)
          elements.push(requestChangesButton)

        // all users can unpublish a closed listing
        if (listing.status === ListingStatus.closed) {
          elements.push(unpublishButton)
        }

        // all users can close or unpublish open listings
        if (listing.status === ListingStatus.active) {
          elements.push(closeButton)
          elements.push(unpublishButton)
        }

        const lotteryResults = listing?.events?.find(
          (event) => event.type === ListingEventType.lotteryResults
        )

        // all users can manage lottery results on closed listings
        if (lotteryResults) {
          elements.push(editPostedResultsButton(lotteryResults))
        } else if (listing.status === ListingStatus.closed) {
          elements.push(postResultsButton)
        }

        elements.push(cancelButton)
      }
      return elements
    }

    const getDefaultActions = () => {
      const elements = []
      // read-only form
      if (type === ListingFormActionsType.details) {
        elements.push(editFromDetailButton)
        elements.push(previewButton)

        lotteryResultsButton(elements)
      }

      // new unsaved listing
      if (type === ListingFormActionsType.add) {
        elements.push(publishButton)
        elements.push(saveDraftButton)
        elements.push(cancelButton)
      }

      // listing saved at least once
      if (type === ListingFormActionsType.edit) {
        if (listing.status === ListingStatus.pending) {
          elements.push(publishButton)
        }
        if (listing.status === ListingStatus.closed) {
          elements.push(reopenButton)
        }
        elements.push(saveExitButton)

        if (listing.status === ListingStatus.active) {
          elements.push(closeButton)
        }

        if (listing.status === ListingStatus.closed || listing.status === ListingStatus.active) {
          elements.push(unpublishButton)
        }

        const lotteryResults = listing?.events?.find(
          (event) => event.type === ListingEventType.lotteryResults
        )

        if (lotteryResults) {
          elements.push(editPostedResultsButton(lotteryResults))
        } else if (listing.status === ListingStatus.closed) {
          elements.push(postResultsButton)
        }

        elements.push(cancelButton)
      }

      return elements
    }

    return process.env.featureListingsApproval === "TRUE"
      ? getApprovalActions()
      : getDefaultActions()
  }, [
    isListingApprover,
    listing,
    listingId,
    listingsService,
    router,
    showCloseListingModal,
    showLotteryResultsDrawer,
    showRequestChangesModal,
    showSubmitForApprovalModal,
    submitFormWithStatus,
    type,
  ])

  return (
    <>
      <StatusAside columns={1} actions={actions}>
        {type === "edit" && <StatusMessages lastTimestamp={recordUpdated} />}
      </StatusAside>
    </>
  )
}

export default ListingFormActions

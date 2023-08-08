import React, { useContext, useMemo } from "react"
import dayjs from "dayjs"
import {
  t,
  Button,
  GridCell,
  AppearanceStyleType,
  AppearanceBorderType,
  StatusMessages,
  LocalizedLink,
  LinkButton,
  Icon,
  setSiteAlertMessage,
} from "@bloom-housing/ui-components"
import { pdfUrlFromListingEvents, AuthContext } from "@bloom-housing/shared-helpers"
import { ListingContext } from "./ListingContext"
import { ListingEventType, ListingStatus } from "@bloom-housing/backend-core/types"
import { StatusAside } from "../shared/StatusAside"

type ListingFormActionsProps = {
  type: ListingFormActionsType
  showCloseListingModal?: () => void
  showLotteryResultsDrawer?: () => void
  submitFormWithStatus?: (confirm?: boolean, status?: ListingStatus) => void
}

type ListingFormActionsType = "add" | "edit" | "details"

const ListingFormActions = ({
  type,
  showCloseListingModal,
  showLotteryResultsDrawer,
  submitFormWithStatus,
}: ListingFormActionsProps) => {
  const listing = useContext(ListingContext)
  const { profile, listingsService } = useContext(AuthContext)

  const isListingApprover = profile?.roles?.isAdmin

  const listingId = listing?.id

  const recordUpdated = useMemo(() => {
    if (!listing) return null

    const dayjsDate = dayjs(listing.updatedAt)

    return dayjsDate.format("MMMM DD, YYYY")
  }, [listing])

  const actions = useMemo(() => {
    const cancelButton = (
      <GridCell className="flex" key="btn-cancel">
        <LinkButton
          unstyled
          fullWidth
          className="bg-opacity-0 text-blue-700"
          href={type === "add" ? "/" : `/listings/${listingId}`}
          type="button"
        >
          {t("t.cancel")}
        </LinkButton>
      </GridCell>
    )

    const editFromDetailButton = (
      <GridCell key="btn-edit">
        <LocalizedLink href={`/listings/${listingId}/edit`}>
          <Button
            styleType={AppearanceStyleType.primary}
            fullWidth
            onClick={() => false}
            type="button"
            dataTestId="listingEditButton"
          >
            {t("t.edit")}
          </Button>
        </LocalizedLink>
      </GridCell>
    )

    const publishButton = (
      <GridCell key="btn-publish">
        <Button
          id="publishButton"
          styleType={AppearanceStyleType.success}
          type="button"
          fullWidth
          onClick={() => {
            submitFormWithStatus(true, ListingStatus.active)
          }}
        >
          {t("listings.actions.publish")}
        </Button>
      </GridCell>
    )

    const saveDraftButton = (
      <GridCell key="btn-draft">
        <Button
          type="button"
          fullWidth
          onClick={() => submitFormWithStatus(false, ListingStatus.pending)}
        >
          {t("listings.actions.draft")}
        </Button>
      </GridCell>
    )

    const saveExitButton = (primaryAction?: boolean) => (
      <GridCell key="btn-save">
        <Button
          styleType={primaryAction ? AppearanceStyleType.primary : null}
          type="button"
          fullWidth
          onClick={() => submitFormWithStatus(true, listing.status)}
          dataTestId={"saveAndExitButton"}
        >
          {t("t.saveExit")}
        </Button>
      </GridCell>
    )

    const closeButton = (
      <GridCell key="btn-close">
        <Button
          type="button"
          fullWidth
          onClick={() => showCloseListingModal && showCloseListingModal()}
        >
          {t("listings.actions.close")}
        </Button>
      </GridCell>
    )

    const unpublishButton = (
      <GridCell key="btn-unpublish">
        <Button
          styleType={AppearanceStyleType.alert}
          fullWidth
          type="button"
          onClick={() => submitFormWithStatus(false, ListingStatus.pending)}
          border={AppearanceBorderType.outlined}
        >
          {t("listings.actions.unpublish")}
        </Button>
      </GridCell>
    )

    const editPostedResultsButton = (lotteryResults) => (
      <GridCell className="flex" key="btn-edit-lottery">
        <Button
          type="button"
          unstyled
          fullWidth
          className="bg-opacity-0"
          onClick={() => showLotteryResultsDrawer && showLotteryResultsDrawer()}
        >
          {t("listings.actions.resultsPosted")}{" "}
          {dayjs(lotteryResults?.startTime).format("MMMM DD, YYYY")}
          <Icon size="medium" symbol="edit" className="ml-2" />
        </Button>
      </GridCell>
    )

    const postResultsButton = (
      <GridCell key="btn-post-results">
        <Button
          type="button"
          fullWidth
          onClick={() => showLotteryResultsDrawer && showLotteryResultsDrawer()}
        >
          {t("listings.actions.postResults")}
        </Button>
      </GridCell>
    )

    const previewButton = (
      <GridCell key="btn-preview">
        <a
          target="_blank"
          href={`${listing?.jurisdiction.publicUrl}/preview/listings/${listingId}`}
        >
          <Button fullWidth onClick={() => false} type="button">
            {t("listings.actions.preview")}
          </Button>
        </a>
      </GridCell>
    )

    const viewPostedResultsButton = (eventUrl: string) => (
      <GridCell key="btn-preview-results">
        <a href={eventUrl} target="_blank" className="inline-flex w-full">
          <Button type="button" unstyled fullWidth>
            {t("listings.actions.previewLotteryResults")}{" "}
            <Icon size="medium" symbol="link" className="ml-2" />
          </Button>
        </a>
      </GridCell>
    )

    const submitButton = (
      <GridCell key="btn-submit">
        <Button
          id="submitButton"
          styleType={AppearanceStyleType.success}
          type="button"
          fullWidth
          onClick={() => {
            // TODO throw a modal
            submitFormWithStatus(false, ListingStatus.pendingReview)
          }}
        >
          {t("t.submit")}
        </Button>
      </GridCell>
    )

    const approveAndPublishButton = (
      <GridCell key="btn-submit">
        <Button
          id="submitButton"
          styleType={AppearanceStyleType.success}
          type="button"
          fullWidth
          onClick={async () => {
            // TODO throw a modal
            try {
              const result = await listingsService.update({
                id: listing.id,
                body: { ...listing, status: ListingStatus.active },
              })

              if (result) {
                setSiteAlertMessage(t("listings.listingUpdated"), "success")
              }
            } catch (err) {
              setSiteAlertMessage("uh oh", "warn")
            }
          }}
        >
          {t("listings.approval.approveAndPublish")}
        </Button>
      </GridCell>
    )

    const requestChangesButton = (
      <GridCell key="btn-submit">
        <Button
          id="submitButton"
          styleType={AppearanceStyleType.alert}
          border={AppearanceBorderType.outlined}
          type="button"
          fullWidth
          onClick={() => {
            // TODO throw a modal
            submitFormWithStatus(false, ListingStatus.changesRequested)
          }}
        >
          {t("listings.approval.requestChanges")}
        </Button>
      </GridCell>
    )

    const reopenButton = (
      <GridCell key="btn-reopen">
        <Button
          id="publishButton"
          styleType={AppearanceStyleType.success}
          type="button"
          fullWidth
          onClick={() => {
            // TODO throw a modal
            submitFormWithStatus(true, ListingStatus.active)
          }}
        >
          {t("listings.approval.reopen")}
        </Button>
      </GridCell>
    )

    const getApprovalActions = () => {
      const elements = []
      // read-only form
      if (type === "details") {
        if (isListingApprover) {
          // admin can approve and publish if pending approval
          if (listing.status === ListingStatus.pendingReview) elements.push(approveAndPublishButton)
          // admin can publish if changes requested
          if (listing.status === ListingStatus.changesRequested) elements.push(publishButton)
          elements.push(editFromDetailButton)
        } else {
          // partner cannot edit if pending approval
          if (listing.status !== ListingStatus.pendingReview) elements.push(editFromDetailButton)
        }

        // all users can preview
        elements.push(previewButton)

        // all users can view lottery results if posted
        if (listing.events.find((event) => event.type === ListingEventType.lotteryResults)) {
          const eventUrl = pdfUrlFromListingEvents(
            listing?.events,
            ListingEventType.lotteryResults,
            process.env.cloudinaryCloudName
          )
          elements.push(viewPostedResultsButton(eventUrl))
        }
      }

      // new unsaved listing
      if (type === "add") {
        // admins can publish, partners can only submit for approval
        elements.push(isListingApprover ? publishButton : submitButton)
        // all users can save a draft
        elements.push(saveDraftButton)
        elements.push(cancelButton)
      }

      // listing saved at least once
      if (type === "edit") {
        if (isListingApprover) {
          // admins can publish a draft, pending approval, or closed listing
          if (
            listing.status === ListingStatus.pending ||
            listing.status === ListingStatus.pendingReview ||
            listing.status === ListingStatus.changesRequested
          )
            elements.push(publishButton)
          // admins can reopen a closed listing
          if (listing.status === ListingStatus.closed) elements.push(reopenButton)
        } else {
          // partners can submit a draft or changes requested listing
          if (
            listing.status === ListingStatus.pending ||
            listing.status === ListingStatus.changesRequested
          )
            elements.push(submitButton)
        }

        // all users can make updates to an open listing
        elements.push(
          saveExitButton(
            listing.status === ListingStatus.active ||
              (!isListingApprover && listing.status === ListingStatus.closed)
          )
        )

        // all users can unpublish a closed listing
        if (listing.status === ListingStatus.closed) {
          elements.push(unpublishButton)
        }

        // admins can request changes on pending review listings
        if (isListingApprover && listing.status === ListingStatus.pendingReview)
          elements.push(requestChangesButton)

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

    const getCoreActions = () => {
      const elements = []
      // read-only form
      if (type === "details") {
        elements.push(editFromDetailButton)
        elements.push(previewButton)

        if (listing.events.find((event) => event.type === ListingEventType.lotteryResults)) {
          const eventUrl = pdfUrlFromListingEvents(
            listing?.events,
            ListingEventType.lotteryResults,
            process.env.cloudinaryCloudName
          )
          elements.push(viewPostedResultsButton(eventUrl))
        }
      }

      // new unsaved listing
      if (type === "add") {
        elements.push(saveDraftButton)
        elements.push(publishButton)
        elements.push(cancelButton)
      }

      // listing saved at least once
      if (type === "edit") {
        if (listing.status === ListingStatus.pending || listing.status === ListingStatus.closed) {
          elements.push(publishButton)
        }
        elements.push(saveExitButton)

        if (listing.status === ListingStatus.active) {
          elements.push(closeButton)
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

      elements.push(cancelButton)
      return elements
    }

    return process.env.featureListingsApproval === "TRUE" ? getApprovalActions() : getCoreActions()
  }, [
    isListingApprover,
    listing,
    listingId,
    listingsService,
    showCloseListingModal,
    showLotteryResultsDrawer,
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

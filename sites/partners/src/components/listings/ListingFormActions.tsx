import React, { useContext, useMemo } from "react"
import { useRouter } from "next/router"
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

    const saveExitButton = (
      <GridCell key="btn-save">
        <Button
          styleType={AppearanceStyleType.primary}
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
          onClick={() => showSubmitForApprovalModal && showSubmitForApprovalModal()}
        >
          {t("t.submit")}
        </Button>
      </GridCell>
    )

    const approveAndPublishButton = (
      <GridCell key="btn-approve-and-publish">
        <Button
          id="approveAndPublishButton"
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
                setSiteAlertMessage(t("listings.approval.listingPublished"), "success")
                if (router.pathname.includes("edit")) {
                  await router.push(`/listings/${result.id}`)
                } else {
                  router.reload()
                }
              }
            } catch (err) {
              setSiteAlertMessage("errors.somethingWentWrong", "warn")
            }
          }}
        >
          {t("listings.approval.approveAndPublish")}
        </Button>
      </GridCell>
    )

    const requestChangesButton = (
      <GridCell key="btn-request-changes">
        <Button
          id="requestChangesButton"
          styleType={AppearanceStyleType.alert}
          border={AppearanceBorderType.outlined}
          type="button"
          fullWidth
          onClick={() => showRequestChangesModal && showRequestChangesModal()}
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

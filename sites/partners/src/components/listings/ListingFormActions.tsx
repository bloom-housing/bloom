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
} from "@bloom-housing/ui-components"
import { pdfUrlFromListingEvents } from "@bloom-housing/shared-helpers"
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
      <GridCell key="btn-submitNew">
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
          styleType={AppearanceStyleType.success}
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

      elements.push(cancelButton)
    }

    // new unsaved listing
    if (type === "add") {
      elements.push(publishButton)
      elements.push(saveDraftButton)
      elements.push(cancelButton)
    }

    // listing saved at least once
    if (type === "edit") {
      elements.push(saveExitButton)

      if (listing.status === ListingStatus.pending || listing.status === ListingStatus.closed) {
        elements.push(publishButton)
      }

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

    return elements
  }, [
    listing,
    listingId,
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

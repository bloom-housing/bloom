import React, { useContext, useMemo } from "react"
import { useRouter } from "next/router"
import dayjs from "dayjs"
import {
  t,
  Button,
  AppearanceStyleType,
  AppearanceBorderType,
  StatusMessages,
  LocalizedLink,
  LinkButton,
  Icon,
  setSiteAlertMessage,
} from "@bloom-housing/ui-components"
import { Grid } from "@bloom-housing/ui-seeds"
import { pdfUrlFromListingEvents, AuthContext } from "@bloom-housing/shared-helpers"
import { ListingContext } from "./ListingContext"
import { StatusAside } from "../shared/StatusAside"
import {
  ListingEventsTypeEnum,
  ListingUpdate,
  ListingsStatusEnum,
  EnumJurisdictionListingApprovalPermissions,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

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
  submitFormWithStatus?: (confirm?: boolean, status?: ListingsStatusEnum) => void
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

  // single jurisdiction check covers jurisAdmin adding a listing (listing is undefined then)
  const listingApprovalPermissions = (
    profile?.jurisdictions?.length === 1
      ? profile?.jurisdictions[0]
      : profile?.jurisdictions?.find((juris) => juris.id === listing?.jurisdictions?.id)
  )?.listingApprovalPermissions

  const isListingApprover =
    profile?.userRoles.isAdmin ||
    (profile?.userRoles.isJurisdictionalAdmin &&
      listingApprovalPermissions?.includes(
        EnumJurisdictionListingApprovalPermissions.jurisdictionAdmin
      ))

  const listingId = listing?.id

  const listingJurisdiction = profile?.jurisdictions?.find(
    (jurisdiction) => jurisdiction.id === listing.jurisdictions?.id
  )

  const recordUpdated = useMemo(() => {
    if (!listing) return null

    const dayjsDate = dayjs(listing.updatedAt)

    return dayjsDate.format("MMMM DD, YYYY")
  }, [listing])

  const actions = useMemo(() => {
    const cancelButton = (
      <Grid.Cell className="flex" key="btn-cancel">
        <LinkButton
          unstyled
          fullWidth
          className="bg-opacity-0 text-blue-700"
          href={type === "add" ? "/" : `/listings/${listingId}`}
          type="button"
        >
          {t("t.cancel")}
        </LinkButton>
      </Grid.Cell>
    )

    const editFromDetailButton = (
      <Grid.Cell key="btn-edit">
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
      </Grid.Cell>
    )

    const publishButton = (
      <Grid.Cell key="btn-publish">
        <Button
          id="publishButton"
          styleType={AppearanceStyleType.success}
          type="button"
          fullWidth
          onClick={() => {
            submitFormWithStatus(true, ListingsStatusEnum.active)
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
          fullWidth
          onClick={() => submitFormWithStatus(false, ListingsStatusEnum.pending)}
        >
          {t("listings.actions.draft")}
        </Button>
      </Grid.Cell>
    )

    const saveExitButton = (
      <Grid.Cell key="btn-save">
        <Button
          styleType={AppearanceStyleType.primary}
          type="button"
          fullWidth
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
          fullWidth
          onClick={() => showCloseListingModal && showCloseListingModal()}
        >
          {t("listings.actions.close")}
        </Button>
      </Grid.Cell>
    )

    const unpublishButton = (
      <Grid.Cell key="btn-unpublish">
        <Button
          styleType={AppearanceStyleType.alert}
          fullWidth
          type="button"
          onClick={() => submitFormWithStatus(false, ListingsStatusEnum.pending)}
          border={AppearanceBorderType.outlined}
        >
          {t("listings.actions.unpublish")}
        </Button>
      </Grid.Cell>
    )

    const editPostedResultsButton = (lotteryResults) => (
      <Grid.Cell className="flex" key="btn-edit-lottery">
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
      </Grid.Cell>
    )

    const postResultsButton = (
      <Grid.Cell key="btn-post-results">
        <Button
          type="button"
          fullWidth
          onClick={() => showLotteryResultsDrawer && showLotteryResultsDrawer()}
        >
          {t("listings.actions.postResults")}
        </Button>
      </Grid.Cell>
    )

    const previewButton = (
      <Grid.Cell key="btn-preview">
        <a target="_blank" href={`${listingJurisdiction.publicUrl}/preview/listings/${listingId}`}>
          <Button fullWidth onClick={() => false} type="button">
            {t("listings.actions.preview")}
          </Button>
        </a>
      </Grid.Cell>
    )

    const viewPostedResultsButton = (eventUrl: string) => (
      <Grid.Cell key="btn-preview-results">
        <a href={eventUrl} target="_blank" className="inline-flex w-full">
          <Button type="button" unstyled fullWidth>
            {t("listings.actions.previewLotteryResults")}{" "}
            <Icon size="medium" symbol="link" className="ml-2" />
          </Button>
        </a>
      </Grid.Cell>
    )

    const submitButton = (
      <Grid.Cell key="btn-submit">
        <Button
          id="submitButton"
          styleType={AppearanceStyleType.success}
          type="button"
          fullWidth
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
          styleType={AppearanceStyleType.success}
          type="button"
          fullWidth
          onClick={async () => {
            // utilize same submit logic if updating status from edit view
            if (type === ListingFormActionsType.edit) {
              submitFormWithStatus(false, ListingsStatusEnum.active)
            } else {
              try {
                const result = await listingsService.update({
                  id: listing.id,
                  body: {
                    ...(listing as unknown as ListingUpdate),
                    status: ListingsStatusEnum.active,
                  },
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
          styleType={AppearanceStyleType.alert}
          border={AppearanceBorderType.outlined}
          type="button"
          fullWidth
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
          styleType={AppearanceStyleType.success}
          type="button"
          fullWidth
          onClick={() => {
            // TODO throw a modal
            submitFormWithStatus(true, ListingsStatusEnum.active)
          }}
        >
          {t("listings.approval.reopen")}
        </Button>
      </Grid.Cell>
    )

    const lotteryResultsButton = (elements) => {
      if (
        listing.listingEvents?.find((event) => event.type === ListingEventsTypeEnum.lotteryResults)
      ) {
        const eventUrl = pdfUrlFromListingEvents(
          listing?.listingEvents,
          ListingEventsTypeEnum.lotteryResults,
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
            listing.status === ListingsStatusEnum.pendingReview ||
            listing.status === ListingsStatusEnum.changesRequested
          )
            elements.push(approveAndPublishButton)
          // admins can always edit
          elements.push(editFromDetailButton)
        } else {
          // partners cannot edit if pending approval
          if (listing.status !== ListingsStatusEnum.pendingReview)
            elements.push(editFromDetailButton)
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
          if (listing.status === ListingsStatusEnum.pending) elements.push(publishButton)
          // admins can approve and publish a pending approval or changes requested listing
          if (
            listing.status === ListingsStatusEnum.pendingReview ||
            listing.status === ListingsStatusEnum.changesRequested
          )
            elements.push(approveAndPublishButton)
          // admins can reopen a closed listing
          if (listing.status === ListingsStatusEnum.closed) elements.push(reopenButton)
        } else {
          // partners can submit for approval a draft or changes requested listing
          if (
            listing.status === ListingsStatusEnum.pending ||
            listing.status === ListingsStatusEnum.changesRequested
          )
            elements.push(submitButton)
        }

        // all users can make updates to an open listing
        elements.push(saveExitButton)

        // admins can request changes on pending review listings
        if (isListingApprover && listing.status === ListingsStatusEnum.pendingReview)
          elements.push(requestChangesButton)

        // all users can unpublish a closed listing
        if (listing.status === ListingsStatusEnum.closed) {
          elements.push(unpublishButton)
        }

        // all users can close or unpublish open listings
        if (listing.status === ListingsStatusEnum.active) {
          elements.push(closeButton)
          elements.push(unpublishButton)
        }

        const lotteryResults = listing?.listingEvents?.find(
          (event) => event.type === ListingEventsTypeEnum.lotteryResults
        )

        // all users can manage lottery results on closed listings
        if (lotteryResults) {
          elements.push(editPostedResultsButton(lotteryResults))
        } else if (listing.status === ListingsStatusEnum.closed) {
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
        if (listing.status === ListingsStatusEnum.pending) {
          elements.push(publishButton)
        }
        if (listing.status === ListingsStatusEnum.closed) {
          elements.push(reopenButton)
        }
        elements.push(saveExitButton)

        if (listing.status === ListingsStatusEnum.active) {
          elements.push(closeButton)
        }

        if (
          listing.status === ListingsStatusEnum.closed ||
          listing.status === ListingsStatusEnum.active
        ) {
          elements.push(unpublishButton)
        }

        const lotteryResults = listing?.listingEvents?.find(
          (event) => event.type === ListingEventsTypeEnum.lotteryResults
        )

        if (lotteryResults) {
          elements.push(editPostedResultsButton(lotteryResults))
        } else if (listing.status === ListingsStatusEnum.closed) {
          elements.push(postResultsButton)
        }

        elements.push(cancelButton)
      }

      return elements
    }

    return listingApprovalPermissions?.length > 0 ? getApprovalActions() : getDefaultActions()
  }, [
    isListingApprover,
    listing,
    listingApprovalPermissions?.length,
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

import React, { useContext, useMemo } from "react"
import { useRouter } from "next/router"
import dayjs from "dayjs"
import { t, StatusMessages } from "@bloom-housing/ui-components"
import { Button, Link, Grid, Icon } from "@bloom-housing/ui-seeds"
import { pdfUrlFromListingEvents, AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import PencilSquareIcon from "@heroicons/react/24/solid/PencilSquareIcon"
import LinkIcon from "@heroicons/react/20/solid/LinkIcon"
import { ListingContext } from "./ListingContext"
import { StatusAside } from "../shared/StatusAside"
import {
  ListingEventsTypeEnum,
  ListingUpdate,
  ListingsStatusEnum,
  EnumJurisdictionListingApprovalPermissions,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

import { SubmitFunction } from "./PaperListingForm"

export enum ListingFormActionsType {
  add = "add",
  edit = "edit",
  details = "details",
}

type ListingFormActionsProps = {
  type: ListingFormActionsType
  showSaveBeforeExitDialog?: () => void
  showCloseListingModal?: () => void
  showLotteryResultsDrawer?: () => void
  showRequestChangesModal?: () => void
  showSubmitForApprovalModal?: () => void
  submitFormWithStatus?: SubmitFunction
  setErrorAlert?: (alertMessage: string) => void
}

const ListingFormActions = ({
  type,
  showSaveBeforeExitDialog,
  showCloseListingModal,
  showLotteryResultsDrawer,
  showRequestChangesModal,
  showSubmitForApprovalModal,
  submitFormWithStatus,
  setErrorAlert,
}: ListingFormActionsProps) => {
  const listing = useContext(ListingContext)
  const { profile, listingsService } = useContext(AuthContext)
  const { addToast } = useContext(MessageContext)
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
    (jurisdiction) => jurisdiction.id === listing?.jurisdictions?.id
  )

  const recordUpdated = useMemo(() => {
    if (!listing) return null

    const dayjsDate = dayjs(listing.updatedAt)

    return dayjsDate.format("MMMM DD, YYYY")
  }, [listing])

  const actions = useMemo(() => {
    const cancelButton = (
      <Grid.Cell className="flex" key="btn-cancel">
        <Button
          id="listingsExitButton"
          variant="text"
          className="w-full justify-center p-3"
          onClick={() => {
            showSaveBeforeExitDialog()
          }}
        >
          {t("t.exit")}
        </Button>
      </Grid.Cell>
    )

    const editFromDetailButton = (
      <Grid.Cell key="btn-edit">
        <Button
          className="w-full"
          href={`/listings/${listingId}/edit`}
          type="button"
          id="listingEditButton"
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
          variant="success"
          className="w-full"
          onClick={() => {
            submitFormWithStatus("confirm", ListingsStatusEnum.active)
          }}
        >
          {t("listings.actions.publish")}
        </Button>
      </Grid.Cell>
    )

    const saveDraftButton = (
      <Grid.Cell key="btn-draft">
        <Button
          id="saveDraftButton"
          type="button"
          variant="primary-outlined"
          className="w-full"
          onClick={() => submitFormWithStatus("redirect", ListingsStatusEnum.pending)}
        >
          {t("listings.actions.draft")}
        </Button>
      </Grid.Cell>
    )

    const saveContinueButton = (
      <Grid.Cell key="btn-save">
        <Button
          type="button"
          variant="primary-outlined"
          className="w-full"
          onClick={() => submitFormWithStatus("continue", listing.status)}
          id={"saveAndContinueButton"}
        >
          {t("t.save")}
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
          id={"closeButton"}
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
          onClick={() => submitFormWithStatus("redirect", ListingsStatusEnum.pending)}
        >
          {t("listings.actions.unpublish")}
        </Button>
      </Grid.Cell>
    )

    // Disabled for Doorway
    const editPostedResultsButton = (lotteryResults) => (
      <Grid.Cell className="flex" key="btn-edit-lottery">
        <Button
          type="button"
          variant="text"
          tailIcon={
            <Icon>
              <PencilSquareIcon />
            </Icon>
          }
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
          href={`${listingJurisdiction?.publicUrl}/preview/listings/${listingId}`}
        >
          {t("listings.actions.preview")}
        </Button>
      </Grid.Cell>
    )

    const viewPostedResultsButton = (eventUrl: string) => (
      <Grid.Cell key="btn-preview-results">
        <Link
          href={eventUrl}
          tailIcon={
            <Icon>
              <LinkIcon />
            </Icon>
          }
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
          variant="success"
          className="w-full"
          onClick={async () => {
            // utilize same submit logic if updating status from edit view
            if (type === ListingFormActionsType.edit) {
              submitFormWithStatus("redirect", ListingsStatusEnum.active)
            } else {
              try {
                const result = await listingsService.update({
                  id: listing.id,
                  body: {
                    ...(listing as unknown as ListingUpdate),
                    // account for type mismatch between ListingMultiSelectQuestionType and IdDto
                    listingMultiselectQuestions: listing.listingMultiselectQuestions?.map(
                      (multiselectQuestions) => ({
                        ordinal: multiselectQuestions.ordinal,
                        id: multiselectQuestions.multiselectQuestions?.id,
                      })
                    ),
                    status: ListingsStatusEnum.active,
                  },
                })
                if (result) {
                  addToast(t("listings.approval.listingPublished"), { variant: "success" })
                  await router.push(`/`)
                }
              } catch (err) {
                // if it is a bad request (is missing fields or incorrect data) then display an error banner
                if (err.response?.status === 400) {
                  setErrorAlert(
                    "There are errors in this listing that must be resolved before publishing. To see the errors, please try to approve this listing from the edit view."
                  )
                }
                addToast(
                  err.response?.data?.message === "email failed"
                    ? t("errors.alert.listingsApprovalEmailError")
                    : t("errors.somethingWentWrong"),
                  { variant: "warn" }
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
            submitFormWithStatus("confirm", ListingsStatusEnum.active)
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
          ListingEventsTypeEnum.lotteryResults
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

        // Only admins can publish results
        // and the functionality should only be turned on if the rest of lottery functionality is
        if (isListingApprover && process.env.showLottery) {
          const lotteryResults = listing?.listingEvents?.find(
            (event) => event.type === ListingEventsTypeEnum.lotteryResults
          )

          if (lotteryResults) {
            elements.push(editPostedResultsButton(lotteryResults))
          } else if (listing.status === ListingsStatusEnum.closed && !listing?.lotteryOptIn) {
            elements.push(postResultsButton)
          }
        }

        // all users can make updates to an open listing
        elements.push(saveContinueButton)

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
        elements.push(saveContinueButton)

        if (listing.status === ListingsStatusEnum.active) {
          elements.push(closeButton)
        }

        if (
          listing.status === ListingsStatusEnum.closed ||
          listing.status === ListingsStatusEnum.active
        ) {
          elements.push(unpublishButton)
        }

        if (process.env.showLottery) {
          const lotteryResults = listing?.listingEvents?.find(
            (event) => event.type === ListingEventsTypeEnum.lotteryResults
          )

          if (lotteryResults) {
            elements.push(editPostedResultsButton(lotteryResults))
          } else if (listing.status === ListingsStatusEnum.closed && !listing?.lotteryOptIn) {
            elements.push(postResultsButton)
          }
        }

        elements.push(cancelButton)
      }

      return elements
    }

    return listingApprovalPermissions?.length > 0 ? getApprovalActions() : getDefaultActions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isListingApprover,
    listing,
    listingApprovalPermissions?.length,
    listingId,
    listingsService,
    router,
    addToast,
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

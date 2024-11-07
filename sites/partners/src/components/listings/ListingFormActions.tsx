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
  UserRoleEnum,
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
  showCopyListingDialog?: () => void
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
  showCopyListingDialog,
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
  const jurisdiction =
    profile?.jurisdictions?.length === 1
      ? profile?.jurisdictions[0]
      : profile?.jurisdictions?.find((juris) => juris.id === listing?.jurisdictions?.id)

  const listingApprovalPermissions = jurisdiction?.listingApprovalPermissions
  const isListingApprovalEnabled = listingApprovalPermissions?.length > 0
  const isListingApprover =
    profile?.userRoles.isAdmin ||
    (profile?.userRoles.isJurisdictionalAdmin &&
      listingApprovalPermissions?.includes(UserRoleEnum.jurisdictionAdmin))

  const duplicateListingPermissions = jurisdiction?.duplicateListingPermissions
  const isListingCopier =
    profile?.userRoles?.isAdmin ||
    (profile?.userRoles?.isJurisdictionalAdmin &&
      duplicateListingPermissions?.includes(UserRoleEnum.jurisdictionAdmin)) ||
    (profile?.userRoles?.isLimitedJurisdictionalAdmin &&
      duplicateListingPermissions?.includes(UserRoleEnum.limitedJurisdictionAdmin)) ||
    (profile?.userRoles?.isPartner && duplicateListingPermissions?.includes(UserRoleEnum.partner))

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

    const copyButton = (
      <Grid.Cell key="btn-copy">
        <Button
          variant="primary-outlined"
          className="w-full"
          onClick={() => {
            showCopyListingDialog()
          }}
        >
          {t("actions.copy")}
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

    const elements = []

    //lottery buttons for listing edit view
    const updateLotteryResultsButton = () => {
      const lotteryResults = listing?.listingEvents?.find(
        (event) => event.type === ListingEventsTypeEnum.lotteryResults
      )
      if (lotteryResults) {
        elements.push(editPostedResultsButton(lotteryResults))
      } else if (
        listing.status === ListingsStatusEnum.closed &&
        // dwy-specific lottery logic to only show post results if showLottery flag is enabled
        !listing?.lotteryOptIn &&
        process.env.showLottery
      ) {
        elements.push(postResultsButton)
      }
    }
    //lottery button for listing detail view
    const viewlotteryResultsButton = () => {
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

    //admin experience
    if (profile?.userRoles.isAdmin) {
      // new unsaved listing
      if (type === ListingFormActionsType.add) {
        elements.push(isListingApprover || !isListingApprovalEnabled ? publishButton : submitButton)
        elements.push(saveDraftButton)
        elements.push(cancelButton)
      }
      //draft listing, detail view
      else if (
        listing.status === ListingsStatusEnum.pending &&
        type === ListingFormActionsType.details
      ) {
        elements.push(editFromDetailButton)
        if (isListingCopier) elements.push(copyButton)
        elements.push(previewButton)
      }
      //draft listing, edit view
      else if (
        listing.status === ListingsStatusEnum.pending &&
        type === ListingFormActionsType.edit
      ) {
        elements.push(isListingApprover || !isListingApprovalEnabled ? publishButton : submitButton)
        elements.push(saveContinueButton)
        elements.push(cancelButton)
      }
      //pending review listing, detail view
      else if (
        listing.status === ListingsStatusEnum.pendingReview &&
        type === ListingFormActionsType.details
      ) {
        if (isListingApprover) {
          elements.push(approveAndPublishButton)
          elements.push(editFromDetailButton)
        }
        if (isListingCopier) elements.push(copyButton)
        elements.push(previewButton)
      }
      //pending review listing, edit view
      else if (
        listing.status === ListingsStatusEnum.pendingReview &&
        type === ListingFormActionsType.edit
      ) {
        if (isListingApprover) {
          elements.push(approveAndPublishButton)
          elements.push(requestChangesButton)
        }
        elements.push(saveContinueButton)
        elements.push(cancelButton)
      }
      //changes requested listing, detail view
      else if (
        listing.status === ListingsStatusEnum.changesRequested &&
        type === ListingFormActionsType.details
      ) {
        if (isListingApprover) elements.push(approveAndPublishButton)
        elements.push(editFromDetailButton)
        if (isListingCopier) elements.push(copyButton)
        elements.push(previewButton)
      }
      //changes requested listing, edit view
      else if (
        listing.status === ListingsStatusEnum.changesRequested &&
        type === ListingFormActionsType.edit
      ) {
        elements.push(isListingApprover ? approveAndPublishButton : submitButton)
        elements.push(saveContinueButton)
        elements.push(cancelButton)
      }
      //open listing, detail view
      else if (
        listing.status === ListingsStatusEnum.active &&
        type === ListingFormActionsType.details
      ) {
        elements.push(editFromDetailButton)
        if (isListingCopier) elements.push(copyButton)
        elements.push(previewButton)
      }
      //open listing, edit view
      else if (
        listing.status === ListingsStatusEnum.active &&
        type === ListingFormActionsType.edit
      ) {
        elements.push(closeButton)
        elements.push(unpublishButton)
        elements.push(saveContinueButton)
        elements.push(cancelButton)
      }
      //closed listing, detail view
      else if (
        listing.status === ListingsStatusEnum.closed &&
        type === ListingFormActionsType.details
      ) {
        elements.push(editFromDetailButton)
        if (isListingCopier) elements.push(copyButton)
        elements.push(previewButton)
        viewlotteryResultsButton()
      }
      //closed listing, edit view
      else if (
        listing.status === ListingsStatusEnum.closed &&
        type === ListingFormActionsType.edit
      ) {
        if (
          (isListingApprover || !isListingApprovalEnabled) &&
          !process.env.limitClosedListingActions
        ) {
          elements.push(reopenButton)
        }
        elements.push(unpublishButton)
        updateLotteryResultsButton()
        elements.push(saveContinueButton)
        elements.push(cancelButton)
      }
    }

    //jurisdictional admin experience
    else if (profile?.userRoles.isJurisdictionalAdmin) {
      // new unsaved listing
      if (type === ListingFormActionsType.add) {
        elements.push(isListingApprover || !isListingApprovalEnabled ? publishButton : submitButton)
        elements.push(saveDraftButton)
        elements.push(cancelButton)
      }
      //draft listing, detail view
      else if (
        listing.status === ListingsStatusEnum.pending &&
        type === ListingFormActionsType.details
      ) {
        elements.push(editFromDetailButton)
        if (isListingCopier) elements.push(copyButton)
        elements.push(previewButton)
      }
      //draft listing, edit view
      else if (
        listing.status === ListingsStatusEnum.pending &&
        type === ListingFormActionsType.edit
      ) {
        elements.push(isListingApprover || !isListingApprovalEnabled ? publishButton : submitButton)
        elements.push(saveContinueButton)
        elements.push(cancelButton)
      }
      //pending review listing, detail view
      else if (
        listing.status === ListingsStatusEnum.pendingReview &&
        type === ListingFormActionsType.details
      ) {
        if (isListingApprover) {
          elements.push(approveAndPublishButton)
          elements.push(editFromDetailButton)
        }
        if (isListingCopier) elements.push(copyButton)
        elements.push(previewButton)
      }
      //pending review listing, edit view
      else if (
        listing.status === ListingsStatusEnum.pendingReview &&
        type === ListingFormActionsType.edit
      ) {
        if (isListingApprover) {
          elements.push(approveAndPublishButton)
          elements.push(requestChangesButton)
        }
        elements.push(saveContinueButton)
        elements.push(cancelButton)
      }
      //changes requested listing, detail view
      else if (
        listing.status === ListingsStatusEnum.changesRequested &&
        type === ListingFormActionsType.details
      ) {
        if (isListingApprover) elements.push(approveAndPublishButton)
        elements.push(editFromDetailButton)
        if (isListingCopier) elements.push(copyButton)
        elements.push(previewButton)
      }
      //changes requested listing, edit view
      else if (
        listing.status === ListingsStatusEnum.changesRequested &&
        type === ListingFormActionsType.edit
      ) {
        elements.push(isListingApprover ? approveAndPublishButton : submitButton)
        elements.push(saveContinueButton)
        elements.push(cancelButton)
      }
      //open listing, detail view
      else if (
        listing.status === ListingsStatusEnum.active &&
        type === ListingFormActionsType.details
      ) {
        elements.push(editFromDetailButton)
        if (isListingCopier) elements.push(copyButton)
        elements.push(previewButton)
      }
      //open listing, edit view
      else if (
        listing.status === ListingsStatusEnum.active &&
        type === ListingFormActionsType.edit
      ) {
        elements.push(closeButton)
        elements.push(unpublishButton)
        elements.push(saveContinueButton)
        elements.push(cancelButton)
      }
      //closed listing, detail view
      else if (
        listing.status === ListingsStatusEnum.closed &&
        type === ListingFormActionsType.details
      ) {
        if (!process.env.limitClosedListingActions) elements.push(editFromDetailButton)
        if (isListingCopier) elements.push(copyButton)
        elements.push(previewButton)
        viewlotteryResultsButton()
      }
      //closed listing, edit view
      else if (
        listing.status === ListingsStatusEnum.closed &&
        type === ListingFormActionsType.edit
      ) {
        if (
          (isListingApprover || !isListingApprovalEnabled) &&
          !process.env.limitClosedListingActions
        ) {
          elements.push(reopenButton)
        }
        elements.push(unpublishButton)
        updateLotteryResultsButton()
        elements.push(saveContinueButton)
        elements.push(cancelButton)
      }
    }

    //limited jurisdictional admin
    else if (profile?.userRoles.isLimitedJurisdictionalAdmin) {
      // new unsaved listing
      if (type === ListingFormActionsType.add) {
        elements.push(isListingApprover || !isListingApprovalEnabled ? publishButton : submitButton)
        elements.push(saveDraftButton)
        elements.push(cancelButton)
      }
      //draft listing, detail view
      else if (
        listing.status === ListingsStatusEnum.pending &&
        type === ListingFormActionsType.details
      ) {
        elements.push(editFromDetailButton)
        if (isListingCopier) elements.push(copyButton)
        elements.push(previewButton)
      }
      //draft listing, edit view
      else if (
        listing.status === ListingsStatusEnum.pending &&
        type === ListingFormActionsType.edit
      ) {
        elements.push(isListingApprover || !isListingApprovalEnabled ? publishButton : submitButton)
        elements.push(saveContinueButton)
        elements.push(cancelButton)
      }
      //pending review listing, detail view
      else if (
        listing.status === ListingsStatusEnum.pendingReview &&
        type === ListingFormActionsType.details
      ) {
        if (isListingApprover) {
          elements.push(approveAndPublishButton)
          elements.push(editFromDetailButton)
        }
        if (isListingCopier) elements.push(copyButton)
        elements.push(previewButton)
      }
      //pending review listing, edit view
      else if (
        listing.status === ListingsStatusEnum.pendingReview &&
        type === ListingFormActionsType.edit
      ) {
        if (isListingApprover) {
          elements.push(approveAndPublishButton)
          elements.push(requestChangesButton)
        }
        elements.push(saveContinueButton)
        elements.push(cancelButton)
      }
      //changes requested listing, detail view
      else if (
        listing.status === ListingsStatusEnum.changesRequested &&
        type === ListingFormActionsType.details
      ) {
        if (isListingApprover) elements.push(approveAndPublishButton)
        elements.push(editFromDetailButton)
        if (isListingCopier) elements.push(copyButton)
        elements.push(previewButton)
      }
      //changes requested listing, edit view
      else if (
        listing.status === ListingsStatusEnum.changesRequested &&
        type === ListingFormActionsType.edit
      ) {
        elements.push(isListingApprover ? approveAndPublishButton : submitButton)
        elements.push(saveContinueButton)
        elements.push(cancelButton)
      }
      //open listing, detail view
      else if (
        listing.status === ListingsStatusEnum.active &&
        type === ListingFormActionsType.details
      ) {
        elements.push(editFromDetailButton)
        if (isListingCopier) elements.push(copyButton)
        elements.push(previewButton)
      }
      //open listing, edit view
      else if (
        listing.status === ListingsStatusEnum.active &&
        type === ListingFormActionsType.edit
      ) {
        elements.push(closeButton)
        elements.push(unpublishButton)
        elements.push(saveContinueButton)
        elements.push(cancelButton)
      }
      //closed listing, detail view
      else if (
        listing.status === ListingsStatusEnum.closed &&
        type === ListingFormActionsType.details
      ) {
        if (!process.env.limitClosedListingActions) elements.push(editFromDetailButton)
        if (isListingCopier) elements.push(copyButton)
        elements.push(previewButton)
        viewlotteryResultsButton()
      }
      //closed listing, edit view
      else if (
        listing.status === ListingsStatusEnum.closed &&
        type === ListingFormActionsType.edit
      ) {
        if (
          (isListingApprover || !isListingApprovalEnabled) &&
          !process.env.limitClosedListingActions
        ) {
          elements.push(reopenButton)
        }
        elements.push(unpublishButton)
        updateLotteryResultsButton()
        elements.push(saveContinueButton)
        elements.push(cancelButton)
      }
    }

    //partner user experience
    else if (profile?.userRoles.isPartner) {
      // new unsaved listing
      if (type === ListingFormActionsType.add) {
        elements.push(isListingApprover ? publishButton : submitButton)
        elements.push(saveDraftButton)
        elements.push(cancelButton)
      }
      //draft listing, detail view
      else if (
        listing.status === ListingsStatusEnum.pending &&
        type === ListingFormActionsType.details
      ) {
        elements.push(editFromDetailButton)
        if (isListingCopier) elements.push(copyButton)
        elements.push(previewButton)
      }
      //draft listing, edit view
      else if (
        listing.status === ListingsStatusEnum.pending &&
        type === ListingFormActionsType.edit
      ) {
        elements.push(isListingApprover ? publishButton : submitButton)
        elements.push(saveContinueButton)
        elements.push(cancelButton)
      }
      //pending review listing, detail view
      else if (
        listing.status === ListingsStatusEnum.pendingReview &&
        type === ListingFormActionsType.details
      ) {
        //copy button?
        if (isListingCopier) elements.push(copyButton)
        elements.push(previewButton)
      }
      //pending review listing, edit view
      else if (
        listing.status === ListingsStatusEnum.pendingReview &&
        type === ListingFormActionsType.edit
      ) {
        elements.push(isListingApprover ? publishButton : submitButton)
        elements.push(saveContinueButton)
        elements.push(cancelButton)
      }
      //changes requested listing, detail view
      else if (
        listing.status === ListingsStatusEnum.changesRequested &&
        type === ListingFormActionsType.details
      ) {
        elements.push(editFromDetailButton)
        //copy button?
        if (isListingCopier) elements.push(copyButton)
        elements.push(previewButton)
      }
      //changes requested listing, edit view
      else if (
        listing.status === ListingsStatusEnum.changesRequested &&
        type === ListingFormActionsType.edit
      ) {
        elements.push(isListingApprover ? publishButton : submitButton)
        elements.push(saveContinueButton)
        elements.push(cancelButton)
      }
      //open listing, detail view
      else if (
        listing.status === ListingsStatusEnum.active &&
        type === ListingFormActionsType.details
      ) {
        elements.push(editFromDetailButton)
        if (isListingCopier) elements.push(copyButton)
        elements.push(previewButton)
      }
      //open listing, edit view
      else if (
        listing.status === ListingsStatusEnum.active &&
        type === ListingFormActionsType.edit
      ) {
        elements.push(closeButton)
        elements.push(unpublishButton)
        elements.push(saveContinueButton)
        elements.push(cancelButton)
      }
      //closed listing, detail view
      else if (
        listing.status === ListingsStatusEnum.closed &&
        type === ListingFormActionsType.details
      ) {
        if (!process.env.limitClosedListingActions) elements.push(editFromDetailButton)
        if (isListingCopier) elements.push(copyButton)
        elements.push(previewButton)
        viewlotteryResultsButton()
      }
      //closed listing, edit view
      else if (
        listing.status === ListingsStatusEnum.closed &&
        type === ListingFormActionsType.edit
      ) {
        elements.push(unpublishButton)
        updateLotteryResultsButton()
        elements.push(saveContinueButton)
        elements.push(cancelButton)
      }
    }
    return elements
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

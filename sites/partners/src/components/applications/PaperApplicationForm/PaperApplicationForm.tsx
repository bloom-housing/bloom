import React, { useState, useContext, useEffect } from "react"
import { useRouter } from "next/router"
import { t, Form, AlertBox, LoadingOverlay } from "@bloom-housing/ui-components"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { AuthContext, MessageContext, listingSectionQuestions } from "@bloom-housing/shared-helpers"
import { useForm, FormProvider } from "react-hook-form"
import {
  Application,
  ApplicationCreate,
  ApplicationReviewStatusEnum,
  ApplicationUpdate,
  FeatureFlagEnum,
  HouseholdMember,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { mapFormToApi, mapApiToForm } from "../../../lib/applications/formatApplicationData"
import { useSingleListingData } from "../../../lib/hooks"
import { FormApplicationData } from "./sections/FormApplicationData"
import { FormPrimaryApplicant } from "./sections/FormPrimaryApplicant"
import { FormAlternateContact } from "./sections/FormAlternateContact"
import { FormHouseholdMembers } from "./sections/FormHouseholdMembers"
import { FormHouseholdDetails } from "./sections/FormHouseholdDetails"
import { FormHouseholdIncome } from "./sections/FormHouseholdIncome"
import { FormDemographics } from "./sections/FormDemographics"
import { FormTerms } from "./sections/FormTerms"
import { FormMultiselectQuestions } from "./sections/FormMultiselectQuestions"

import { Aside } from "../Aside"
import { FormTypes } from "../../../lib/applications/FormTypes"
import { StatusBar } from "../../../components/shared/StatusBar"
import { ApplicationStatusTag } from "../../listings/PaperListingDetails/sections/helpers"
import { AppStatusConfirmSections, buildAppStatusConfirmSections } from "../helpers"

type ApplicationFormProps = {
  listingId: string
  application?: Application
  editMode?: boolean
}

type AlertErrorType = "api" | "form"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ApplicationForm = ({ listingId, editMode, application }: ApplicationFormProps) => {
  const { listingDto } = useSingleListingData(listingId)
  const { doJurisdictionsHaveFeatureFlagOn, applicationsService } = useContext(AuthContext)

  const preferences = listingSectionQuestions(
    listingDto,
    MultiselectQuestionsApplicationSectionEnum.preferences
  )

  const programs = listingSectionQuestions(
    listingDto,
    MultiselectQuestionsApplicationSectionEnum.programs
  )

  const enableApplicationStatus =
    doJurisdictionsHaveFeatureFlagOn(
      FeatureFlagEnum.enableApplicationStatus,
      listingDto?.jurisdictions.id
    ) && !!listingDto?.jurisdictions.id

  const enableUnitGroups = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableUnitGroups,
    listingDto?.jurisdictions.id
  )

  const enableFullTimeStudentQuestion = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableFullTimeStudentQuestion,
    listingDto?.jurisdictions.id
  )

  const enableAdaOtherOption = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableAdaOtherOption,
    listingDto?.jurisdictions.id
  )

  const disableWorkInRegion = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.disableWorkInRegion,
    listingDto?.jurisdictions.id
  )

  const enableLimitedHowDidYouHear = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableLimitedHowDidYouHear,
    listingDto?.jurisdictions.id
  )

  const swapCommunityTypeWithPrograms = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.swapCommunityTypeWithPrograms,
    listingDto?.jurisdictions.id
  )
  const enableHousingAdvocate = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableHousingAdvocate,
    listingDto?.jurisdictions.id
  )

  const units = listingDto?.units

  const defaultValues = editMode ? mapApiToForm(application, listingDto) : {}

  const formMethods = useForm<FormTypes>({
    defaultValues,
  })

  const [initialLoad, setInitialLoad] = useState(true)

  if (editMode && initialLoad && listingDto) {
    formMethods.reset(defaultValues)
    setInitialLoad(false)
  }

  const router = useRouter()

  const { addToast } = useContext(MessageContext)

  const [alert, setAlert] = useState<AlertErrorType | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [householdMembers, setHouseholdMembers] = useState<HouseholdMember[]>([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmSections, setConfirmSections] = useState<AppStatusConfirmSections>({
    changes: [],
    removals: [],
  })
  const [pendingSubmit, setPendingSubmit] = useState<{
    data: FormTypes
    redirect: "details" | "new"
  } | null>(null)

  useEffect(() => {
    if (application?.householdMember) {
      const householdMemberNum = application.householdMember.length
      const orderedHouseholdMembers = application.householdMember
        //reset order ids to show members in order user added them
        .map((member, idx) => {
          return { ...member, orderId: householdMemberNum - idx }
        })
        .sort((a, b) => a.orderId - b.orderId)
      setHouseholdMembers(orderedHouseholdMembers)
    }
  }, [application, setHouseholdMembers])

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, trigger, clearErrors, reset } = formMethods

  const triggerSubmit = async (data: FormTypes) => {
    if (!editMode || !enableApplicationStatus) {
      await onSubmit(data, "details")
      return
    }

    const sections = buildAppStatusConfirmSections(data, defaultValues)
    const shouldConfirm = sections.changes.length > 0 || sections.removals.length > 0

    if (!shouldConfirm) {
      await onSubmit(data, "details")
      return
    }

    setConfirmSections(sections)
    setPendingSubmit({ data, redirect: "details" })
    setConfirmOpen(true)
  }

  const triggerSubmitAndRedirect = async () => {
    const validation = await trigger()

    if (validation) {
      const data = formMethods.getValues()

      if (data) {
        void onSubmit(data, "new")
      }
    } else {
      onError()
    }
  }

  async function notifyApplicationUpdate(applicationId: string) {
    if (!applicationsService || !application) return

    try {
      await applicationsService.notifyUpdate({
        id: applicationId,
        body: {
          previousStatus: application.status,
          previousAccessibleUnitWaitlistNumber: application.accessibleUnitWaitlistNumber,
          previousConventionalUnitWaitlistNumber: application.conventionalUnitWaitlistNumber,
        },
      })
    } catch (err) {
      console.error(err)
    }
  }

  const onSubmit = async (data: FormTypes, redirect: "details" | "new") => {
    setAlert(null)
    setLoading(true)

    const formData = {
      householdMembers,
      submissionType: application?.submissionType,
      ...data,
    }

    const body = mapFormToApi({
      data: formData,
      listingId,
      editMode,
      programs: programs.map((item) => item?.multiselectQuestions),
      preferences: preferences.map((item) => item?.multiselectQuestions),
    })

    try {
      const result = editMode
        ? await applicationsService.update({
            id: application.id,
            body: {
              id: application.id,
              ...body,
              reviewStatus: application.reviewStatus,
            } as unknown as ApplicationUpdate,
          })
        : await applicationsService.create({
            body: {
              ...body,
              reviewStatus: ApplicationReviewStatusEnum.valid,
            } as unknown as ApplicationCreate,
          })

      setLoading(false)

      if (result) {
        if (editMode && enableApplicationStatus) {
          void notifyApplicationUpdate(result.id)
        }

        addToast(
          editMode
            ? t("application.add.applicationUpdated")
            : t("application.add.applicationSubmitted"),
          { variant: "success" }
        )

        if (redirect === "details") {
          void router.push(`/application/${result.id}`)
        } else {
          reset()
          setHouseholdMembers([])
          clearErrors()
          setAlert(null)
          await router.push(`/listings/${listingId}/applications/add`)
        }
      }
    } catch (err) {
      setLoading(false)
      setAlert("api")
    }
  }

  const closeConfirmDialog = () => {
    setConfirmOpen(false)
    setPendingSubmit(null)
  }

  const confirmSubmit = async () => {
    const queuedSubmit = pendingSubmit
    closeConfirmDialog()
    if (queuedSubmit) {
      await onSubmit(queuedSubmit.data, queuedSubmit.redirect)
    }
  }

  const onError = () => {
    setAlert("form")
  }

  async function deleteApplication() {
    try {
      await applicationsService.delete({ body: { id: application?.id } })
      void router.push(`/listings/${listingId}/applications`)
    } catch (err) {
      setAlert("api")
    }
  }

  return (
    <LoadingOverlay isLoading={loading}>
      <>
        <StatusBar>
          <ApplicationStatusTag status={application?.status} />
        </StatusBar>

        <FormProvider {...formMethods}>
          <section className="bg-primary-lighter py-5">
            <div className="max-w-screen-xl px-5 mx-auto">
              {editMode && application?.markedAsDuplicate && (
                <AlertBox className="mb-5" type="alert">
                  {t("applications.duplicates.markedAsDuplicateAlert")}
                </AlertBox>
              )}
              {alert && (
                <AlertBox className="mb-5" onClose={() => setAlert(null)} closeable type="alert">
                  {alert === "form"
                    ? t("application.add.applicationAddError")
                    : t("errors.alert.badRequest")}
                </AlertBox>
              )}

              <Form id="application-form" onSubmit={handleSubmit(triggerSubmit, onError)}>
                <div className="flex flex-row flex-wrap">
                  <div className="info-card md:w-9/12">
                    <FormApplicationData
                      enableApplicationStatus={enableApplicationStatus}
                      disableApplicationStatusControls={
                        enableApplicationStatus && editMode && application?.markedAsDuplicate
                      }
                      reviewOrderType={listingDto?.reviewOrderType}
                    />

                    <FormPrimaryApplicant
                      enableFullTimeStudentQuestion={enableFullTimeStudentQuestion}
                      disableWorkInRegion={disableWorkInRegion}
                    />

                    <FormAlternateContact enableHousingAdvocate={enableHousingAdvocate} />

                    <FormHouseholdMembers
                      householdMembers={householdMembers}
                      setHouseholdMembers={setHouseholdMembers}
                      enableFullTimeStudentQuestion={enableFullTimeStudentQuestion}
                      disableWorkInRegion={disableWorkInRegion}
                    />

                    <FormHouseholdDetails
                      listingUnits={units}
                      listingUnitGroups={listingDto?.unitGroups}
                      applicationUnitTypes={application?.preferredUnitTypes}
                      applicationAccessibilityFeatures={application?.accessibility}
                      enableOtherAdaOption={enableAdaOtherOption}
                      enableUnitGroups={enableUnitGroups}
                      enableFullTimeStudentQuestion={enableFullTimeStudentQuestion}
                    />

                    <FormMultiselectQuestions
                      questions={programs}
                      applicationSection={MultiselectQuestionsApplicationSectionEnum.programs}
                      sectionTitle={
                        swapCommunityTypeWithPrograms
                          ? t("application.details.communityTypes")
                          : t("application.details.programs")
                      }
                    />

                    <FormHouseholdIncome />

                    <FormMultiselectQuestions
                      questions={preferences}
                      applicationSection={MultiselectQuestionsApplicationSectionEnum.preferences}
                      sectionTitle={t("application.details.preferences")}
                    />

                    <FormDemographics
                      formValues={application?.demographics}
                      enableLimitedHowDidYouHear={enableLimitedHowDidYouHear}
                    />

                    <FormTerms />
                  </div>

                  <aside className="md:w-3/12 md:pl-6">
                    <Aside
                      type={editMode ? "edit" : "add"}
                      listingId={listingId}
                      onDelete={() => deleteApplication()}
                      triggerSubmitAndRedirect={triggerSubmitAndRedirect}
                    />
                  </aside>
                </div>
              </Form>
            </div>
          </section>
        </FormProvider>

        <Dialog
          isOpen={confirmOpen}
          ariaLabelledBy="application-save-confirmation-header"
          ariaDescribedBy="application-save-confirmation-content"
          onClose={closeConfirmDialog}
        >
          <Dialog.Header id="application-save-confirmation-header">
            {t("application.confirmation.header")}
          </Dialog.Header>
          <Dialog.Content id="application-save-confirmation-content">
            {confirmSections.changes.length > 0 && (
              <>
                <p>{t("application.confirmation.changesIntro")}</p>
                <ul className="list-disc pl-5">
                  {confirmSections.changes.map((item) => (
                    <li key={`${item.label}-${item.value}`}>{`${item.label}: ${item.value}`}</li>
                  ))}
                </ul>
              </>
            )}
            {confirmSections.removals.length > 0 && (
              <>
                <p className={confirmSections.changes.length > 0 ? "mt-6" : ""}>
                  {t("application.confirmation.removalsIntro")}
                </p>
                <ul className="list-disc pl-5">
                  {confirmSections.removals.map((item) => (
                    <li key={`${item.label}-${item.value}`}>{`${item.label}: ${item.value}`}</li>
                  ))}
                </ul>
              </>
            )}
          </Dialog.Content>
          <Dialog.Footer>
            <Button variant="primary" size="sm" onClick={() => void confirmSubmit()}>
              {t("application.add.saveAndExit")}
            </Button>
            <Button variant="primary-outlined" size="sm" onClick={closeConfirmDialog}>
              {t("t.cancel")}
            </Button>
          </Dialog.Footer>
        </Dialog>
      </>
    </LoadingOverlay>
  )
}

export default ApplicationForm

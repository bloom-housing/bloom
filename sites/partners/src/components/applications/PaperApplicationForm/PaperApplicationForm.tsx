import React, { useState, useContext, useEffect } from "react"
import { useRouter } from "next/router"
import { t, Form, AlertBox, LoadingOverlay } from "@bloom-housing/ui-components"
import { Tag } from "@bloom-housing/ui-seeds"
import { AuthContext, MessageContext, listingSectionQuestions } from "@bloom-housing/shared-helpers"
import { useForm, FormProvider } from "react-hook-form"
import {
  Application,
  ApplicationCreate,
  ApplicationReviewStatusEnum,
  ApplicationStatusEnum,
  ApplicationUpdate,
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

type ApplicationFormProps = {
  listingId: string
  application?: Application
  editMode?: boolean
}

type AlertErrorType = "api" | "form"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ApplicationForm = ({ listingId, editMode, application }: ApplicationFormProps) => {
  const { listingDto } = useSingleListingData(listingId)

  const preferences = listingSectionQuestions(
    listingDto,
    MultiselectQuestionsApplicationSectionEnum.preferences
  )

  const programs = listingSectionQuestions(
    listingDto,
    MultiselectQuestionsApplicationSectionEnum.programs
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

  const { applicationsService } = useContext(AuthContext)
  const { addToast } = useContext(MessageContext)

  const [alert, setAlert] = useState<AlertErrorType | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [householdMembers, setHouseholdMembers] = useState<HouseholdMember[]>([])

  useEffect(() => {
    if (application?.householdMember) {
      setHouseholdMembers(application.householdMember)
    }
  }, [application, setHouseholdMembers])

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, trigger, clearErrors, reset } = formMethods

  const triggerSubmit = async (data: FormTypes) => onSubmit(data, "details")

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

  /*
    @data: form data comes from the react-hook-form
    @redirect: open application details or reset form
  */
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
          <Tag
            className="tag-uppercase"
            variant={application?.status == ApplicationStatusEnum.submitted ? "success" : "primary"}
            size={"lg"}
          >
            {application?.status
              ? t(`application.details.applicationStatus.${application.status}`)
              : t(`application.details.applicationStatus.draft`)}
          </Tag>
        </StatusBar>

        <FormProvider {...formMethods}>
          <section className="bg-primary-lighter py-5">
            <div className="max-w-screen-xl px-5 mx-auto">
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
                    <FormApplicationData appType={application?.submissionType} />

                    <FormPrimaryApplicant />

                    <FormAlternateContact />

                    <FormHouseholdMembers
                      householdMembers={householdMembers}
                      setHouseholdMembers={setHouseholdMembers}
                    />

                    <FormHouseholdDetails
                      listingUnits={units}
                      applicationUnitTypes={application?.preferredUnitTypes}
                      applicationAccessibilityFeatures={application?.accessibility}
                    />

                    <FormMultiselectQuestions
                      questions={programs}
                      applicationSection={MultiselectQuestionsApplicationSectionEnum.programs}
                      sectionTitle={t("application.details.programs")}
                    />

                    <FormHouseholdIncome />

                    <FormMultiselectQuestions
                      questions={preferences}
                      applicationSection={MultiselectQuestionsApplicationSectionEnum.preferences}
                      sectionTitle={t("application.details.preferences")}
                    />

                    <FormDemographics formValues={application?.demographics} />

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
      </>
    </LoadingOverlay>
  )
}

export default ApplicationForm

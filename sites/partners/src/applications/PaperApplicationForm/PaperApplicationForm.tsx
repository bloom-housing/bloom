import React, { useState, useContext } from "react"
import { useRouter } from "next/router"
import { ApiClientContext, t, Form, AlertBox, AlertTypes } from "@bloom-housing/ui-components"
import { useForm, FormProvider, UseFormMethods } from "react-hook-form"
import { HouseholdMember } from "@bloom-housing/backend-core/types"
import { formatApplicationData } from "../../../lib/formatApplicationData"

import { FormApplicationData } from "./sections/FormApplicationData"
import { FormPrimaryApplicant } from "./sections/FormPrimaryApplicant"
import { FormAlternateContact } from "./sections/FormAlternateContact"
import { FormHouseholdMembers } from "./sections/FormHouseholdMembers"
import { FormHouseholdDetails } from "./sections/FormHouseholdDetails"
import { FormPreferences } from "./sections/FormPreferences"
import { FormHouseholdIncome } from "./sections/FormHouseholdIncome"
import { FormDemographics } from "./sections/FormDemographics"
import { FormTerms } from "./sections/FormTerms"

import { FormAside } from "./FormAside"
import { FormTypes } from "./FormTypes"

type ApplicationFormProps = {
  listingId: string
  editMode?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ApplicationForm = ({ listingId, editMode }: ApplicationFormProps) => {
  const router = useRouter()

  const { applicationsService } = useContext(ApiClientContext)

  const [alert, setAlert] = useState<AlertTypes | null>(null)
  const [householdMembers, setHouseholdMembers] = useState<HouseholdMember[]>([])

  const formMethods = useForm<UseFormMethods<FormTypes>>()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, getValues, trigger } = formMethods

  const triggerSubmit = async (data: FormTypes) => onSubmit(data, "details")

  const triggerSubmitAndRedirect = async () => {
    const validation = await trigger()

    if (validation) {
      const data: FormTypes = void getValues()

      void onSubmit(data, "new")
    } else {
      onError()
    }
  }

  /*
    @data: form data comes from the react-hook-form
    @redirect: open application details or blank application form
  */
  const onSubmit = async (data: FormTypes, redirect: "details" | "new") => {
    setAlert(null)

    const formData = {
      householdMembers,
      ...data,
    }

    const body = formatApplicationData(formData, listingId, false)

    try {
      const result = await applicationsService.create({ body })

      if (result) {
        setAlert("success")

        setTimeout(() => {
          if (redirect === "details") {
            void router.push(`/applications/${result.id}`)
          } else {
            void router.push(`/listings/${listingId}/add`)
          }
        }, 2000)
      }
    } catch (err) {
      setAlert("alert")
    }
  }

  const onError = () => {
    setAlert("alert")
  }

  return (
    <FormProvider {...formMethods}>
      <section className="bg-primary-lighter">
        <div className="max-w-screen-xl px-5 my-5 mx-auto">
          {alert && (
            <AlertBox onClose={() => setAlert(null)} closeable type={alert}>
              {alert === "success"
                ? t("application.add.applicationSubmitted")
                : t("application.add.applicationAddError")}
            </AlertBox>
          )}

          <Form id="application-form" onSubmit={handleSubmit(triggerSubmit, onError)}>
            <div className="flex flex-row flex-wrap mt-5">
              <div className="info-card md:w-9/12">
                <FormApplicationData />

                <FormPrimaryApplicant />

                <FormAlternateContact />

                <FormHouseholdMembers
                  householdMembers={householdMembers}
                  setHouseholdMembers={setHouseholdMembers}
                />

                <FormHouseholdDetails />

                <FormPreferences />

                <FormHouseholdIncome />

                <FormDemographics />

                <FormTerms />
              </div>

              <aside className="md:w-3/12 md:pl-6">
                <FormAside
                  isEdit={false}
                  triggerSubmitAndRedirect={triggerSubmitAndRedirect}
                  listingId={listingId}
                />
              </aside>
            </div>
          </Form>
        </div>
      </section>
    </FormProvider>
  )
}

export default ApplicationForm

import React, { useState, useContext } from "react"
import { useRouter } from "next/router"
import {
  ApiClientContext,
  t,
  Tag,
  StatusAside,
  StatusMessages,
  GridCell,
  AppearanceSizeType,
  Button,
  LinkButton,
  Form,
  AlertBox,
  AppearanceStyleType,
  AlertTypes,
} from "@bloom-housing/ui-components"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { HouseholdMember } from "@bloom-housing/core"
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

type Props = {
  isEditable?: boolean
}

const ApplicationForm = ({ isEditable }: Props) => {
  const router = useRouter()
  const listingId = router.query.id as string
  const { applicationsService } = useContext(ApiClientContext)

  const [alert, setAlert] = useState<AlertTypes | null>(null)
  const [householdMembers, setHouseholdMembers] = useState<HouseholdMember[]>([])

  const formMethods = useForm()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, getValues, trigger } = formMethods

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const triggerSubmit = async (data: any) => onSubmit(data, "details")

  const triggerSubmitAndRedirect = async () => {
    const validation = await trigger()

    if (validation) {
      const data = getValues()
      void onSubmit(data, "new")
    } else {
      onError()
    }
  }

  const onSubmit = async (data: any, redirect: "details" | "new") => {
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
      <div className="flex justify-end max-w-screen-xl px-5 mx-auto w-full">
        <div className="md:w-3/12 py-3 md:pl-6">
          <Tag className="block" pillStyle={true} size={AppearanceSizeType.big}>
            {t("application.details.applicationStatus.draft")}
          </Tag>
        </div>
      </div>

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
                <FormApplicationData {...formMethods} />
                <FormPrimaryApplicant {...formMethods} />
                <FormAlternateContact {...formMethods} />
                <FormHouseholdMembers
                  householdMembers={householdMembers}
                  setHouseholdMembers={setHouseholdMembers}
                  {...formMethods}
                />
                <FormHouseholdDetails {...formMethods} />
                <FormPreferences {...formMethods} />
                <FormHouseholdIncome {...formMethods} />

                <FormDemographics {...formMethods} />

                <FormTerms {...formMethods} />
              </div>

              <aside className="md:w-3/12 md:pl-6">
                <StatusAside
                  columns={1}
                  actions={[
                    <GridCell key="btn-submit">
                      <Button
                        styleType={AppearanceStyleType.primary}
                        fullWidth
                        onClick={() => false}
                      >
                        {t("t.submit")}
                      </Button>
                    </GridCell>,
                    <GridCell key="btn-submitNew">
                      <Button
                        type="button"
                        styleType={AppearanceStyleType.secondary}
                        fullWidth
                        onClick={() => triggerSubmitAndRedirect()}
                      >
                        {t("t.submitNew")}
                      </Button>
                    </GridCell>,
                    <GridCell className="flex" key="btn-cancel">
                      <LinkButton
                        unstyled
                        fullWidth
                        className="bg-opacity-0"
                        href={`/listings/${listingId}/applications`}
                      >
                        {t("t.cancel")}
                      </LinkButton>
                    </GridCell>,
                  ]}
                >
                  {isEditable && <StatusMessages lastTimestamp="" />}
                </StatusAside>
              </aside>
            </div>
          </Form>
        </div>
      </section>
    </FormProvider>
  )
}

export default ApplicationForm

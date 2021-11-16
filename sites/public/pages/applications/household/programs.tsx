import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import {
  AlertBox,
  Form,
  FormCard,
  ProgressNav,
  FieldGroup,
  t,
  Button,
  AppearanceStyleType,
  OnClientSide,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import FormBackLink from "../../../src/forms/applications/FormBackLink"
import { useFormConductor } from "../../../lib/hooks"
import {
  mapProgramsToApi,
  getProgramOptionName,
  getProgramOptionDescription,
} from "@bloom-housing/shared-helpers"

const ApplicationPrograms = () => {
  const clientLoaded = OnClientSide()
  const { conductor, application, listing } = useFormConductor("programs")
  const programs = listing?.listingPrograms
  const uniquePages = new Set(programs?.map((item) => item.ordinal)).size
  console.info(uniquePages)
  const [page, setPage] = useState(conductor.navigatedThroughBack ? uniquePages : 1)
  const [pageProgram, setPageProgram] = useState(null)
  const [programData, setProgramData] = useState(null)

  const currentPageSection = 2

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, reset } = useForm({
    defaultValues: {
      application: { programs: {} },
    },
  })

  /*
    Required to keep the form up to date before submitting this section if you're moving between pages
  */
  useEffect(() => {
    const findProgram = programs?.find((item) => {
      return item.ordinal === page
    })?.program
    if (findProgram) {
      setPageProgram(findProgram)
      setProgramData(application.programs.find((item) => item.key === findProgram.formMetadata.key))
    }
    reset({
      application: { programs: {} },
    })
  }, [page, programs, application.programs, reset])

  /*
    Submits the form
  */
  const onSubmit = (data) => {
    let programsData = mapProgramsToApi(
      programs.map((item) => item.program),
      data
    )

    if (uniquePages > 1) {
      // If we've split programs across multiple pages, save the data in segments
      const programsDataKeys = programsData.map((program) => program.key)
      const currentPrograms = application.programs.filter((program) => {
        return !programsDataKeys.includes(program.key)
      })
      programsData = [...currentPrograms, ...programsData]
      conductor.currentStep.save(programsData)
    } else {
      // Otherwise, submit all at once
      conductor.currentStep.save(programsData)
    }
    // Update to the next page if we have more pages
    if (page !== uniquePages) {
      setPage(page + 1)
      return
    }
    // Otherwise complete the section and move to the next URL
    conductor.completeSection(2)
    conductor.routeToNextOrReturnUrl()
  }

  if (!clientLoaded) {
    return null
  }

  return (
    <FormsLayout>
      <FormCard header={listing?.name}>
        <ProgressNav
          currentPageSection={currentPageSection}
          completedSections={application.completedSections}
          labels={conductor.config.sections.map((label) => t(`t.${label}`))}
        />
      </FormCard>

      <FormCard>
        <FormBackLink
          url={conductor.determinePreviousUrl()}
          onClick={() => {
            conductor.setNavigatedBack(true)
            setPage(page - 1)
          }}
          custom={page > 1}
        />

        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">{pageProgram?.description}</h2>

          {pageProgram?.subTitle && pageProgram?.subTitle !== "" && (
            <p className="field-note mt-5">{pageProgram.subtitle}</p>
          )}
        </div>

        {!!Object.keys(errors).length && (
          <AlertBox type="alert" inverted closeable>
            {t("errors.errorsToResolve")}
          </AlertBox>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <>
            {pageProgram && (
              <div key={pageProgram.id}>
                <div className="form-card__group px-0">
                  <fieldset>
                    <p className="field-note mb-4">{t("t.pleaseSelectOne")}</p>

                    <FieldGroup
                      fieldGroupClassName="grid grid-cols-1"
                      fieldClassName="ml-0"
                      type="radio"
                      name={pageProgram?.formMetadata?.key}
                      error={errors[pageProgram?.formMetadata?.key]}
                      errorMessage={t("errors.selectAnOption")}
                      register={register}
                      validation={{ required: true }}
                      dataTestId={"app-program-option"}
                      fields={pageProgram?.formMetadata?.options?.map((option) => {
                        return {
                          id: option.key,
                          label: t(getProgramOptionName(option.key, pageProgram.formMetadata.key)),
                          value: option.key,
                          description: option.description
                            ? t(
                                getProgramOptionDescription(
                                  option.key,
                                  pageProgram.formMetadata.key
                                )
                              )
                            : null,
                          defaultChecked: programData?.options?.find(
                            (item) => item.key === option.key
                          )?.checked,
                        }
                      })}
                    />
                  </fieldset>
                </div>
              </div>
            )}

            <div className="form-card__pager">
              <div className="form-card__pager-row primary">
                <Button
                  styleType={AppearanceStyleType.primary}
                  onClick={() => {
                    conductor.returnToReview = false
                    conductor.setNavigatedBack(false)
                  }}
                  data-test-id={"app-next-step-button"}
                >
                  {t("t.next")}
                </Button>
              </div>

              {conductor.canJumpForwardToReview() && (
                <div className="form-card__pager-row">
                  <Button
                    unstyled={true}
                    className="mb-4"
                    onClick={() => {
                      conductor.returnToReview = true
                    }}
                  >
                    {t("application.form.general.saveAndReturn")}
                  </Button>
                </div>
              )}
            </div>
          </>
        </Form>
      </FormCard>
    </FormsLayout>
  )
}

export default ApplicationPrograms

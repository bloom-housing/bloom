import React, { useMemo, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import {
  AlertBox,
  Form,
  FormCard,
  ProgressNav,
  Field,
  t,
  ExpandableContent,
  Button,
  AppearanceStyleType,
  resolveObject,
  OnClientSide,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import FormBackLink from "../../../src/forms/applications/FormBackLink"
import { useFormConductor } from "../../../lib/hooks"
import { FormMetadataExtraData, Program } from "@bloom-housing/backend-core/types"
import {
  mapProgramsToApi,
  mapApiToProgramsForm,
  getProgramOptionName,
  getExclusiveProgramOptionName,
  getExclusiveKeys,
  setExclusive,
} from "@bloom-housing/shared-helpers"

const ApplicationPrograms = () => {
  const clientLoaded = OnClientSide()
  const { conductor, application, listing } = useFormConductor("programs")
  const programs = listing?.listingPrograms
  const uniquePages: number[] = [...Array.from(new Set(programs?.map((item) => item.ordinal)))]
  const [page, setPage] = useState(conductor.navigatedThroughBack ? uniquePages.length : 1)
  const [applicationPrograms, setApplicationPrograms] = useState(application.programs)
  const programsByPage = programs
    ?.filter((item) => {
      return item.ordinal === page
    })
    .map((item) => item.program)

  const currentPageSection = 2

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, handleSubmit, errors, getValues, reset, trigger } = useForm({
    defaultValues: {
      application: { programs: mapApiToProgramsForm(applicationPrograms) },
    },
  })

  const [exclusiveKeys, setExclusiveKeys] = useState(getExclusiveKeys(programsByPage))

  /*
    Required to keep the form up to date before submitting this section if you're moving between pages
  */
  useEffect(() => {
    reset({
      application: { programs: mapApiToProgramsForm(applicationPrograms) },
    })
    setExclusiveKeys(getExclusiveKeys(programsByPage))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, applicationPrograms, reset])

  /*
    Collects all checkbox ids by each individual program to see if at least one checkbox is checked per program
    Validation is used in 'somethingIsChecked' validator.
    E.g.

    servedInMilitary:
      application.programs.options.servedInMilitary.servedInMilitary.claimed
      application.programs.options.servedInMilitary.doNotConsider.claimed
  */
  const programCheckboxIds = useMemo(() => {
    return programsByPage?.reduce((acc, item) => {
      const programName = item.formMetadata?.key
      const optionPaths = item.formMetadata?.options
        ? item.formMetadata.options.map((option) => {
            return getProgramOptionName(option.key, programName)
          })
        : []
      if (item.formMetadata && !item.formMetadata?.hideGenericDecline) {
        optionPaths.push(getExclusiveProgramOptionName(item?.formMetadata?.key))
      }

      Object.assign(acc, {
        [programName]: optionPaths,
      })

      return acc
    }, {})
  }, [programsByPage])

  /*
    Submits the form
  */
  const onSubmit = (data) => {
    const body = mapProgramsToApi(data)
    if (uniquePages.length > 1) {
      // If we've split programs across multiple pages, save the data in segments
      const currentPrograms = conductor.currentStep.application.programs.filter((program) => {
        return program.key !== body[0].key
      })
      conductor.currentStep.save([...currentPrograms, body[0]])
      setApplicationPrograms([...currentPrograms, body[0]])
    } else {
      // Otherwise, submit all at once
      conductor.currentStep.save(body)
    }
    // Update to the next page if we have more pages
    if (page !== uniquePages.length) {
      setPage(page + 1)
      return
    }
    // Otherwise complete the section and move to the next URL
    conductor.completeSection(2)
    conductor.routeToNextOrReturnUrl()
  }

  if (!clientLoaded || !programCheckboxIds) {
    return null
  }

  /*
    Builds the JSX of a program option
  */
  const getOption = (
    optionKey: string | null,
    optionName: string,
    description: boolean,
    exclusive: boolean,
    extraData: FormMetadataExtraData[],
    program: Program,
    label?: string
  ) => {
    return (
      <div className="mb-5" key={optionKey}>
        <div className={`mb-5 field ${resolveObject(optionName, errors) ? "error" : ""}`}>
          <Field
            id={optionName}
            name={optionName}
            type="checkbox"
            label={
              label ??
              t(`application.programs.${program.formMetadata.key}.${optionKey}.label`, {
                county: listing?.countyCode,
              })
            }
            register={register}
            inputProps={{
              onChange: (e) => {
                if (e.target.checked) {
                  void trigger()
                }
                if (exclusive && e.target.checked)
                  setExclusive(true, setValue, exclusiveKeys, optionName, program)
                if (!exclusive) setExclusive(false, setValue, exclusiveKeys, optionName, program)
              },
            }}
            validation={{
              validate: {
                somethingIsChecked: (value) =>
                  value ||
                  programCheckboxIds[program.formMetadata.key].some((option) => getValues(option)),
              },
            }}
          />
        </div>

        {!(description === false) && (
          <div className="ml-8 -mt-3">
            <ExpandableContent>
              <p className="field-note mb-8">
                {t(`application.programs.${program.formMetadata.key}.${optionKey}.description`, {
                  county: listing?.countyCode,
                })}
              </p>
            </ExpandableContent>
          </div>
        )}
      </div>
    )
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
          custom={page === uniquePages.length}
        />

        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">{t("application.programs.title")}</h2>
        </div>

        {!!Object.keys(errors).length && (
          <AlertBox type="alert" inverted closeable>
            {t("errors.errorsToResolve")}
          </AlertBox>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <>
            {programsByPage?.map((program, index) => {
              return (
                <div key={program.id}>
                  <div
                    className={`form-card__group px-0 ${
                      index + 1 !== programsByPage.length ? "border-b" : ""
                    }`}
                  >
                    <fieldset>
                      <legend className="field-label--caps mb-4">{program.title}</legend>
                      <p className="field-note mb-8">{program.description}</p>
                      {program?.formMetadata?.options?.map((option) => {
                        return getOption(
                          option.key,
                          getProgramOptionName(option.key, program.formMetadata.key),
                          option.description,
                          option.exclusive,
                          option.extraData,
                          program
                        )
                      })}
                    </fieldset>
                  </div>
                </div>
              )
            })}

            <div className="form-card__pager">
              <div className="form-card__pager-row primary">
                <Button
                  styleType={AppearanceStyleType.primary}
                  onClick={() => {
                    conductor.returnToReview = false
                    conductor.setNavigatedBack(false)
                  }}
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

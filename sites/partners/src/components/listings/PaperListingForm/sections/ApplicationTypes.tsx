import React, { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import {
  t,
  Drawer,
  Dropzone,
  FieldGroup,
  Field,
  MinimalTable,
  Select,
  StandardTableData,
} from "@bloom-housing/ui-components"
import {
  fieldMessage,
  fieldHasError,
  YesNoAnswer,
  pdfFileNameFromFileId,
} from "../../../../lib/helpers"
import { Button, Grid } from "@bloom-housing/ui-seeds"
import {
  ApplicationMethodCreate,
  ApplicationMethodsTypeEnum,
  LanguagesEnum,
  YesNoEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { FormListing } from "../../../../lib/listings/formTypes"
import { uploadAssetAndSetData } from "../../../../lib/assets"
import SectionWithGrid from "../../../shared/SectionWithGrid"

interface Methods {
  digital: ApplicationMethodCreate
  paper: ApplicationMethodCreate
  referral: ApplicationMethodCreate
}

const ApplicationTypes = ({ listing }: { listing: FormListing }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, watch, errors, getValues } = useFormContext()
  // watch fields
  const digitalApplicationChoice = watch("digitalApplicationChoice")
  const commonDigitalApplicationChoice = watch("commonDigitalApplicationChoice")
  const paperApplicationChoice = watch("paperApplicationChoice")
  /*
    Set state for methods, drawer, upload progress, and more
  */
  const [methods, setMethods] = useState<Methods>({
    digital: null,
    paper: null,
    referral: null,
  })
  const [selectedLanguage, setSelectedLanguage] = useState(LanguagesEnum.en)
  const [drawerState, setDrawerState] = useState(false)
  const [progressValue, setProgressValue] = useState(0)
  const [cloudinaryData, setCloudinaryData] = useState({
    id: "",
    url: "",
  })
  const resetDrawerState = () => {
    setProgressValue(0)
    setCloudinaryData({
      id: "",
      url: "",
    })
    setDrawerState(false)
  }

  const yesNoRadioOptions = [
    {
      label: t("t.yes"),
      value: YesNoEnum.yes,
    },
    {
      label: t("t.no"),
      value: YesNoEnum.no,
    },
  ]

  const paperApplicationsTableHeaders = {
    fileName: "t.fileName",
    language: "t.language",
    actions: "",
  }

  const savePaperApplication = () => {
    const paperApplications = methods.paper?.paperApplications ?? []
    paperApplications.push({
      assets: {
        fileId: cloudinaryData.id,
        label: selectedLanguage,
      },
      language: selectedLanguage,
    })
    setMethods({
      ...methods,
      paper: {
        ...methods.paper,
        paperApplications,
        type: ApplicationMethodsTypeEnum.FileDownload,
      },
    })
  }

  /*
    Pass the file for the dropzone callback along to the uploader
  */
  const pdfUploader = async (file: File) => {
    await uploadAssetAndSetData(file, "application", setProgressValue, setCloudinaryData)
  }

  /*
    Show a preview of the uploaded file within the drawer
  */
  const previewPaperApplicationsTableRows: StandardTableData = []
  if (cloudinaryData.url != "") {
    previewPaperApplicationsTableRows.push({
      fileName: { content: pdfFileNameFromFileId(cloudinaryData.id) },
      language: { content: t(`languages.${selectedLanguage}`) },
      actions: {
        content: (
          <Button
            type="button"
            size="sm"
            className="font-semibold text-alert"
            onClick={() => {
              setCloudinaryData({
                id: "",
                url: "",
              })
              setProgressValue(0)
            }}
            variant="text"
          >
            {t("t.delete")}
          </Button>
        ),
      },
    })
  }

  /**
   * set initial methods
   */
  useEffect(() => {
    // set methods here
    const temp: Methods = {
      digital: null,
      paper: null,
      referral: null,
    }
    const applicationMethods =
      getValues()?.applicationMethods?.length > 0
        ? getValues().applicationMethods
        : listing?.applicationMethods

    applicationMethods?.forEach((method) => {
      switch (method.type) {
        case ApplicationMethodsTypeEnum.Internal:
        case ApplicationMethodsTypeEnum.ExternalLink:
          temp["digital"] = method
          break
        case ApplicationMethodsTypeEnum.FileDownload:
          temp["paper"] = method
          break
        case ApplicationMethodsTypeEnum.Referral:
          temp["referral"] = method
          break
        default:
          break
      }
    })
    setMethods(temp)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * set application methods value when any of the methods change
   */
  useEffect(() => {
    const applicationMethods = []
    for (const key in methods) {
      if (methods[key]) {
        applicationMethods.push(methods[key])
      }
    }
    setValue("applicationMethods", applicationMethods)
  }, [methods, setValue])
  // register applicationMethods so we can set a value for it
  register("applicationMethods")

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid
        heading={t("listings.sections.applicationTypesTitle")}
        subheading={t("listings.sections.applicationTypesSubtitle")}
      >
        <Grid.Row columns={2}>
          <Grid.Cell>
            <p
              className={`field-label m-4 ml-0 ${
                fieldHasError(errors?.digitalApplication) &&
                digitalApplicationChoice === null &&
                "text-alert"
              }`}
            >
              {t("listings.isDigitalApplication")}
            </p>

            <FieldGroup
              name="digitalApplicationChoice"
              type="radio"
              register={register}
              error={fieldHasError(errors?.digitalApplication) && digitalApplicationChoice === null}
              errorMessage={fieldMessage(errors?.digitalApplication)}
              groupSubNote={t("listings.requiredToPublish")}
              fields={[
                {
                  ...yesNoRadioOptions[0],
                  id: "digitalApplicationChoiceYes",
                  defaultChecked: listing?.digitalApplication === true ?? null,
                  inputProps: {
                    onChange: () => {
                      setMethods({
                        ...methods,
                        digital: {
                          ...methods.digital,
                          type: ApplicationMethodsTypeEnum.Internal,
                        },
                      })
                    },
                  },
                },
                {
                  ...yesNoRadioOptions[1],
                  id: "digitalApplicationChoiceNo",
                  defaultChecked: listing?.digitalApplication === false ?? null,
                  inputProps: {
                    onChange: () => {
                      setMethods({
                        ...methods,
                        digital: null,
                      })
                    },
                  },
                },
              ]}
            />
          </Grid.Cell>

          {digitalApplicationChoice === YesNoAnswer.Yes && (
            <Grid.Cell>
              <p className="field-label m-4 ml-0">{t("listings.usingCommonDigitalApplication")}</p>

              <FieldGroup
                name="commonDigitalApplicationChoice"
                type="radio"
                register={register}
                fields={[
                  {
                    ...yesNoRadioOptions[0],
                    id: "commonDigitalApplicationChoiceYes",
                    defaultChecked:
                      methods?.digital?.type === ApplicationMethodsTypeEnum.Internal ?? null,
                    inputProps: {
                      onChange: () => {
                        setMethods({
                          ...methods,
                          digital: {
                            ...methods.digital,
                            type: ApplicationMethodsTypeEnum.Internal,
                          },
                        })
                      },
                    },
                  },
                  {
                    ...yesNoRadioOptions[1],
                    id: "commonDigitalApplicationChoiceNo",
                    defaultChecked:
                      methods?.digital?.type === ApplicationMethodsTypeEnum.ExternalLink ?? null,
                    inputProps: {
                      onChange: () => {
                        setMethods({
                          ...methods,
                          digital: {
                            ...methods.digital,
                            type: ApplicationMethodsTypeEnum.ExternalLink,
                          },
                        })
                      },
                    },
                  },
                ]}
              />
            </Grid.Cell>
          )}
        </Grid.Row>

        {((commonDigitalApplicationChoice &&
          commonDigitalApplicationChoice === YesNoEnum.no &&
          digitalApplicationChoice === YesNoEnum.yes) ||
          (digitalApplicationChoice === YesNoEnum.yes &&
            !commonDigitalApplicationChoice &&
            listing?.commonDigitalApplication === false)) && (
          <Grid.Row columns={1}>
            <Grid.Cell>
              <Field
                label={t("listings.customOnlineApplicationUrl")}
                name="customOnlineApplicationUrl"
                id="customOnlineApplicationUrl"
                placeholder="https://"
                subNote={t("listings.requiredToPublish")}
                inputProps={{
                  value: methods.digital?.externalReference
                    ? methods.digital.externalReference
                    : "",
                  onChange: (e) => {
                    setMethods({
                      ...methods,
                      digital: {
                        ...methods.digital,
                        type: ApplicationMethodsTypeEnum.ExternalLink,
                        externalReference: e.target.value,
                      },
                    })
                  },
                }}
                error={fieldHasError(errors?.applicationMethods?.[0]?.externalReference)}
                errorMessage={fieldMessage(errors?.applicationMethods?.[0]?.externalReference)}
              />
            </Grid.Cell>
          </Grid.Row>
        )}

        <Grid.Row columns={2}>
          <Grid.Cell>
            <p
              className={`field-label m-4 ml-0 ${
                fieldHasError(errors?.paperApplication) &&
                paperApplicationChoice === null &&
                "text-alert"
              }`}
            >
              {t("listings.isPaperApplication")}
            </p>

            <FieldGroup
              name="paperApplicationChoice"
              type="radio"
              groupSubNote={t("listings.requiredToPublish")}
              error={fieldHasError(errors?.paperApplication) && paperApplicationChoice === null}
              errorMessage={fieldMessage(errors?.paperApplication)}
              register={register}
              fields={[
                {
                  ...yesNoRadioOptions[0],
                  id: "paperApplicationYes",
                  defaultChecked: listing?.paperApplication === true ?? null,
                  inputProps: {
                    onChange: () => {
                      setMethods({
                        ...methods,
                        paper: {
                          ...methods.paper,
                          type: ApplicationMethodsTypeEnum.FileDownload,
                        },
                      })
                    },
                  },
                },
                {
                  ...yesNoRadioOptions[1],
                  id: "paperApplicationNo",
                  defaultChecked: listing?.paperApplication === false ?? null,
                  inputProps: {
                    onChange: () => {
                      setMethods({
                        ...methods,
                        paper: null,
                      })
                    },
                  },
                },
              ]}
            />
          </Grid.Cell>
        </Grid.Row>
        {paperApplicationChoice === YesNoEnum.yes && (
          <Grid.Row columns={1}>
            <Grid.Cell>
              {methods.paper?.paperApplications?.length > 0 && (
                <MinimalTable
                  className="mb-8"
                  headers={paperApplicationsTableHeaders}
                  data={methods.paper.paperApplications.map((item) => ({
                    fileName: { content: pdfFileNameFromFileId(item.assets.fileId) },
                    language: { content: t(`languages.${item.language}`) },
                    actions: {
                      content: (
                        <div className="flex">
                          <Button
                            type="button"
                            size="sm"
                            className="font-semibold text-alert"
                            onClick={() => {
                              const items = methods.paper.paperApplications.filter(
                                (paperApp) => item !== paperApp
                              )

                              setMethods({
                                ...methods,
                                paper: {
                                  ...methods.paper,
                                  paperApplications: items,
                                  type: ApplicationMethodsTypeEnum.FileDownload,
                                },
                              })
                            }}
                            variant="text"
                          >
                            {t("t.delete")}
                          </Button>
                        </div>
                      ),
                    },
                  }))}
                ></MinimalTable>
              )}
              <Button
                type="button"
                variant="primary-outlined"
                size="sm"
                onClick={() => {
                  // default the application to English:
                  setSelectedLanguage(LanguagesEnum.en)
                  setDrawerState(true)
                }}
              >
                {t("listings.addPaperApplication")}
              </Button>
            </Grid.Cell>
          </Grid.Row>
        )}
      </SectionWithGrid>

      <Drawer
        open={drawerState}
        title={t("listings.addPaperApplication")}
        onClose={() => resetDrawerState()}
        ariaDescription="Form with paper application upload dropzone"
        actions={[
          <Button
            key={0}
            onClick={() => {
              savePaperApplication()
              resetDrawerState()
            }}
            variant="primary"
            size="sm"
          >
            Save
          </Button>,
          <Button
            key={1}
            onClick={() => {
              resetDrawerState()
            }}
            variant="primary-outlined"
            size="sm"
          >
            Cancel
          </Button>,
        ]}
      >
        <section className="border rounded-md p-8 bg-white">
          {cloudinaryData.url === "" && (
            <div className="field">
              <p className="mb-2">
                <label className="label">{t("t.language")}</label>
              </p>
              <Select
                name="paperApplicationLanguage"
                options={Object.values(LanguagesEnum).map((item) => ({
                  label: t(`languages.${item}`),
                  value: item,
                }))}
                defaultValue={selectedLanguage}
                inputProps={{
                  onChange: (e) => {
                    setSelectedLanguage(e.target.value)
                  },
                }}
              />
            </div>
          )}
          <Dropzone
            id="listing-paper-application-upload"
            label={t("t.uploadFile")}
            helptext={t("listings.pdfHelperText")}
            uploader={pdfUploader}
            accept="application/pdf"
            progress={progressValue}
          />
          {cloudinaryData.url !== "" && (
            <MinimalTable
              headers={paperApplicationsTableHeaders}
              data={previewPaperApplicationsTableRows}
            ></MinimalTable>
          )}
        </section>
      </Drawer>
    </>
  )
}

export default ApplicationTypes

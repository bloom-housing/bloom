import React, { useContext, useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import {
  t,
  Dropzone,
  FieldGroup,
  Field,
  MinimalTable,
  Select,
  Textarea,
  PhoneField,
  PhoneMask,
  StandardTableData,
} from "@bloom-housing/ui-components"
import { Button, Card, Drawer, Grid } from "@bloom-housing/ui-seeds"
import { cloudinaryFileUploader, fieldMessage, fieldHasError } from "../../../../lib/helpers"
import {
  ApplicationMethodCreate,
  ApplicationMethodsTypeEnum,
  FeatureFlagEnum,
  LanguagesEnum,
  YesNoEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { FormListing } from "../../../../lib/listings/formTypes"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { AuthContext } from "@bloom-housing/shared-helpers"

interface Methods {
  digital: ApplicationMethodCreate
  paper: ApplicationMethodCreate
  referral: ApplicationMethodCreate
}

const ApplicationTypes = ({ listing }: { listing: FormListing }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, watch, errors, getValues } = useFormContext()
  const { doJurisdictionsHaveFeatureFlagOn, getJurisdictionLanguages } = useContext(AuthContext)

  const getDefaultMethods = () => {
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
    return temp
  }

  // watch fields
  const jurisdiction: string = watch("jurisdictions.id")
  const digitalApplicationChoice = watch("digitalApplicationChoice")
  const commonDigitalApplicationChoice = watch("commonDigitalApplicationChoice")
  const paperApplicationChoice = watch("paperApplicationChoice")
  const referralOpportunityChoice = watch("referralOpportunityChoice")

  /*
    Set state for methods, drawer, upload progress, and more
  */
  const [methods, setMethods] = useState<Methods>(getDefaultMethods())
  const [selectedLanguage, setSelectedLanguage] = useState("")
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

  const disableCommonApplication = jurisdiction
    ? doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.disableCommonApplication, jurisdiction)
    : false

  const availableJurisdictionLanguages = jurisdiction ? getJurisdictionLanguages(jurisdiction) : []

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
      language: selectedLanguage as LanguagesEnum,
    })
    setMethods({
      ...methods,
      paper: {
        ...methods.paper,
        paperApplications,
      },
    })
  }

  /*
    Pass the file for the dropzone callback along to the uploader
  */
  const pdfUploader = async (file: File) => {
    void (await cloudinaryFileUploader({ file, setCloudinaryData, setProgressValue }))
  }

  /*
    Show a preview of the uploaded file within the drawer
  */

  const previewPaperApplicationsTableRows: StandardTableData = []
  if (cloudinaryData.url != "") {
    previewPaperApplicationsTableRows.push({
      fileName: { content: `${cloudinaryData.id.split("/").slice(-1).join()}.pdf` },
      language: { content: selectedLanguage ? t(`languages.${selectedLanguage}`) : "" },
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
                  defaultChecked: listing?.digitalApplication === true,
                  inputProps: {
                    onChange: () => {
                      setMethods({
                        ...methods,
                        digital: {
                          ...methods.digital,
                          type: disableCommonApplication
                            ? ApplicationMethodsTypeEnum.ExternalLink
                            : ApplicationMethodsTypeEnum.Internal,
                        },
                      })
                    },
                  },
                },
                {
                  ...yesNoRadioOptions[1],
                  id: "digitalApplicationChoiceNo",
                  defaultChecked: listing?.digitalApplication === false,
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
          {!disableCommonApplication && digitalApplicationChoice === YesNoEnum.yes && (
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
                    defaultChecked: methods.digital.type === ApplicationMethodsTypeEnum.Internal,
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
                      methods.digital.type === ApplicationMethodsTypeEnum.ExternalLink,
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
        {digitalApplicationChoice === YesNoEnum.yes &&
          (disableCommonApplication ||
            commonDigitalApplicationChoice === YesNoEnum.no ||
            (!commonDigitalApplicationChoice && listing?.commonDigitalApplication === false)) && (
            <Grid.Row columns={1}>
              <Grid.Cell>
                <Field
                  label={t("listings.customOnlineApplicationUrl")}
                  name="customOnlineApplicationUrl"
                  id="customOnlineApplicationUrl"
                  placeholder="https://"
                  inputProps={{
                    value: methods.digital?.externalReference
                      ? methods.digital.externalReference
                      : "",
                    onChange: (e) => {
                      setMethods({
                        ...methods,
                        digital: {
                          ...methods.digital,
                          externalReference: e.target?.value,
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
                  defaultChecked: listing?.paperApplication === true,
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
                  defaultChecked: listing?.paperApplication === false,
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
                    fileName: { content: `${item.assets.fileId.split("/").slice(-1).join()}.pdf` },
                    language: { content: item.language ? t(`languages.${item.language}`) : "" },
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
                  setDrawerState(true)
                }}
              >
                {t("listings.addPaperApplication")}
              </Button>
            </Grid.Cell>
          </Grid.Row>
        )}
        <Grid.Row columns={1}>
          <Grid.Cell>
            <p
              className={`field-label m-4 ml-0 ${
                fieldHasError(errors?.referralOpportunity) &&
                referralOpportunityChoice === null &&
                "text-alert"
              }`}
            >
              {t("listings.isReferralOpportunity")}
            </p>

            <FieldGroup
              name="referralOpportunityChoice"
              type="radio"
              register={register}
              groupSubNote={t("listings.requiredToPublish")}
              error={
                fieldHasError(errors?.referralOpportunity) && referralOpportunityChoice === null
              }
              errorMessage={fieldMessage(errors?.referralOpportunity)}
              fields={[
                {
                  ...yesNoRadioOptions[0],
                  id: "referralOpportunityYes",
                  defaultChecked: listing?.referralOpportunity === true,
                  inputProps: {
                    onChange: () => {
                      setMethods({
                        ...methods,
                        referral: {
                          ...methods.referral,
                          type: ApplicationMethodsTypeEnum.Referral,
                        },
                      })
                    },
                  },
                },
                {
                  ...yesNoRadioOptions[1],
                  id: "referralOpportunityNo",
                  defaultChecked: listing?.referralOpportunity === false,
                  inputProps: {
                    onChange: () => {
                      setMethods({
                        ...methods,
                        referral: null,
                      })
                    },
                  },
                },
              ]}
            />
          </Grid.Cell>
        </Grid.Row>
        {referralOpportunityChoice === YesNoEnum.yes && (
          <Grid.Row columns={3}>
            <Grid.Cell>
              <PhoneField
                label={t("listings.referralContactPhone")}
                name="referralContactPhone"
                id="referralContactPhone"
                placeholder={t("t.phoneNumberPlaceholder")}
                mask={() => (
                  <PhoneMask
                    name="referralContactPhone"
                    value={methods.referral ? methods.referral.phoneNumber : ""}
                    placeholder={t("t.phoneNumberPlaceholder")}
                    onChange={(e) => {
                      setMethods({
                        ...methods,
                        referral: {
                          ...methods.referral,
                          phoneNumber: e,
                        },
                      })
                    }}
                  />
                )}
                controlClassName={"control"}
              />
            </Grid.Cell>
            <Grid.Cell className="seeds-grid-span-2">
              <Textarea
                label={t("listings.referralSummary")}
                rows={3}
                fullWidth={true}
                placeholder={t("t.descriptionTitle")}
                name="referralSummary"
                id="referralSummary"
                maxLength={500}
                inputProps={{
                  value: methods.referral ? methods.referral.externalReference : "",
                  onChange: (e) => {
                    setMethods({
                      ...methods,
                      referral: {
                        ...methods.referral,
                        externalReference: e.target?.value,
                      },
                    })
                  },
                }}
              />
            </Grid.Cell>
          </Grid.Row>
        )}
      </SectionWithGrid>

      <Drawer
        isOpen={drawerState}
        onClose={() => resetDrawerState()}
        ariaLabelledBy="application-types-drawer-header"
      >
        <Drawer.Header id="application-types-drawer-header">
          {t("listings.addPaperApplication")}
        </Drawer.Header>
        <Drawer.Content>
          <Card>
            <Card.Section>
              {cloudinaryData.url === "" && (
                <div className="field">
                  <p className="mb-2">
                    <label className="label">{t("t.language")}</label>
                  </p>
                  <Select
                    name="paperApplicationLanguage"
                    options={[
                      ...availableJurisdictionLanguages.map((item) => ({
                        label: t(`languages.${item}`),
                        value: item,
                      })),
                    ]}
                    placeholder={t("t.selectLanguage")}
                    defaultValue={selectedLanguage}
                    validation={{ required: true }}
                    inputProps={{
                      onChange: (e) => {
                        setSelectedLanguage(e.target?.value)
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
            </Card.Section>
          </Card>
        </Drawer.Content>
        <Drawer.Footer>
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
          </Button>
          <Button
            key={1}
            onClick={() => {
              resetDrawerState()
            }}
            variant="primary-outlined"
            size="sm"
          >
            Cancel
          </Button>
        </Drawer.Footer>
      </Drawer>
    </>
  )
}

export default ApplicationTypes

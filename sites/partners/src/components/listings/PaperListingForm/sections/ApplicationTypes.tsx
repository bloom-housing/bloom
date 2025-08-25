import React, { useContext, useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import {
  t,
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
  getLabel,
  pdfFileNameFromFileId,
} from "../../../../lib/helpers"
import { Button, Card, Drawer, Grid } from "@bloom-housing/ui-seeds"
import {
  ApplicationMethodCreate,
  ApplicationMethodsTypeEnum,
  FeatureFlagEnum,
  LanguagesEnum,
  YesNoEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { FormListing } from "../../../../lib/listings/formTypes"
import { uploadAssetAndSetData } from "../../../../lib/assets"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import styles from "../ListingForm.module.scss"

interface Methods {
  digital: ApplicationMethodCreate
  paper: ApplicationMethodCreate
  referral: ApplicationMethodCreate
}

type ApplicationTypesProps = {
  listing: FormListing
  requiredFields: string[]
}

const ApplicationTypes = ({ listing, requiredFields }: ApplicationTypesProps) => {
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
          <Grid.Cell
            className={fieldHasError(errors?.digitalApplication) ? styles["label-error"] : ""}
          >
            <FieldGroup
              name="digitalApplicationChoice"
              type="radio"
              register={register}
              groupLabel={getLabel(
                "digitalApplication",
                requiredFields,
                t("listings.isDigitalApplication")
              )}
              error={fieldHasError(errors?.digitalApplication) && digitalApplicationChoice === null}
              errorMessage={fieldMessage(errors?.digitalApplication)}
              fieldLabelClassName={`${styles["label-option"]} seeds-m-bs-2`}
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
              <FieldGroup
                name="commonDigitalApplicationChoice"
                type="radio"
                groupLabel={t("listings.usingCommonDigitalApplication")}
                register={register}
                fieldLabelClassName={`${styles["label-option"]} seeds-m-bs-2`}
                fields={[
                  {
                    ...yesNoRadioOptions[0],
                    id: "commonDigitalApplicationChoiceYes",
                    defaultChecked: methods.digital?.type === ApplicationMethodsTypeEnum.Internal,
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
                      methods.digital?.type === ApplicationMethodsTypeEnum.ExternalLink,
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
          <Grid.Cell
            className={fieldHasError(errors?.paperApplication) ? styles["label-error"] : ""}
          >
            <FieldGroup
              name="paperApplicationChoice"
              type="radio"
              groupLabel={getLabel(
                "paperApplication",
                requiredFields,
                t("listings.isPaperApplication")
              )}
              error={fieldHasError(errors?.paperApplication) && paperApplicationChoice === null}
              errorMessage={fieldMessage(errors?.paperApplication)}
              register={register}
              fieldLabelClassName={`${styles["label-option"]} seeds-m-bs-2`}
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
                    fileName: { content: pdfFileNameFromFileId(item.assets.fileId) },
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
                />
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
        {/*
        // referral opportunity removed from Doorway
        <Grid.Row columns={1}>
          <Grid.Cell
            className={fieldHasError(errors?.referralOpportunity) ? styles["label-error"] : ""}
          >
            <FieldGroup
              name="referralOpportunityChoice"
              type="radio"
              register={register}
              fieldLabelClassName={`${styles["label-option"]} seeds-m-bs-2`}
              groupLabel={getLabel(
                "referralOpportunity",
                requiredFields,
                t("listings.isReferralOpportunity")
              )}
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
                mask={() => (
                  <PhoneMask
                    name="referralContactPhone"
                    value={methods.referral ? methods.referral.phoneNumber : ""}
                    onChange={(e) => {
                      setMethods({
                        ...methods,
                        referral: {
                          ...methods.referral,
                          phoneNumber: e.target.value,
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
                placeholder={""}
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
                        type: ApplicationMethodsTypeEnum.Referral,
                        externalReference: e.target?.value,
                      },
                    })
                  },
                },
              },
              {
                ...yesNoRadioOptions[1],
                id: "referralOpportunityNo",
                defaultChecked: listing?.referralOpportunity === false ?? null,
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
        // </Grid.Row>
        // {referralOpportunityChoice === YesNoEnum.yes && (
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
                        phoneNumber: e.target.value,
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
                      externalReference: e.target.value,
                    },
                  })
                },
              }}
            />
          </Grid.Cell>
        </Grid.Row>
        // )} */}
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
                    id={"paperApplicationLanguage"}
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

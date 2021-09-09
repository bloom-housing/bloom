import React, { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import {
  t,
  AppearanceBorderType,
  AppearanceStyleType,
  Button,
  Drawer,
  Dropzone,
  GridSection,
  GridCell,
  FieldGroup,
  Field,
  MinimalTable,
  Select,
  Textarea,
  PhoneField,
  PhoneMask,
} from "@bloom-housing/ui-components"
import { YesNoAnswer } from "../../../applications/PaperApplicationForm/FormTypes"
import { cloudinaryFileUploader } from "../../../../lib/helpers"
import {
  ApplicationMethodCreate,
  ApplicationMethodType,
  Language,
} from "@bloom-housing/backend-core/types"
import { FormListing } from "../index"

interface Methods {
  digital: ApplicationMethodCreate
  paper: ApplicationMethodCreate
  referral: ApplicationMethodCreate
}

const ApplicationTypes = ({ listing }: { listing: FormListing }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, watch } = useFormContext()
  // watch fields
  const digitalApplicationChoice = watch("digitalApplicationChoice")
  const commonDigitalApplicationChoice = watch("commonDigitalApplicationChoice")
  const paperApplicationChoice = watch("paperApplicationChoice")
  const referralOpportunityChoice = watch("referralOpportunityChoice")
  /*
    Set state for methods, drawer, upload progress, and more
  */
  const [methods, setMethods] = useState<Methods>({
    digital: null,
    paper: null,
    referral: null,
  })
  const [selectedLanguage, setSelectedLanguage] = useState(Language.en)
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
      value: YesNoAnswer.Yes,
    },
    {
      label: t("t.no"),
      value: YesNoAnswer.No,
    },
  ]

  const paperApplicationsTableHeaders = {
    fileName: "t.fileName",
    language: "t.language",
    actions: "",
  }

  const savePaperApplication = () => {
    const paperApplications = methods.paper ? methods.paper.paperApplications : []
    paperApplications.push({
      file: {
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
  const previewPaperApplicationsTableRows = []
  if (cloudinaryData.url != "") {
    previewPaperApplicationsTableRows.push({
      fileName: `${cloudinaryData.id.split("/").slice(-1).join()}.pdf`,
      language: t(`languages.${selectedLanguage}`),
      actions: (
        <Button
          type="button"
          className="font-semibold uppercase text-red-700"
          onClick={() => {
            setCloudinaryData({
              id: "",
              url: "",
            })
            setProgressValue(0)
          }}
          unstyled
        >
          {t("t.delete")}
        </Button>
      ),
    })
  }

  /**
   * set initial methods
   */
  useEffect(() => {
    // if any of these are already not null then don't set from initial listing
    if (methods.digital || methods.paper || methods.referral) return
    // set methods here
    const temp: Methods = {
      digital: null,
      paper: null,
      referral: null,
    }
    listing?.applicationMethods?.forEach((method) => {
      switch (method.type) {
        case ApplicationMethodType.ExternalLink:
          temp["digital"] = method
          break
        case ApplicationMethodType.FileDownload:
          temp["paper"] = method
          break
        case ApplicationMethodType.Referral:
          temp["referral"] = method
          break
        default:
          break
      }
    })
    setMethods(temp)
    // register applicationMethods so we can set a value for it
    register("applicationMethods")
  }, [
    listing?.applicationMethods,
    methods.digital,
    methods.paper,
    methods.referral,
    register,
    setValue,
  ])

  /**
   * set application methods value when any of the methods change
   */
  useEffect(() => {
    const applicationMethods = []
    for (const key in methods) {
      const method = methods[key]
      if (!method) continue
      switch (key) {
        case "digital":
          method.type =
            commonDigitalApplicationChoice === YesNoAnswer.Yes
              ? ApplicationMethodType.Internal
              : ApplicationMethodType.ExternalLink
          break
        case "paper":
          method.type = ApplicationMethodType.FileDownload
          break
        case "referral":
          method.type = ApplicationMethodType.Referral
          break
        default:
          break
      }
      applicationMethods.push(method)
    }
    setValue("applicationMethods", applicationMethods)
  }, [commonDigitalApplicationChoice, methods, setValue])
  return (
    <>
      <GridSection
        grid={false}
        separator
        title={t("listings.sections.applicationTypesTitle")}
        description={t("listings.sections.applicationTypesSubtitle")}
      >
        <GridSection columns={2}>
          <GridCell>
            <p className="field-label m-4 ml-0">{t("listings.isDigitalApplication")}</p>

            <FieldGroup
              name="digitalApplicationChoice"
              type="radio"
              register={register}
              fields={[
                {
                  ...yesNoRadioOptions[0],
                  id: "digitalApplicationChoiceYes",
                  defaultChecked: listing?.digitalApplication === true,
                },
                {
                  ...yesNoRadioOptions[1],
                  id: "digitalApplicationChoiceNo",
                  defaultChecked: listing?.digitalApplication === false,
                },
              ]}
            />
          </GridCell>
          {digitalApplicationChoice === YesNoAnswer.Yes && (
            <GridCell>
              <p className="field-label m-4 ml-0">{t("listings.usingCommonDigitalApplication")}</p>

              <FieldGroup
                name="commonDigitalApplicationChoice"
                type="radio"
                register={register}
                fields={[
                  {
                    ...yesNoRadioOptions[0],
                    id: "commonDigitalApplicationChoiceYes",
                    defaultChecked: listing?.commonDigitalApplication === true,
                  },
                  {
                    ...yesNoRadioOptions[1],
                    id: "commonDigitalApplicationChoiceNo",
                    defaultChecked: listing?.commonDigitalApplication === false,
                  },
                ]}
              />
            </GridCell>
          )}
        </GridSection>
        {((commonDigitalApplicationChoice && commonDigitalApplicationChoice === YesNoAnswer.No) ||
          (digitalApplicationChoice === YesNoAnswer.Yes &&
            !commonDigitalApplicationChoice &&
            listing?.commonDigitalApplication === false)) && (
          <GridSection columns={1}>
            <GridCell>
              <Field
                label={t("listings.customOnlineApplicationUrl")}
                name="customOnlineApplicationUrl"
                id="customOnlineApplicationUrl"
                placeholder="https://"
                inputProps={{
                  value: methods.digital ? methods.digital.externalReference : "",
                  onChange: (e) => {
                    setMethods({
                      ...methods,
                      digital: {
                        ...methods.digital,
                        externalReference: e.target.value,
                      },
                    })
                  },
                }}
              />
            </GridCell>
          </GridSection>
        )}

        <GridSection columns={2}>
          <GridCell>
            <p className="field-label m-4 ml-0">{t("listings.isPaperApplication")}</p>

            <FieldGroup
              name="paperApplicationChoice"
              type="radio"
              register={register}
              fields={[
                {
                  ...yesNoRadioOptions[0],
                  id: "paperApplicationYes",
                  defaultChecked: listing?.paperApplication === true,
                },
                {
                  ...yesNoRadioOptions[1],
                  id: "paperApplicationNo",
                  defaultChecked: listing?.paperApplication === false,
                },
              ]}
            />
          </GridCell>
        </GridSection>
        {paperApplicationChoice === YesNoAnswer.Yes && (
          <GridSection columns={1} tinted inset>
            <GridCell>
              {methods.paper?.paperApplications.length > 0 && (
                <MinimalTable
                  className="mb-8"
                  headers={paperApplicationsTableHeaders}
                  data={methods.paper.paperApplications.map((item) => ({
                    fileName: `${item.file.fileId.split("/").slice(-1).join()}.pdf`,
                    langauge: t(`languages.${item.language}`),
                    actions: (
                      <div className="flex">
                        <Button
                          type="button"
                          className="font-semibold uppercase text-red-700"
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
                          unstyled
                        >
                          {t("t.delete")}
                        </Button>
                      </div>
                    ),
                  }))}
                ></MinimalTable>
              )}
              <Button
                type="button"
                onClick={() => {
                  // default the application to English:
                  setSelectedLanguage(Language.en)
                  setDrawerState(true)
                }}
              >
                {t("listings.addPaperApplication")}
              </Button>
            </GridCell>
          </GridSection>
        )}

        <GridSection columns={1}>
          <GridCell>
            <p className="field-label m-4 ml-0">{t("listings.isReferralOpportunity")}</p>

            <FieldGroup
              name="referralOpportunityChoice"
              type="radio"
              register={register}
              fields={[
                {
                  ...yesNoRadioOptions[0],
                  id: "referralOpportunityYes",
                  defaultChecked: listing?.referralOpportunity === true,
                },
                {
                  ...yesNoRadioOptions[1],
                  id: "referralOpportunityNo",
                  defaultChecked: listing?.referralOpportunity === false,
                },
              ]}
            />
          </GridCell>
        </GridSection>
        {referralOpportunityChoice === YesNoAnswer.Yes && (
          <GridSection columns={3}>
            <GridCell>
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
            </GridCell>
            <GridCell span={2}>
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
            </GridCell>
          </GridSection>
        )}
      </GridSection>

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
            styleType={AppearanceStyleType.primary}
          >
            Save
          </Button>,
          <Button
            key={1}
            onClick={() => {
              resetDrawerState()
            }}
            styleType={AppearanceStyleType.secondary}
            border={AppearanceBorderType.borderless}
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
                options={Object.values(Language).map((item) => ({
                  label: t(`languages.${item}`),
                  value: item,
                }))}
                noDefault={true}
                inputProps={{
                  value: selectedLanguage,
                  onChange: (e) => {
                    setSelectedLanguage(e.target.value)
                  },
                }}
              />
            </div>
          )}
          <Dropzone
            id="listing-paper-application-upload"
            label="Upload File"
            helptext="Select PDF file"
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

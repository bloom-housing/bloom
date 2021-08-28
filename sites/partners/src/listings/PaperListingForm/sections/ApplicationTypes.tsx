import React, { useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
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
} from "@bloom-housing/ui-components"
import { YesNoAnswer } from "../../../applications/PaperApplicationForm/FormTypes"
import { cloudinaryFileUploader } from "../../../../lib/helpers"
import { ApplicationMethodType, Language } from "@bloom-housing/backend-core/types"
import { FormListing } from "../index"

interface ApplicationTypesProps {
  listing: FormListing
  methodsState: any
}

const ApplicationTypes = ({ listing, methodsState }: ApplicationTypesProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, control } = formMethods

  const {
    digitalApplicationMethod,
    paperApplicationMethod,
    referralApplicationMethod,
    paperApplications,
    setPaperApplications,
  } = methodsState

  /*
    Set state for the drawer, upload progress, and more
  */
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

  const digitalApplicationChoice = useWatch({
    control,
    name: "digitalApplicationChoice",
  })

  const commonDigitalApplicationChoice = useWatch({
    control,
    name: "commonDigitalApplicationChoice",
  })

  const paperApplicationChoice = useWatch({
    control,
    name: "paperApplicationChoice",
  })

  const selectedPaperApplicationLanguage = useWatch({
    control,
    name: "paperApplicationLanguage",
    defaultValue: Language.en,
  })

  const referralOpportunityChoice = useWatch({
    control,
    name: "referralOpportunityChoice",
  })

  const savePaperApplication = () => {
    setPaperApplications([
      ...paperApplications,
      {
        file: {
          fileId: cloudinaryData.id,
          label: selectedPaperApplicationLanguage,
        },
        language: selectedPaperApplicationLanguage,
      },
    ])
  }

  const paperApplicationsTableHeaders = {
    fileName: "t.fileName",
    language: "t.language",
    actions: "",
  }

  /*
    Show a preview of the uploaded file within the drawer
  */
  const previewPaperApplicationsTableRows = []
  if (cloudinaryData.url != "") {
    previewPaperApplicationsTableRows.push({
      fileName: `${cloudinaryData.id.split("/").slice(-1).join()}.pdf`,
      language: t(`languages.${selectedPaperApplicationLanguage}`),
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

  /*
    Show the paper applications in the listing form if they're present
  */
  const paperApplicationsTableRows = []
  if (
    (typeof paperApplicationChoice === "undefined" && paperApplicationMethod !== null) ||
    paperApplicationChoice === YesNoAnswer.Yes
  ) {
    paperApplications.forEach((item) => {
      paperApplicationsTableRows.push({
        fileName: `${item.file.fileId.split("/").slice(-1).join()}.pdf`,
        language: t(`languages.${item.language}`),
        actions: (
          <div className="flex">
            <Button
              type="button"
              className="font-semibold uppercase text-red-700"
              onClick={() => {
                setPaperApplications(paperApplications.filter((paperApp) => item !== paperApp))
              }}
              unstyled
            >
              {t("t.delete")}
            </Button>
          </div>
        ),
      })
    })
  }

  /*
    Pass the file for the dropzone callback along to the uploader
  */
  const pdfUploader = async (file: File) => {
    void (await cloudinaryFileUploader({ file, setCloudinaryData, setProgressValue }))
  }

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
                  defaultChecked: digitalApplicationMethod !== null,
                },
                {
                  ...yesNoRadioOptions[1],
                  id: "digitalApplicationChoiceNo",
                  defaultChecked: listing && digitalApplicationMethod === null,
                },
              ]}
            />
          </GridCell>
          {((typeof digitalApplicationChoice === "undefined" &&
            digitalApplicationMethod !== null) ||
            digitalApplicationChoice === YesNoAnswer.Yes) && (
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
                    defaultChecked:
                      listing && digitalApplicationMethod?.type === ApplicationMethodType.Internal,
                  },
                  {
                    ...yesNoRadioOptions[1],
                    id: "commonDigitalApplicationChoiceNo",
                    defaultChecked:
                      listing &&
                      digitalApplicationMethod?.type === ApplicationMethodType.ExternalLink,
                  },
                ]}
              />
            </GridCell>
          )}
        </GridSection>
        {((typeof commonDigitalApplicationChoice === "undefined" &&
          digitalApplicationMethod?.type === ApplicationMethodType.ExternalLink) ||
          commonDigitalApplicationChoice === YesNoAnswer.No) && (
          <GridSection columns={1}>
            <GridCell>
              <Field
                label={t("listings.customOnlineApplicationUrl")}
                name="customOnlineApplicationUrl"
                id="customOnlineApplicationUrl"
                defaultValue={digitalApplicationMethod?.externalReference}
                placeholder="https://"
                register={register}
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
                  id: "paperApplicationChoiceYes",
                  defaultChecked: paperApplicationMethod !== null,
                },
                {
                  ...yesNoRadioOptions[1],
                  id: "paperApplicationChoiceNo",
                  defaultChecked: listing && paperApplicationMethod === null,
                },
              ]}
            />
          </GridCell>
        </GridSection>
        {((typeof paperApplicationChoice === "undefined" && paperApplicationMethod !== null) ||
          paperApplicationChoice === YesNoAnswer.Yes) && (
          <GridSection columns={1} tinted inset>
            <GridCell>
              {paperApplications.length > 0 && (
                <MinimalTable
                  className="mb-8"
                  headers={paperApplicationsTableHeaders}
                  data={paperApplicationsTableRows}
                ></MinimalTable>
              )}
              <Button
                type="button"
                onClick={() => {
                  // default the application to English:
                  control.setValue("paperApplicationLanguage", Language.en)
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
                  id: "referralOpportunityChoiceYes",
                  defaultChecked: referralApplicationMethod !== null,
                },
                {
                  ...yesNoRadioOptions[1],
                  id: "referralOpportunityChoiceNo",
                  defaultChecked: listing && referralApplicationMethod === null,
                },
              ]}
            />
          </GridCell>
        </GridSection>
        {((typeof referralOpportunityChoice === "undefined" &&
          referralApplicationMethod !== null) ||
          referralOpportunityChoice === YesNoAnswer.Yes) && (
          <GridSection columns={3}>
            <GridCell>
              <PhoneField
                label={t("listings.referralContactPhone")}
                name="referralContactPhone"
                id="referralContactPhone"
                defaultValue={referralApplicationMethod?.phoneNumber}
                placeholder={t("t.phoneNumberPlaceholder")}
                control={control}
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
                defaultValue={referralApplicationMethod?.externalReference}
                register={register}
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
                register={register}
                options={Object.values(Language).map((item) => ({
                  label: t(`languages.${item}`),
                  value: item,
                }))}
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

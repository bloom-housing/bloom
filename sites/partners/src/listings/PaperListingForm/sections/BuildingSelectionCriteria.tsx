import React, { useState } from "react"
import { useFormContext } from "react-hook-form"
import {
  t,
  AppearanceBorderType,
  AppearanceStyleType,
  Button,
  cloudinaryUrlFromId,
  Drawer,
  Dropzone,
  Field,
  GridCell,
  GridSection,
  MinimalTable,
  TableThumbnail,
  FieldGroup,
} from "@bloom-housing/ui-components"
import { cloudinaryFileUploader } from "../../../../lib/helpers"

const LotteryResults = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, getValues, setValue, watch } = formMethods

  const listingCriteriaURL = watch("buildingSelectionCriteria")
  const listingCriteriaFile = watch("buildingSelectionCriteriaFile")
  const criteriaAttachType = watch("criteriaAttachType")

  /*
    Set state for the drawer, upload progress, drawer, and more
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

  const saveURL = (url) => {
    setValue("buildingSelectionCriteria", url)
  }
  const deleteURL = () => {
    setValue("buildingSelectionCriteria", "")
  }
  const savePDF = () => {
    setValue("buildingSelectionCriteriaFile", {
      fileId: cloudinaryData.id,
      label: "cloudinaryPDF",
    })
  }
  const deletePDF = () => {
    setValue("buildingSelectionCriteriaFile", { fileId: "", label: "" })
  }

  let criteriaTableHeaders: Record<string, string> = {
    preview: "t.preview",
    fileName: "t.fileName",
    actions: "",
  }
  const previewCriteriaTableHeaders = criteriaTableHeaders

  /*
    Show a preview of the uploaded file within the photo drawer
  */
  const previewTableRows = []
  if (cloudinaryData.url !== "") {
    previewTableRows.push({
      preview: (
        <TableThumbnail>
          <img alt="PDF preview" src={cloudinaryData.url} />
        </TableThumbnail>
      ),
      fileName: cloudinaryData.id.split("/").slice(-1).join(),
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
    Show the specified criteria in the listing form if its present
  */
  const criteriaTableRows = []
  if (listingCriteriaFile?.fileId && listingCriteriaFile.fileId != "") {
    const listingPhotoUrl = cloudinaryUrlFromId(listingCriteriaFile.fileId)

    criteriaTableRows.push({
      preview: (
        <TableThumbnail>
          <img src={listingPhotoUrl} />
        </TableThumbnail>
      ),
      fileName: listingCriteriaFile.fileId.split("/").slice(-1).join(),
      actions: (
        <div className="flex">
          <Button
            type="button"
            className="font-semibold uppercase"
            onClick={() => {
              setDrawerState(true)
            }}
            unstyled
          >
            {t("t.edit")}
          </Button>
          <Button
            type="button"
            className="font-semibold uppercase text-red-700"
            onClick={() => {
              setCloudinaryData({ ...cloudinaryData, id: "" })
              deletePDF()
            }}
            unstyled
          >
            {t("t.delete")}
          </Button>
        </div>
      ),
    })
  } else if (listingCriteriaURL && listingCriteriaURL != "") {
    criteriaTableHeaders = {
      fileName: t("t.url"),
      actions: criteriaTableHeaders.actions,
    }
    criteriaTableRows.push({
      fileName: listingCriteriaURL,
      actions: (
        <div className="flex">
          <Button
            type="button"
            className="font-semibold uppercase"
            onClick={() => {
              setDrawerState(true)
            }}
            unstyled
          >
            {t("t.edit")}
          </Button>
          <Button
            type="button"
            className="font-semibold uppercase text-red-700"
            onClick={() => {
              setValue("buildingSelectionCriteria", "")
            }}
            unstyled
          >
            {t("t.delete")}
          </Button>
        </div>
      ),
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
      <input type="hidden" {...register("buildingSelectionCriteria")} />
      <input type="hidden" {...register("buildingSelectionCriteriaFile.fileId")} />
      <input type="hidden" {...register("buildingSelectionCriteriaFile.label")} />

      <div className="field mt-8 mb-2">
        {((listingCriteriaURL && listingCriteriaURL != "") ||
          (listingCriteriaFile?.fileId && listingCriteriaFile.fileId != "")) && (
          <label className="label">{t("listings.buildingSelectionCriteria")}</label>
        )}
      </div>

      <GridSection columns={1} tinted inset>
        <GridCell>
          {(listingCriteriaURL && listingCriteriaURL != "") ||
          (listingCriteriaFile?.fileId && listingCriteriaFile.fileId != "") ? (
            <MinimalTable headers={criteriaTableHeaders} data={criteriaTableRows}></MinimalTable>
          ) : (
            <Button
              type="button"
              onClick={() => {
                setDrawerState(true)
              }}
            >
              {t("listings.addBuildingSelectionCriteria")}
            </Button>
          )}
        </GridCell>
      </GridSection>

      <Drawer
        open={drawerState}
        title={t("listings.addBuildingSelectionCriteria")}
        onClose={() => resetDrawerState()}
        ariaDescription="Form with photo upload dropzone"
        actions={[
          <Button
            key={0}
            onClick={() => {
              const value = getValues("buildingSelectionCriteriaURL")
              if (value) {
                deletePDF()
                saveURL(value)
              } else {
                deleteURL()
                savePDF()
              }
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
          <div className={!criteriaAttachType ? "" : "hidden"}>
            <span className="grid-section__description">
              How will you specify the building selection criteria?
            </span>
            <FieldGroup
              name="criteriaAttachType"
              type="radio"
              register={register}
              fields={[
                {
                  label: "Upload PDF",
                  value: "upload",
                  id: "criteriaAttachTypeUpload",
                  defaultChecked: false,
                },
                {
                  label: "Webpage URL",
                  value: "url",
                  id: "criteriaAttachTypeURL",
                  defaultChecked: false,
                },
              ]}
            />
          </div>

          {criteriaAttachType === "upload" && (
            <>
              <Dropzone
                id="listing-building-selection-criteria-upload"
                label="Upload File"
                helptext="Select PDF file"
                uploader={pdfUploader}
                accept="application/pdf"
                progress={progressValue}
              />
              {cloudinaryData.url !== "" && (
                <MinimalTable
                  headers={previewCriteriaTableHeaders}
                  data={previewTableRows}
                ></MinimalTable>
              )}
            </>
          )}
          {criteriaAttachType === "url" && (
            <Field
              label="Informational Webpage URL"
              name="buildingSelectionCriteriaURL"
              id="buildingSelectionCriteriaURL"
              register={register}
            />
          )}
        </section>
      </Drawer>
    </>
  )
}

export default LotteryResults

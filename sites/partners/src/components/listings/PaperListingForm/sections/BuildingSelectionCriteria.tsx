import React, { useState } from "react"
import { useFormContext } from "react-hook-form"
import {
  t,
  Dropzone,
  Field,
  MinimalTable,
  TableThumbnail,
  FieldGroup,
  StandardTableData,
  Icon,
} from "@bloom-housing/ui-components"
import { uploadAssetAndSetData } from "../../../../lib/assets"
import { Button, Card, Drawer, FieldValue, Grid, Heading } from "@bloom-housing/ui-seeds"

const BuildingSelectionCriteria = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, getValues, setValue, watch, errors, trigger } = formMethods

  const listingCriteriaURL = watch("buildingSelectionCriteria")
  const listingCriteriaFile = watch("listingsBuildingSelectionCriteriaFile")
  const criteriaAttachType = watch("criteriaAttachType")

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
    setValue("criteriaAttachType", null)
    setDrawerState(false)
  }

  const saveURL = (url) => {
    setValue("buildingSelectionCriteria", url)
    deletePDF()
  }
  const deleteURL = () => {
    setValue("buildingSelectionCriteria", "")
  }
  const savePDF = () => {
    setValue("listingsBuildingSelectionCriteriaFile", {
      fileId: cloudinaryData.id,
      label: "cloudinaryPDF",
    })
    deleteURL()
  }
  const deletePDF = () => {
    setValue("listingsBuildingSelectionCriteriaFile", { fileId: "", label: "" })
  }

  let criteriaTableHeaders: Record<string, string> = {
    preview: "t.preview",
    fileName: "t.fileName",
    actions: "",
  }
  const previewCriteriaTableHeaders = criteriaTableHeaders

  /*
    Show a preview of the uploaded file within the upload drawer
  */
  const previewTableRows: StandardTableData = []
  if (cloudinaryData.url !== "") {
    previewTableRows.push({
      preview: {
        content: (
          <TableThumbnail>
            {/*
              Using a PDF URL for an image usually doesn't work.
              Switching to UIC icon instead
            */}
            {/* <img alt="PDF preview" src={cloudinaryData.url} /> */}
            <Icon size="md-large" symbol="document" />
          </TableThumbnail>
        ),
      },
      fileName: { content: cloudinaryData.id.split("/").slice(-1).join() },
      actions: {
        content: (
          <Button
            type="button"
            className="font-semibold text-alert"
            onClick={() => {
              setCloudinaryData({
                id: "",
                url: "",
              })
              setProgressValue(0)
            }}
            variant="text"
            size="sm"
          >
            {t("t.delete")}
          </Button>
        ),
      },
    })
  }

  /*
    Show the specified criteria in the listing form if its present
  */
  const criteriaTableRows: StandardTableData = []
  if (listingCriteriaFile?.fileId && listingCriteriaFile.fileId != "") {
    //const listingPhotoUrl = getImageUrlFromAsset(listingCriteriaFile)

    criteriaTableRows.push({
      preview: {
        content: (
          <TableThumbnail>
            {/* Same as above */}
            {/* <img src={listingPhotoUrl} alt={"Upload preview"} /> */}
            <Icon size="md-large" symbol="document" />
          </TableThumbnail>
        ),
      },
      fileName: { content: listingCriteriaFile.fileId.split("/").slice(-1).join() },
      actions: {
        content: (
          <div className="flex gap-3">
            <Button
              type="button"
              className="font-semibold uppercase my-0"
              onClick={() => {
                setDrawerState(true)
              }}
              variant="text"
              size="sm"
            >
              {t("t.edit")}
            </Button>
            <Button
              type="button"
              className="font-semibold text-alert"
              onClick={() => {
                setCloudinaryData({ ...cloudinaryData, id: "" })
                deletePDF()
              }}
              variant="text"
              size="sm"
            >
              {t("t.delete")}
            </Button>
          </div>
        ),
      },
    })
  } else if (listingCriteriaURL && listingCriteriaURL != "") {
    criteriaTableHeaders = {
      fileName: "t.url",
      actions: criteriaTableHeaders.actions,
    }
    criteriaTableRows.push({
      fileName: { content: listingCriteriaURL },
      actions: {
        content: (
          <div className="flex gap-3">
            <Button
              type="button"
              className="font-semibold"
              onClick={() => {
                setDrawerState(true)
              }}
              variant="text"
              size="sm"
            >
              {t("t.edit")}
            </Button>
            <Button
              type="button"
              className="font-semibold text-alert"
              onClick={() => {
                setValue("buildingSelectionCriteria", "")
              }}
              variant="text"
              size="sm"
            >
              {t("t.delete")}
            </Button>
          </div>
        ),
      },
    })
  }

  /*
    Pass the file for the dropzone callback along to the uploader
  */
  const pdfUploader = async (file: File) => {
    await uploadAssetAndSetData(file, "selection-criteria", setProgressValue, setCloudinaryData)
  }

  return (
    <>
      <input type="hidden" {...register("buildingSelectionCriteria")} />
      <input type="hidden" {...register("listingsBuildingSelectionCriteriaFile.fileId")} />
      <input type="hidden" {...register("listingsBuildingSelectionCriteriaFile.label")} />

      {((listingCriteriaURL && listingCriteriaURL != "") ||
        (listingCriteriaFile?.fileId && listingCriteriaFile.fileId != "")) && (
        <Heading size="lg" priority={3} className="spacer-header">
          {t("listings.buildingSelectionCriteria")}
        </Heading>
      )}
      <Grid spacing="lg" className="grid-inset-section">
        <Grid.Row>
          <Grid.Cell>
            {(listingCriteriaURL && listingCriteriaURL != "") ||
            (listingCriteriaFile?.fileId && listingCriteriaFile.fileId != "") ? (
              <MinimalTable
                headers={criteriaTableHeaders}
                data={criteriaTableRows}
                id="buildingSelectionCriteriaTable"
              />
            ) : (
              <Button
                id="addBuildingSelectionCriteriaButton"
                type="button"
                variant="primary-outlined"
                size="sm"
                onClick={() => {
                  setDrawerState(true)
                }}
              >
                {t("listings.addBuildingSelectionCriteria")}
              </Button>
            )}
          </Grid.Cell>
        </Grid.Row>
      </Grid>

      <Drawer
        isOpen={drawerState}
        onClose={() => resetDrawerState()}
        ariaLabelledBy="building-selection-criteria-drawer-header"
      >
        <Drawer.Header id="building-selection-criteria-drawer-header">
          {t("listings.addBuildingSelectionCriteria")}
        </Drawer.Header>
        <Drawer.Content>
          <Card>
            <Card.Section>
              <FieldValue
                label={t("listings.addBuildingSelectionCriteriaSubtitle")}
                className={!criteriaAttachType ? "" : "hidden"}
              >
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
              </FieldValue>

              {criteriaAttachType === "upload" && (
                <>
                  <Dropzone
                    id="listing-building-selection-criteria-upload"
                    label={t("t.uploadFile")}
                    helptext={t("listings.pdfHelperText")}
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
                  type="url"
                  placeholder="https://"
                  label="Informational Webpage URL"
                  name="buildingSelectionCriteriaURL"
                  id="buildingSelectionCriteriaURL"
                  register={register}
                  error={errors?.buildingSelectionCriteriaURL}
                  errorMessage={
                    errors?.buildingSelectionCriteriaURL?.type === "https"
                      ? t("errors.urlHttpsError")
                      : t("errors.urlError")
                  }
                />
              )}
            </Card.Section>
          </Card>
        </Drawer.Content>
        <Drawer.Footer>
          <Button
            id="saveBuildingSelectionCriteriaButton"
            key={0}
            onClick={async () => {
              // Only try to save values if an attachment type has been selected
              if (criteriaAttachType) {
                const value = getValues("buildingSelectionCriteriaURL")
                if (value) {
                  const validation = await trigger()
                  if (!validation) return
                  deletePDF()
                  saveURL(value)
                } else {
                  deleteURL()
                  savePDF()
                }
                resetDrawerState()
              }
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
            size="sm"
            variant="primary-outlined"
          >
            {t("t.cancel")}
          </Button>
        </Drawer.Footer>
      </Drawer>
    </>
  )
}

export default BuildingSelectionCriteria

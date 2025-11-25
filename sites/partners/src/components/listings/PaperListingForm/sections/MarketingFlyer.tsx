import React, { useState } from "react"
import { useForm } from "react-hook-form"
import {
  t,
  Dropzone,
  Field,
  MinimalTable,
  TableThumbnail,
  FieldGroup,
  StandardTableData,
} from "@bloom-housing/ui-components"
import { Button, Card, Drawer, Grid, Heading } from "@bloom-housing/ui-seeds"
import { cloudinaryUrlFromId } from "@bloom-housing/shared-helpers"
import { cloudinaryFileUploader } from "../../../../lib/helpers"
import styles from "../ListingForm.module.scss"

type CloudinaryData = {
  id: string
  url: string
}

type FlyerAttachType = "upload" | "url" | null

const EMPTY_CLOUDINARY_DATA: CloudinaryData = { id: "", url: "" }
const EMPTY_FILE = { fileId: "", label: "" }

const getFlyerAttachType = (
  file?: { fileId: string; label: string },
  url?: string
): FlyerAttachType => {
  if (file?.fileId) return "upload"
  if (url) return "url"
  return null
}

const getFileNameFromId = (fileId?: string) => {
  return fileId ? fileId.split("/").slice(-1).join() : ""
}

const initializeCloudinaryData = (
  attachType: FlyerAttachType,
  file?: { fileId: string; label: string }
): CloudinaryData => {
  if (attachType === "upload" && file?.fileId) {
    return {
      id: file.fileId,
      url: cloudinaryUrlFromId(file.fileId),
    }
  }
  return EMPTY_CLOUDINARY_DATA
}

type MarketingFlyerFormValues = {
  marketingFlyerAttachType: FlyerAttachType
  marketingFlyerURL: string
  accessibleMarketingFlyerAttachType: FlyerAttachType
  accessibleMarketingFlyerURL: string
}

export type MarketingFlyerData = {
  marketingFlyer?: string
  listingsMarketingFlyerFile?: {
    fileId: string
    label: string
  }
  accessibleMarketingFlyer?: string
  listingsAccessibleMarketingFlyerFile?: {
    fileId: string
    label: string
  }
}

type MarketingFlyerProps = {
  currentData?: MarketingFlyerData
  onSubmit: (data: MarketingFlyerData) => void
}

const MarketingFlyer = ({ currentData, onSubmit }: MarketingFlyerProps) => {
  const marketingFlyerValue = currentData?.marketingFlyer
  const marketingFlyerFile = currentData?.listingsMarketingFlyerFile

  const accessibleMarketingFlyerValue = currentData?.accessibleMarketingFlyer
  const accessibleMarketingFlyerFile = currentData?.listingsAccessibleMarketingFlyerFile

  const [drawerState, setDrawerState] = useState(false)
  const [progressValue, setProgressValue] = useState(0)
  const [cloudinaryData, setCloudinaryData] = useState<CloudinaryData>(EMPTY_CLOUDINARY_DATA)

  const [accessibleProgressValue, setAccessibleProgressValue] = useState(0)
  const [accessibleCloudinaryData, setAccessibleCloudinaryData] =
    useState<CloudinaryData>(EMPTY_CLOUDINARY_DATA)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<MarketingFlyerFormValues>({
    defaultValues: {
      marketingFlyerAttachType: null,
      marketingFlyerURL: "",
      accessibleMarketingFlyerAttachType: null,
      accessibleMarketingFlyerURL: "",
    },
  })

  const marketingFlyerAttachType = watch("marketingFlyerAttachType")
  const accessibleMarketingFlyerAttachType = watch("accessibleMarketingFlyerAttachType")

  const resetDrawerState = () => {
    setProgressValue(0)
    setCloudinaryData(EMPTY_CLOUDINARY_DATA)
    setAccessibleProgressValue(0)
    setAccessibleCloudinaryData(EMPTY_CLOUDINARY_DATA)
    reset({
      marketingFlyerAttachType: null,
      marketingFlyerURL: "",
      accessibleMarketingFlyerAttachType: null,
      accessibleMarketingFlyerURL: "",
    })
    setDrawerState(false)
  }

  const handleDrawerOpen = () => {
    const marketingAttachType = getFlyerAttachType(marketingFlyerFile, marketingFlyerValue)
    const accessibleAttachType = getFlyerAttachType(
      accessibleMarketingFlyerFile,
      accessibleMarketingFlyerValue
    )

    reset({
      marketingFlyerAttachType: marketingAttachType,
      marketingFlyerURL: marketingAttachType === "url" ? marketingFlyerValue || "" : "",
      accessibleMarketingFlyerAttachType: accessibleAttachType,
      accessibleMarketingFlyerURL:
        accessibleAttachType === "url" ? accessibleMarketingFlyerValue || "" : "",
    })

    setCloudinaryData(initializeCloudinaryData(marketingAttachType, marketingFlyerFile))
    setAccessibleCloudinaryData(
      initializeCloudinaryData(accessibleAttachType, accessibleMarketingFlyerFile)
    )

    setProgressValue(0)
    setAccessibleProgressValue(0)
    setDrawerState(true)
  }

  const clearAllFlyers = () => {
    onSubmit({
      marketingFlyer: "",
      listingsMarketingFlyerFile: EMPTY_FILE,
      accessibleMarketingFlyer: "",
      listingsAccessibleMarketingFlyerFile: EMPTY_FILE,
    })
  }

  const flyerTableHeaders = {
    preview: "t.preview",
    fileName: "t.fileName",
    actions: "",
  }

  const urlTableHeaders = {
    fileName: "t.url",
    actions: "",
  }

  const marketingFlyerFileName = getFileNameFromId(marketingFlyerFile?.fileId)
  const accessibleFlyerFileName = getFileNameFromId(accessibleMarketingFlyerFile?.fileId)

  const flyerBlocks = [
    {
      key: "marketing",
      label: t("listings.marketingFlyer.title"),
      preview: marketingFlyerFile?.fileId ? (
        <TableThumbnail>
          <img src={cloudinaryUrlFromId(marketingFlyerFile.fileId)} alt={"Marketing flyer"} />
        </TableThumbnail>
      ) : null,
      text: marketingFlyerFileName || marketingFlyerValue || "",
    },
    {
      key: "accessible",
      label: t("listings.marketingFlyer.accessibleTitle"),
      preview: accessibleMarketingFlyerFile?.fileId ? (
        <TableThumbnail>
          <img
            src={cloudinaryUrlFromId(accessibleMarketingFlyerFile.fileId)}
            alt={"Accessible marketing flyer"}
          />
        </TableThumbnail>
      ) : null,
      text: accessibleFlyerFileName || accessibleMarketingFlyerValue || "",
    },
  ].filter((block) => block.preview || block.text)

  const hasAnyPreview = flyerBlocks.some((block) => Boolean(block.preview))
  const hasAnyUrl = flyerBlocks.some((block) => Boolean(block.text && !block.preview))

  const actionsContent = (
    <div className="flex gap-3">
      <Button
        type="button"
        className={"font-semibold darker-link"}
        onClick={handleDrawerOpen}
        variant="text"
        size="sm"
      >
        {t("t.edit")}
      </Button>
      <Button
        type="button"
        className={"font-semibold darker-alert"}
        onClick={clearAllFlyers}
        variant="text"
        size="sm"
      >
        {t("t.delete")}
      </Button>
    </div>
  )

  const flyerTableRows: StandardTableData = flyerBlocks.length
    ? [
        {
          preview: hasAnyPreview
            ? {
                content: (
                  <div className="flex flex-col gap-4">
                    {flyerBlocks.map(
                      ({ key, preview }) => preview && <div key={`${key}-preview`}>{preview}</div>
                    )}
                  </div>
                ),
              }
            : undefined,
          fileName: {
            content: (
              <div className="flex flex-col gap-4">
                {flyerBlocks.map(({ key, label, text }) => (
                  <div key={`${key}-details`} className="flex flex-col gap-1">
                    <div className="font-semibold">{label}</div>
                    {text && <div className="text-xs break-all">{text}</div>}
                  </div>
                ))}
              </div>
            ),
          },
          actions: {
            content: actionsContent,
          },
        },
      ]
    : []

  const pdfUploader = async (file: File) => {
    void (await cloudinaryFileUploader({ file, setCloudinaryData, setProgressValue }))
  }

  const accessiblePdfUploader = async (file: File) => {
    void (await cloudinaryFileUploader({
      file,
      setCloudinaryData: setAccessibleCloudinaryData,
      setProgressValue: setAccessibleProgressValue,
    }))
  }

  const buildPreviewTableRow = (data: CloudinaryData, onDelete: () => void): StandardTableData => {
    if (!data.url) return []

    return [
      {
        preview: {
          content: (
            <TableThumbnail>
              <img alt="PDF preview" src={data.url} />
            </TableThumbnail>
          ),
        },
        fileName: { content: getFileNameFromId(data.id) },
        actions: {
          content: (
            <Button
              type="button"
              className="font-semibold text-alert"
              onClick={onDelete}
              variant="text"
              size="sm"
            >
              {t("t.delete")}
            </Button>
          ),
        },
      },
    ]
  }

  const marketingPreviewTableRows = buildPreviewTableRow(cloudinaryData, () => {
    setCloudinaryData(EMPTY_CLOUDINARY_DATA)
    setProgressValue(0)
  })

  const accessiblePreviewTableRows = buildPreviewTableRow(accessibleCloudinaryData, () => {
    setAccessibleCloudinaryData(EMPTY_CLOUDINARY_DATA)
    setAccessibleProgressValue(0)
  })

  const previewHeaders = {
    preview: "t.preview",
    fileName: "t.fileName",
    actions: "",
  }

  const buildFlyerData = (
    attachType: FlyerAttachType,
    urlValue: string,
    newCloudinaryData: CloudinaryData,
    existingFile?: { fileId: string; label: string }
  ) => {
    if (attachType === "url") {
      return { url: urlValue || "", file: EMPTY_FILE }
    }

    if (attachType === "upload") {
      return {
        url: "",
        file: newCloudinaryData.id
          ? { fileId: newCloudinaryData.id, label: "cloudinaryPDF" }
          : existingFile || EMPTY_FILE,
      }
    }

    return { url: "", file: EMPTY_FILE }
  }

  const onFlyerSubmit = (formValues: MarketingFlyerFormValues) => {
    const marketing = buildFlyerData(
      formValues.marketingFlyerAttachType,
      formValues.marketingFlyerURL,
      cloudinaryData,
      marketingFlyerFile
    )

    const accessible = buildFlyerData(
      formValues.accessibleMarketingFlyerAttachType,
      formValues.accessibleMarketingFlyerURL,
      accessibleCloudinaryData,
      accessibleMarketingFlyerFile
    )

    onSubmit({
      marketingFlyer: marketing.url,
      listingsMarketingFlyerFile: marketing.file,
      accessibleMarketingFlyer: accessible.url,
      listingsAccessibleMarketingFlyerFile: accessible.file,
    })

    resetDrawerState()
  }

  const getTableHeaders = () => {
    if (hasAnyPreview) {
      return flyerTableHeaders
    }
    if (hasAnyUrl) {
      return urlTableHeaders
    }
    return flyerTableHeaders
  }

  return (
    <>
      <Heading size="lg" priority={3} className="spacer-header">
        {t("listings.marketingFlyer.title")}
      </Heading>
      <Grid spacing="lg" className="grid-inset-section">
        <Grid.Row>
          <Grid.Cell>
            {flyerTableRows.length > 0 ? (
              <MinimalTable
                headers={getTableHeaders()}
                data={flyerTableRows}
                id="marketing-flyer-table"
              />
            ) : (
              <Button
                id="addMarketingFlyerButton"
                type="button"
                variant="primary-outlined"
                size="sm"
                onClick={handleDrawerOpen}
              >
                {t("listings.marketingFlyer.add")}
              </Button>
            )}
          </Grid.Cell>
        </Grid.Row>
      </Grid>

      <Drawer
        isOpen={drawerState}
        onClose={resetDrawerState}
        ariaLabelledBy="marketing-flyer-drawer-header"
      >
        <Drawer.Header id="marketing-flyer-drawer-header">
          {t("listings.marketingFlyer.add")}
        </Drawer.Header>
        <form id="marketing-flyer-drawer-form" onSubmit={handleSubmit(onFlyerSubmit)}>
          <Drawer.Content>
            <Card className="mb-8">
              <Card.Section>
                <FieldGroup
                  name="marketingFlyerAttachType"
                  type="radio"
                  register={register}
                  fields={[
                    {
                      label: t("listings.marketingFlyer.uploadPdf"),
                      value: "upload",
                      id: "marketingFlyerAttachTypeUpload",
                    },
                    {
                      label: t("listings.marketingFlyer.webpageUrl"),
                      value: "url",
                      id: "marketingFlyerAttachTypeURL",
                    },
                  ]}
                  groupLabel={t("listings.marketingFlyer.shareQuestion")}
                  fieldLabelClassName={styles["label-option"]}
                />
                {marketingFlyerAttachType === "upload" && (
                  <>
                    {marketingPreviewTableRows.length === 0 && (
                      <Dropzone
                        id="marketing-flyer-upload"
                        label={t("t.uploadFile")}
                        helptext={t("listings.pdfHelperText")}
                        uploader={pdfUploader}
                        accept="application/pdf"
                        progress={progressValue}
                      />
                    )}
                    {marketingPreviewTableRows.length > 0 && (
                      <MinimalTable headers={previewHeaders} data={marketingPreviewTableRows} />
                    )}
                  </>
                )}
                {marketingFlyerAttachType === "url" && (
                  <Field
                    type="url"
                    placeholder="https://"
                    label={t("listings.marketingFlyer.informationalWebpageUrl")}
                    name="marketingFlyerURL"
                    id="marketingFlyerURL"
                    register={register}
                    error={Boolean(errors?.marketingFlyerURL)}
                    errorMessage={
                      errors?.marketingFlyerURL?.type === "https"
                        ? t("errors.urlHttpsError")
                        : t("errors.urlError")
                    }
                  />
                )}
              </Card.Section>
            </Card>

            <Card>
              <Card.Section>
                <FieldGroup
                  name="accessibleMarketingFlyerAttachType"
                  type="radio"
                  register={register}
                  fields={[
                    {
                      label: t("listings.marketingFlyer.uploadAccessiblePdf"),
                      value: "upload",
                      id: "accessibleMarketingFlyerAttachTypeUpload",
                    },
                    {
                      label: t("listings.marketingFlyer.accessibleWebpageUrl"),
                      value: "url",
                      id: "accessibleMarketingFlyerAttachTypeURL",
                    },
                  ]}
                  groupLabel={t("listings.marketingFlyer.shareAccessibleQuestion")}
                  fieldLabelClassName={styles["label-option"]}
                />
                {accessibleMarketingFlyerAttachType === "upload" && (
                  <>
                    {accessiblePreviewTableRows.length === 0 && (
                      <Dropzone
                        id="accessible-marketing-flyer-upload"
                        label={t("t.uploadFile")}
                        helptext={t("listings.pdfHelperText")}
                        uploader={accessiblePdfUploader}
                        accept="application/pdf"
                        progress={accessibleProgressValue}
                      />
                    )}
                    {accessiblePreviewTableRows.length > 0 && (
                      <MinimalTable headers={previewHeaders} data={accessiblePreviewTableRows} />
                    )}
                  </>
                )}
                {accessibleMarketingFlyerAttachType === "url" && (
                  <Field
                    type="url"
                    placeholder="https://"
                    label={t("listings.marketingFlyer.informationalWebpageUrl")}
                    name="accessibleMarketingFlyerURL"
                    id="accessibleMarketingFlyerURL"
                    register={register}
                    error={Boolean(errors?.accessibleMarketingFlyerURL)}
                    errorMessage={
                      errors?.accessibleMarketingFlyerURL?.type === "https"
                        ? t("errors.urlHttpsError")
                        : t("errors.urlError")
                    }
                  />
                )}
              </Card.Section>
            </Card>
          </Drawer.Content>
          <Drawer.Footer>
            <Button id="saveMarketingFlyerButton" key={0} type="submit" variant="primary" size="sm">
              Save
            </Button>
            <Button
              key={1}
              type="button"
              onClick={resetDrawerState}
              size="sm"
              variant="primary-outlined"
            >
              {t("t.cancel")}
            </Button>
          </Drawer.Footer>
        </form>
      </Drawer>
    </>
  )
}

export default MarketingFlyer

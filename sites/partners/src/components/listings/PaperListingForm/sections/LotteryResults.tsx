import React, { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import {
  t,
  AppearanceStyleType,
  Button,
  Drawer,
  Dropzone,
  MinimalTable,
  TableThumbnail,
  StandardTableData,
  AppearanceSizeType,
  Icon,
} from "@bloom-housing/ui-components"
import {
  ListingEvent,
  ListingEventCreate,
  ListingEventType,
} from "@bloom-housing/backend-core/types"
import { uploadAssetAndSetData } from "../../../../lib/assets"
import { getPdfUrlFromAsset } from "@bloom-housing/shared-helpers"
import { Card } from "@bloom-housing/ui-seeds"

interface LotteryResultsProps {
  submitCallback: (data: { events: ListingEvent[] }) => void
  drawerState: boolean
  showDrawer: (toggle: boolean) => void
}

const LotteryResults = (props: LotteryResultsProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { watch } = formMethods

  const { submitCallback, drawerState, showDrawer } = props
  const [progressValue, setProgressValue] = useState(0)
  const [cloudinaryData, setCloudinaryData] = useState({
    id: "",
    url: "",
  })

  const listingEvents = watch("events")
  const uploadedPDF = listingEvents.find(
    (event: ListingEvent) => event.type === ListingEventType.lotteryResults
  )

  useEffect(() => {
    if (uploadedPDF) {
      setCloudinaryData({
        url: uploadedPDF.file ? getPdfUrlFromAsset(uploadedPDF.file) : "",
        id: uploadedPDF.id,
      })
      // Don't allow a new one to be uploaded if one already exists so setting progress to 100%
      setProgressValue(100)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const title = uploadedPDF
    ? "listings.sections.lotteryResultsEdit"
    : "listings.sections.lotteryResultsAdd"

  const resetDrawerState = () => {
    showDrawer(false)
  }

  const savePDF = () => {
    const updatedEvents = [...listingEvents]

    const lotteryIndex = updatedEvents.findIndex(
      (event) => event.type === ListingEventType.lotteryResults
    )
    if (lotteryIndex > -1) {
      updatedEvents.splice(lotteryIndex, 1)
    }

    if (cloudinaryData.id) {
      const newEvent: ListingEventCreate = {
        type: ListingEventType.lotteryResults,
        startTime: new Date(),
        file: {
          fileId: cloudinaryData.id,
          label: "cloudinaryPDF",
        },
      }
      updatedEvents.push(newEvent as ListingEvent)
    }

    submitCallback({ events: updatedEvents })
  }

  const resultsTableHeaders = {
    preview: "t.preview",
    fileName: "t.fileName",
    actions: "",
  }

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
            {/*<img alt="PDF preview" src={cloudinaryData.url} />*/}
            <Icon size="md-large" symbol="document" />
          </TableThumbnail>
        ),
      },
      fileName: { content: cloudinaryData.id.split("/").slice(-1).join() },
      actions: {
        content: (
          <Button
            type="button"
            className="font-semibold uppercase text-alert my-0"
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
      },
    })
  }

  /*
    Pass the file for the dropzone callback along to the uploader
  */
  const pdfUploader = async (file: File) => {
    await uploadAssetAndSetData(file, "lottery", setProgressValue, setCloudinaryData)
  }

  return (
    <Drawer
      open={drawerState}
      title={t(title)}
      onClose={() => resetDrawerState()}
      ariaDescription="Form to upload lottery results"
      actions={[
        <Button
          key={0}
          onClick={() => {
            savePDF()
            resetDrawerState()
          }}
          styleType={AppearanceStyleType.primary}
          size={AppearanceSizeType.small}
        >
          {progressValue === 100 ? t("t.post") : t("t.save")}
        </Button>,
        <Button
          key={1}
          onClick={() => {
            resetDrawerState()
          }}
          size={AppearanceSizeType.small}
        >
          {t("t.cancel")}
        </Button>,
      ]}
    >
      <Card spacing="lg" className="spacer-section">
        <Card.Section>
          <Dropzone
            id="lottery-results-upload"
            label={t("listings.sections.lotteryResultsHelperText")}
            helptext={t("listings.pdfHelperText")}
            uploader={pdfUploader}
            accept="application/pdf"
            progress={progressValue}
          />
          {cloudinaryData.url !== "" && (
            <MinimalTable headers={resultsTableHeaders} data={previewTableRows}></MinimalTable>
          )}
        </Card.Section>
      </Card>
    </Drawer>
  )
}

export default LotteryResults

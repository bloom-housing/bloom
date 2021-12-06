import React, { useState } from "react"
import { useFormContext } from "react-hook-form"
import {
  t,
  AppearanceBorderType,
  AppearanceStyleType,
  Button,
  Drawer,
  Dropzone,
  MinimalTable,
} from "@bloom-housing/ui-components"
import {
  ListingEvent,
  ListingEventCreate,
  ListingEventType,
} from "@bloom-housing/backend-core/types"
import { cloudinaryFileUploader } from "../../../../lib/helpers"

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

    const newEvent: ListingEventCreate = {
      type: ListingEventType.lotteryResults,
      startTime: new Date(),
      file: {
        fileId: cloudinaryData.id,
        label: "cloudinaryPDF",
      },
    }

    updatedEvents.push(newEvent as ListingEvent)
    submitCallback({ events: updatedEvents })
  }

  const resultsTableHeaders = {
    fileName: "t.fileName",
    actions: "",
  }

  /*
    Show a preview of the uploaded file within the upload drawer
  */
  const previewTableRows = []
  if (cloudinaryData.url !== "") {
    previewTableRows.push({
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
    Pass the file for the dropzone callback along to the uploader
  */
  const pdfUploader = async (file: File) => {
    void (await cloudinaryFileUploader({ file, setCloudinaryData, setProgressValue }))
  }

  return (
    <Drawer
      open={drawerState}
      title="Add Results"
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
        >
          {t("t.post")}
        </Button>,
        <Button
          key={1}
          onClick={() => {
            resetDrawerState()
          }}
          styleType={AppearanceStyleType.secondary}
          border={AppearanceBorderType.borderless}
        >
          {t("t.cancel")}
        </Button>,
      ]}
    >
      <section className="border rounded-md p-8 bg-white">
        <Dropzone
          id="lottery-results-upload"
          label="Upload Results"
          helptext="Select PDF file"
          uploader={pdfUploader}
          accept="application/pdf"
          progress={progressValue}
        />
        {cloudinaryData.url !== "" && (
          <MinimalTable headers={resultsTableHeaders} data={previewTableRows}></MinimalTable>
        )}
      </section>
    </Drawer>
  )
}

export default LotteryResults

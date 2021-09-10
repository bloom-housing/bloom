import React, { useState } from "react"
import { useFormContext } from "react-hook-form"
import {
  cloudinaryUrlFromId,
  t,
  AppearanceStyleType,
  AppearanceBorderType,
  Button,
  Dropzone,
  Drawer,
  GridSection,
  GridCell,
  MinimalTable,
  TableThumbnail,
} from "@bloom-housing/ui-components"
import { cloudinaryFileUploader } from "../../../../lib/helpers"

const ListingPhoto = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, watch } = formMethods

  const listingFormPhoto = watch("image")

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

  const savePhoto = () => {
    setValue("image", { fileId: cloudinaryData.id, label: "cloudinaryBuilding" })
  }
  const deletePhoto = () => {
    setValue("image", { fileId: "", label: "" })
  }

  const photoTableHeaders = {
    preview: "t.preview",
    fileName: "t.fileName",
    actions: "",
  }

  /*
    Show a preview of the uploaded file within the photo drawer
  */
  const previewTableRows = []
  if (cloudinaryData.url != "") {
    previewTableRows.push({
      preview: (
        <TableThumbnail>
          <img src={cloudinaryData.url} />
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
    Show the selected photo in the listing form if its present
  */
  const listingPhotoTableRows = []
  if (listingFormPhoto?.fileId && listingFormPhoto.fileId != "") {
    const listingPhotoUrl = listingFormPhoto.fileId.match(/https?:\/\//)
      ? listingFormPhoto.fileId
      : cloudinaryUrlFromId(listingFormPhoto.fileId)

    listingPhotoTableRows.push({
      preview: (
        <TableThumbnail>
          <img src={listingPhotoUrl} />
        </TableThumbnail>
      ),
      fileName: listingFormPhoto.fileId.split("/").slice(-1).join(),
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
              deletePhoto()
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
  const photoUploader = async (file: File) => {
    void (await cloudinaryFileUploader({ file, setCloudinaryData, setProgressValue }))
  }

  return (
    <>
      <input type="hidden" {...register("image.fileId")} />
      <input type="hidden" {...register("image.label")} />
      <GridSection
        grid={false}
        separator
        title={t("listings.sections.photoTitle")}
        description={t("listings.sections.photoSubtitle")}
      >
        <GridSection columns={1} tinted inset>
          <GridCell>
            {listingFormPhoto?.fileId && listingFormPhoto.fileId != "" ? (
              <MinimalTable headers={photoTableHeaders} data={listingPhotoTableRows}></MinimalTable>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  setDrawerState(true)
                }}
              >
                {t("listings.addPhoto")}
              </Button>
            )}
          </GridCell>
        </GridSection>
      </GridSection>

      <Drawer
        open={drawerState}
        title="Add Photo"
        onClose={() => resetDrawerState()}
        ariaDescription="Form with photo upload dropzone"
        actions={[
          <Button
            key={0}
            onClick={() => {
              savePhoto()
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
          <Dropzone
            id="listing-photo-upload"
            label="Upload File"
            helptext="Select JPEG or PNG files"
            uploader={photoUploader}
            accept="image/*"
            progress={progressValue}
          />
          {cloudinaryData.url !== "" && (
            <MinimalTable headers={photoTableHeaders} data={previewTableRows}></MinimalTable>
          )}
        </section>
      </Drawer>
    </>
  )
}

export default ListingPhoto

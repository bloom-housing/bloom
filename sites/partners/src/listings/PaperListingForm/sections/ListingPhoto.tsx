import React, { useState } from "react"
import { useFormContext } from "react-hook-form"
import {
  cloudinaryUrlFromId,
  t,
  AppearanceStyleType,
  AppearanceBorderType,
  Button,
  Dropzone,
  CloudinaryUpload,
  Drawer,
  GridSection,
  GridCell,
  MinimalTable,
  TableThumbnail,
} from "@bloom-housing/ui-components"

let newCloudinaryId = ""

const ListingPhoto = () => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, watch } = formMethods

  const cloudName = process.env.cloudinaryCloudName
  const uploadPreset = process.env.cloudinarySignedPreset

  const listingFormPhoto = watch("image")

  const [drawerState, setDrawerState] = useState(false)
  const [progressValue, setProgressValue] = React.useState(0)
  const [cloudinaryImage, setCloudinaryImage] = React.useState("")
  const resetDrawerState = () => {
    newCloudinaryId = ""
    setProgressValue(0)
    setCloudinaryImage("")
    setDrawerState(false)
  }

  const savePhoto = () => {
    setValue("image", { fileId: newCloudinaryId, label: "cloudinaryBuilding" })
  }
  const deletePhoto = () => {
    setValue("image", { fileId: "", label: "" })
  }

  const photoTableHeaders = {
    preview: "t.preview",
    fileName: "t.fileName",
    actions: "",
  }

  const previewTableRows = []
  if (cloudinaryImage != "") {
    previewTableRows.push({
      preview: (
        <TableThumbnail>
          <img src={cloudinaryImage} />
        </TableThumbnail>
      ),
      fileName: newCloudinaryId.split("/").slice(-1).join(),
      actions: (
        <Button
          type="button"
          className="font-semibold uppercase text-red-700"
          onClick={() => {
            newCloudinaryId = ""
            setCloudinaryImage("")
            setProgressValue(0)
          }}
          unstyled
        >
          {t("t.delete")}
        </Button>
      ),
    })
  }

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
              console.info("DELETE")
              newCloudinaryId = ""
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

  const exampleUploader = (file: File) => {
    void CloudinaryUpload({
      file: file,
      onUploadProgress: (progress) => {
        setProgressValue(progress)
      },
      cloudName,
      uploadPreset,
    }).then((response) => {
      newCloudinaryId = response.data.public_id
      setProgressValue(100)
      setCloudinaryImage(cloudinaryUrlFromId(response.data.public_id))
    })
  }

  return (
    <>
      <input type="hidden" {...register("image.fileId")} />
      <input type="hidden" {...register("image.label")} />
      <GridSection grid={false} separator>
        <span className="form-section__title">{t("listings.sections.photoTitle")}</span>
        <span className="form-section__description">{t("listings.sections.photoSubtitle")}</span>
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
            uploader={exampleUploader}
            accept="image/*"
            progress={progressValue}
          />
          {cloudinaryImage != "" && (
            <MinimalTable headers={photoTableHeaders} data={previewTableRows}></MinimalTable>
          )}
        </section>
      </Drawer>
    </>
  )
}

export default ListingPhoto

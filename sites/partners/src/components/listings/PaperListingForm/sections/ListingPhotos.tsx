import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import {
  t,
  Dropzone,
  MinimalTable,
  TableThumbnail,
  StandardTableData,
  StandardTableCell,
  Textarea,
} from "@bloom-housing/ui-components"
import { Button, Card, Drawer, Grid, Heading } from "@bloom-housing/ui-seeds"
import { getUrlForListingImage, CLOUDINARY_BUILDING_LABEL } from "@bloom-housing/shared-helpers"
import {
  Asset,
  ListingImage,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  cloudinaryFileUploader,
  fieldHasError,
  fieldIsRequired,
  getLabel,
} from "../../../../lib/helpers"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import styles from "../ListingForm.module.scss"

interface ListingPhotosProps {
  enableListingImageAltText: boolean
  requiredFields: string[]
  jurisdiction: Jurisdiction
}

interface ListingPhotoEditorProps {
  isOpen: boolean
  onClose: () => void
  image?: ListingImage
  onSave: (description: string) => void
  requiredFields: string[]
}
const ListingPhotoEditor = ({
  isOpen,
  onClose,
  image,
  onSave,
  requiredFields,
}: ListingPhotoEditorProps) => {
  const [description, setDescription] = useState("")
  const [descriptionError, setDescriptionError] = useState<string | null>(null)

  const descriptionIsRequired = fieldIsRequired("listingImages.description", requiredFields)

  useEffect(() => {
    if (isOpen && image) {
      setDescription(image.description || "")
      setDescriptionError(null)
    }
  }, [isOpen, image])

  if (!image) return null

  const handleSave = () => {
    const trimmed = description?.trim() ?? ""
    if (descriptionIsRequired && trimmed.length === 0) {
      setDescriptionError(t("errors.requiredFieldError"))
      return
    }
    setDescriptionError(null)
    onSave(trimmed)
  }

  const handleClose = () => {
    setDescription(image?.description || "")
    setDescriptionError(null)
    onClose()
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabelledBy="listing-photo-edit-drawer-header"
      nested={true}
    >
      <Drawer.Header id="listing-photo-edit-drawer-header">
        {t("listings.sections.photo.addImageDescription")}
      </Drawer.Header>
      <Drawer.Content>
        <Card>
          <Card.Header>
            <Heading priority={2} size="xl">
              {t("listings.sections.photo.imageDescriptionForListingPhoto")}
            </Heading>
          </Card.Header>
          <Card.Section>
            <div>
              <Textarea
                label={getLabel(
                  "listingImages.description",
                  requiredFields,
                  t("listings.sections.photo.imageDescriptionAltText")
                )}
                placeholder={""}
                name={"imageDescription"}
                id={"image-description"}
                fullWidth={true}
                rows={2}
                inputProps={{
                  onChange: (e) => {
                    setDescription(e.target.value)
                    descriptionError && setDescriptionError(null)
                  },
                  "aria-required": descriptionIsRequired,
                }}
                errorMessage={descriptionError ?? undefined}
                defaultValue={image.description || ""}
                note={t("listings.sections.photo.altTextHelper")}
              />
            </div>
            <div className="seeds-m-bs-content">
              <span className="font-semibold text-gray-800 block seeds-m-be-header">
                {t("listings.listingPhoto")}
              </span>
              <div className="border-2 border-gray-600 border-dashed seeds-p-content inline-block">
                <img
                  src={getUrlForListingImage(image.assets)}
                  alt={image.description || ""}
                  className={styles["photo-preview"]}
                />
              </div>
            </div>
          </Card.Section>
        </Card>
      </Drawer.Content>
      <Drawer.Footer>
        <Button
          variant="primary"
          type="button"
          size="sm"
          onClick={handleSave}
          id="save-alt-text-button"
        >
          {t("t.save")}
        </Button>
      </Drawer.Footer>
    </Drawer>
  )
}

const ListingPhotos = (props: ListingPhotosProps) => {
  const formMethods = useFormContext()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, errors, clearErrors } = formMethods

  const { fields, append, remove } = useFieldArray({
    name: "listingImages",
  })
  const listingFormPhotos: ListingImage[] = watch("listingImages").sort((imageA, imageB) => {
    return imageA.ordinal - imageB.ordinal
  })

  const saveImageFields = (images: ListingImage[]) => {
    remove(fields.map((item, index) => index))
    images.forEach((item, index) => {
      append({
        ordinal: index,
        assets: item.assets,
        description: item.description,
      })
    })
  }

  /*
   Set state for the drawer, upload progress, images in the drawer, and more
   */
  const [drawerState, setDrawerState] = useState(false)
  const [editingPhotoIndex, setEditingPhotoIndex] = useState<number | null>(null)
  const [pendingNewImage, setPendingNewImage] = useState<ListingImage | null>(null)

  const [progressValue, setProgressValue] = useState(0)
  const [latestUpload, setLatestUpload] = useState({
    id: "",
    url: "",
  })
  const [drawerImages, setDrawerImages] = useState<ListingImage[]>([])

  const resetDrawerState = () => {
    setDrawerState(false)
    setDrawerImages([])
    setEditingPhotoIndex(null)
    setPendingNewImage(null)
  }

  const savePhoto = useCallback(() => {
    const newImage: ListingImage = {
      ordinal: drawerImages.length,
      assets: { fileId: latestUpload.id, label: CLOUDINARY_BUILDING_LABEL } as Asset,
      description: "",
    }
    if (props.enableListingImageAltText) {
      setPendingNewImage(newImage)
      setEditingPhotoIndex(null)
    } else {
      const newImages = [...drawerImages, newImage]
      setDrawerImages(newImages)
    }
    setLatestUpload({ id: "", url: "" })
    setProgressValue(0)
  }, [drawerImages, latestUpload, props.enableListingImageAltText])

  useEffect(() => {
    if (latestUpload.id != "") {
      savePhoto()
    }
  }, [latestUpload, savePhoto])

  /*
   Show list of images in the main listing form
   */
  const photoTableHeaders = {
    preview: "t.preview",
    ...(props.enableListingImageAltText
      ? { description: "listings.sections.photo.imageDescription" }
      : {}),
    actions: "",
  }

  const listingPhotoTableRows: StandardTableData = []
  listingFormPhotos.forEach((image, index) => {
    listingPhotoTableRows.push({
      preview: {
        content: (
          <TableThumbnail>
            <img
              src={getUrlForListingImage(image.assets)}
              alt={image.description || ""}
              id={`listing-detail-image-${index}`}
            />
          </TableThumbnail>
        ),
      },
      ...(props.enableListingImageAltText
        ? {
            description: {
              content: image.description || "",
            },
          }
        : {}),
      ...(!props.enableListingImageAltText
        ? {
            actions: {
              content: (
                <Button
                  type="button"
                  className={"darker-alert"}
                  onClick={() => {
                    saveImageFields(fields.filter((item, i2) => i2 != index) as ListingImage[])
                  }}
                  variant="text"
                  size="sm"
                >
                  {t("t.delete")}
                </Button>
              ),
            },
          }
        : {}),
    })
  })

  /*
   Show a re-orderable list of uploaded images within the drawer
   */
  const drawerTableHeaders = {
    ordinal: "t.order",
    preview: "t.preview",
    ...(props.enableListingImageAltText
      ? { description: "listings.sections.photo.imageDescription" }
      : {}),
    actions: "",
  }

  const drawerTableRows: StandardTableData = useMemo(() => {
    return drawerImages.map((item, index) => {
      const image = item.assets
      const ordinalContent = (
        <span>
          {item.ordinal + 1}
          {index === 0 && <span className="font-normal"> ({t("t.primary")})</span>}
        </span>
      )

      return {
        ordinal: {
          content: ordinalContent,
        },
        preview: {
          content: (
            <TableThumbnail>
              <img
                src={getUrlForListingImage(image)}
                alt={item.description || ""}
                id={`listing-drawer-image-${index}`}
              />
            </TableThumbnail>
          ),
        },
        fileName: { content: image.fileId.split("/").slice(-1).join() },
        ...(props.enableListingImageAltText
          ? {
              description: {
                content: item.description || "",
              },
            }
          : {}),
        actions: {
          content: (
            <div className="flex gap-2">
              {props.enableListingImageAltText && (
                <Button
                  variant="text"
                  className="ml-0"
                  size="sm"
                  onClick={() => {
                    setEditingPhotoIndex(index)
                  }}
                >
                  {t("t.edit")}
                </Button>
              )}
              <Button
                type="button"
                className="text-alert"
                onClick={() => {
                  const filteredImages = drawerImages.filter((item, i2) => i2 != index)
                  filteredImages.forEach((item, i2) => {
                    item.ordinal = i2
                  })
                  setDrawerImages(filteredImages)
                }}
                variant="text"
                size="sm"
              >
                {t("t.delete")}
              </Button>
            </div>
          ),
        },
      }
    })
  }, [drawerImages, props.enableListingImageAltText])

  /*
   Pass the file for the dropzone callback along to the uploader
   */
  const photoUploader = async (file: File) => {
    if (process.env.cloudinaryCloudName) {
      void (await cloudinaryFileUploader({
        file,
        setCloudinaryData: setLatestUpload,
        setProgressValue,
      }))
    } else {
      // TODO: Upload to AWS
      alert("Cloudinary environment variables not set, must configure AWS")
    }
  }

  const saveEditedPhoto = (newDescription: string) => {
    if (pendingNewImage) {
      setDrawerImages([
        ...drawerImages,
        { ...pendingNewImage, description: newDescription, ordinal: drawerImages.length },
      ])
      setPendingNewImage(null)
      setEditingPhotoIndex(null)
      return
    }
    if (editingPhotoIndex !== null) {
      const updatedImages = [...drawerImages]
      updatedImages[editingPhotoIndex] = {
        ...updatedImages[editingPhotoIndex],
        description: newDescription,
      }
      setDrawerImages(updatedImages)
      setEditingPhotoIndex(null)
    }
  }

  const closePhotoEditor = () => {
    if (pendingNewImage) setPendingNewImage(null)
    setEditingPhotoIndex(null)
  }

  const customImagesRules =
    props.requiredFields.includes("listingImages") &&
    props?.jurisdiction?.minimumListingPublishImagesRequired

  /*
   Register the field array, display the main form table, and set up the drawer
   */
  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      {fields.map((item, index) => (
        <span key={item.id}>
          <input
            type="hidden"
            name={`listingImages[${index}].image.fileId`}
            ref={register()}
            defaultValue={item?.assets?.fileId || item.assets?.fileId}
          />
          <input
            type="hidden"
            name={`listingImages[${index}].description`}
            ref={register()}
            defaultValue={item?.description ?? ""}
          />
        </span>
      ))}
      <SectionWithGrid
        heading={t("listings.sections.photoTitle")}
        subheading={t(
          customImagesRules
            ? "listings.sections.photosSubtitle"
            : "listings.sections.photoSubtitle",
          { smart_count: props?.jurisdiction?.minimumListingPublishImagesRequired }
        )}
        className={"gap-0"}
      >
        <div
          className={`field-label ${styles["custom-label"]} ${
            fieldHasError(errors?.listingImages) ? styles["label-error"] : ""
          }`}
        >
          {getLabel("listingImages", props.requiredFields, "Photos")}
        </div>

        <Grid.Row columns={1} className="grid-inset-section">
          <Grid.Cell>
            {listingFormPhotos.length > 0 && (
              <div className="mb-5" data-testid="photos-table">
                <MinimalTable headers={photoTableHeaders} data={listingPhotoTableRows} />
              </div>
            )}

            <Button
              type="button"
              variant={fieldHasError(errors?.listingImages) ? "alert" : "primary-outlined"}
              size="sm"
              onClick={() => {
                setDrawerState(true)
                setDrawerImages([...listingFormPhotos])
                clearErrors("listingImages")
              }}
              id="add-photos-button"
            >
              {t(listingFormPhotos.length > 0 ? "listings.editPhotos" : "listings.addPhotos")}
            </Button>
          </Grid.Cell>
        </Grid.Row>
        {fieldHasError(errors?.listingImages) && (
          <span className={"text-sm text-alert seeds-m-bs-text"} id="photos-error">
            {customImagesRules
              ? t("listings.sections.photoError", {
                  smart_count: props.jurisdiction?.minimumListingPublishImagesRequired || 1,
                })
              : t("errors.requiredFieldError")}
          </span>
        )}
      </SectionWithGrid>

      {/* Image management and upload drawer */}
      <Drawer
        isOpen={drawerState}
        onClose={() => resetDrawerState()}
        ariaLabelledBy="listing-photos-drawer-header"
      >
        <Drawer.Header id="listing-photos-drawer-header">
          {t(listingFormPhotos.length > 0 ? "listings.editPhotos" : "listings.addPhotos")}
        </Drawer.Header>
        <Drawer.Content>
          <Card>
            <Card.Header>
              <Heading priority={2} size="xl">
                {t("listings.listingPhoto")}
              </Heading>
            </Card.Header>
            <Card.Section>
              {drawerImages.length > 0 && (
                <div className="mb-10" data-testid="drawer-photos-table">
                  <span className={"text-gray-800 block seeds-m-be-text"}>{t("t.photos")}</span>
                  {/* hide order column (2nd column) from draggable prop to override it with new one with "1 (primary)" */}
                  <MinimalTable
                    draggable={true}
                    flushLeft={true}
                    className={styles["hide-order-column"]}
                    setData={(newData) => {
                      setDrawerImages(
                        newData.map((item: Record<string, StandardTableCell>, index) => {
                          const foundImage = drawerImages.find(
                            (field) =>
                              field.assets.fileId.split("/").slice(-1).join() ==
                              item.fileName.content
                          )
                          return { ...foundImage, ordinal: index }
                        })
                      )
                    }}
                    headers={drawerTableHeaders}
                    data={drawerTableRows}
                  ></MinimalTable>
                </div>
              )}
              {drawerImages.length < 10 ? (
                <Dropzone
                  id="listing-photo-upload"
                  label={t("t.uploadFiles")}
                  helptext={`${t("listings.sections.photo.helperTextBase")} ${
                    customImagesRules
                      ? t("listings.sections.photo.helperTextLimits", {
                          smart_count:
                            props?.jurisdiction?.minimumListingPublishImagesRequired || 1,
                        })
                      : t("listings.sections.photo.helperTextLimit")
                  }`}
                  uploader={photoUploader}
                  accept="image/*"
                  progress={progressValue}
                />
              ) : (
                <p className="field-note text-gray-750">
                  {t("listings.sections.photo.maximumUpload")}
                </p>
              )}
            </Card.Section>
          </Card>
        </Drawer.Content>
        <Drawer.Footer>
          <Button
            variant="primary"
            type="button"
            size="sm"
            onClick={() => {
              saveImageFields(drawerImages)
              resetDrawerState()
            }}
            id={drawerImages.length > 0 ? "listing-photo-uploaded" : "listing-photo-empty"}
          >
            {t("t.save")}
          </Button>
        </Drawer.Footer>
      </Drawer>

      {/* Nested drawer for editing alt text */}
      <ListingPhotoEditor
        isOpen={!!pendingNewImage || editingPhotoIndex !== null}
        onClose={closePhotoEditor}
        image={pendingNewImage ?? drawerImages?.[editingPhotoIndex]}
        onSave={saveEditedPhoto}
        requiredFields={props.requiredFields}
      />
    </>
  )
}

export default ListingPhotos

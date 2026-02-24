import React, { useContext, useState, useEffect, useMemo, useCallback } from "react"
import { t, MinimalTable, Field, StandardTableData } from "@bloom-housing/ui-components"
import {
  MultiselectOption,
  MultiselectQuestion,
  MultiselectQuestionsApplicationSectionEnum,
  MultiselectQuestionsStatusEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Button, Card, Drawer, Grid, Tag, Icon } from "@bloom-housing/ui-seeds"
import { useFormContext } from "react-hook-form"
import InformationCircleIcon from "@heroicons/react/24/solid/InformationCircleIcon"
import LinkComponent from "../../../../components/core/LinkComponent"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import styles from "../ListingForm.module.scss"
import { useJurisdictionalMultiselectQuestionList } from "../../../../lib/hooks"
import { AuthContext } from "@bloom-housing/shared-helpers"

type SelectAndOrderProps = {
  enableV2MSQ: boolean
  formKey: string
  addText: string
  applicationSection: MultiselectQuestionsApplicationSectionEnum
  drawerButtonText: string
  drawerButtonId: string
  drawerSubtitle?: string
  drawerTitle: string
  editText: string
  jurisdiction: string
  listingData: MultiselectQuestion[]
  setListingData: (listingData: MultiselectQuestion[]) => void
  subNote?: string
  subtitle: string
  title: string
}

const SelectAndOrder = ({
  enableV2MSQ,
  addText,
  applicationSection,
  drawerButtonText,
  drawerButtonId,
  drawerSubtitle,
  drawerTitle,
  editText,
  formKey,
  jurisdiction,
  listingData,
  setListingData,
  subNote,
  subtitle,
  title,
}: SelectAndOrderProps) => {
  const [tableDrawer, setTableDrawer] = useState<boolean | null>(null)
  const [selectDrawer, setSelectDrawer] = useState<boolean | null>(null)
  const [draftListingData, setDraftListingData] = useState<MultiselectQuestion[]>(listingData)
  const [dragOrder, setDragOrder] = useState([])
  const [openPreviews, setOpenPreviews] = useState<number[]>([])

  const formMethods = useFormContext()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, getValues, setValue } = formMethods

  const deleteItem = useCallback(
    (item: MultiselectQuestion, setRootData?: boolean) => {
      const editedListingData = [...draftListingData]
      editedListingData.splice(editedListingData.indexOf(item), 1)
      if (setRootData) {
        setListingData(editedListingData)
      }
      setDraftListingData(editedListingData)
      if (jurisdiction) {
        fetchedData.map((item) => {
          setValue(
            `${formKey}.${item.id}`,
            editedListingData.some((existingItem) => existingItem.text === item.text)
          )
        })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [draftListingData]
  )

  const additionalFieldsTag = () => (
    <Tag variant="primary">
      <Icon>
        <InformationCircleIcon />
      </Icon>{" "}
      {t("listings.providesAdditionalFields")}
    </Tag>
  )

  const draggableTableData: StandardTableData = useMemo(
    () =>
      draftListingData.map((item) => ({
        name: { content: item.name || item.text },
        additionalFields: {
          content: (
            <>
              {item?.multiselectOptions?.some(
                (item) => item.shouldCollectAddress || item.collectAddress
              ) && additionalFieldsTag()}
            </>
          ),
        },
        action: {
          content: (
            <div className="flex">
              <Button
                type="button"
                className="font-semibold text-alert"
                onClick={() => {
                  deleteItem(item, false)
                }}
                variant="text"
                size="sm"
              >
                {t("t.delete")}
              </Button>
            </div>
          ),
        },
      })),
    [draftListingData, deleteItem]
  )

  const formTableData: StandardTableData = useMemo(
    () =>
      listingData.map((item, index) => ({
        order: { content: index + 1 },
        name: { content: item.name || item.text },
        additionalFields: {
          content: (
            <>
              {item?.multiselectOptions?.some(
                (item) => item.shouldCollectAddress || item.collectAddress
              ) && additionalFieldsTag()}
            </>
          ),
        },
        action: {
          content: (
            <div className="flex">
              <Button
                type="button"
                className={"font-semibold darker-alert"}
                onClick={() => {
                  deleteItem(item, true)
                }}
                variant="text"
                size="sm"
              >
                {t("t.delete")}
              </Button>
            </div>
          ),
        },
      })),
    [listingData, deleteItem]
  )

  // Update local state with dragged state
  useEffect(() => {
    if (draftListingData.length > 0 && dragOrder.length > 0) {
      const newDragOrder = []
      dragOrder.forEach((item) => {
        newDragOrder.push(
          draftListingData.filter(
            (draftItem) => (draftItem.name || draftItem.text) === item.name.content
          )[0]
        )
      })
      setDraftListingData(newDragOrder)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragOrder])

  const { data } = useJurisdictionalMultiselectQuestionList(
    jurisdiction,
    applicationSection as unknown as MultiselectQuestionsApplicationSectionEnum,
    enableV2MSQ
      ? [
          MultiselectQuestionsStatusEnum.visible,
          MultiselectQuestionsStatusEnum.active,
          MultiselectQuestionsStatusEnum.toRetire,
          MultiselectQuestionsStatusEnum.retired,
        ]
      : undefined
  )
  const fetchedData = data?.items ?? []

  const formTableHeaders = {
    order: "t.order",
    name: "t.name",
    ...(formKey === "preference" && {
      additionalFields: "settings.preferenceAdditionalFields",
    }),
    action: "",
  }

  const draggableTableHeaders = {
    name: "t.name",
    ...(formKey === "preference" && {
      additionalFields: "settings.preferenceAdditionalFields",
    }),
    action: "",
  }

  const getPreviewSection = (
    previewShown: boolean,
    optionIndex: number,
    item: MultiselectQuestion
  ) => {
    const getInfoSection = (option: MultiselectQuestion | MultiselectOption, index: number) => {
      const isNotLastItem = index < item.multiselectOptions?.length - 1
      return (
        <div key={index} className={isNotLastItem ? "mb-5" : "mb-1"}>
          <div className={"font-semibold mb-1 text-gray-800"}>
            <span>{option.name || option.text}</span>
          </div>
          {option.description && (
            <div
              className={`${
                !option.links?.length && isNotLastItem ? "mb-5" : "mb-1"
              } text-gray-750`}
            >
              {option.description}
            </div>
          )}

          {option.links?.length > 0 && (
            <div className={`${isNotLastItem ? "mb-5" : "mb-1"}`}>
              {option.links.map((link, linkIndex) => {
                return (
                  <span className={"underline"} key={linkIndex}>
                    <LinkComponent href={link.url} target={"_blank"} className={"mr-3"}>
                      {link.title}
                    </LinkComponent>
                  </span>
                )
              })}
            </div>
          )}
          {(option["shouldCollectAddress"] || option["collectAddress"]) && (
            <div
              className={`${
                isNotLastItem && (option.description || option.links?.length > 0) ? "-mt-4" : "mt-0"
              }`}
            >
              ({t("listings.providesAdditionalFields.info")})
            </div>
          )}
        </div>
      )
    }
    const statusVariant = item.status === MultiselectQuestionsStatusEnum.active ? "success" : null
    const statusText = `${item.status.charAt(0).toUpperCase()}${item.status.slice(1)}`
    const showAdditionalTag = item.multiselectOptions?.some(
      (option) => option.shouldCollectAddress || option.collectAddress
    )
    return (
      <div className="ml-8 -mt-6 mb-4 text-sm">
        {(enableV2MSQ || showAdditionalTag) && (
          <div className="mt-6 mb-2 flex gap-2">
            {enableV2MSQ && <Tag variant={statusVariant}>{statusText}</Tag>}
            {showAdditionalTag && additionalFieldsTag()}
          </div>
        )}
        <div>
          <button
            onClick={() => {
              const newPreviews = previewShown
                ? openPreviews.filter((previewIndex) => previewIndex !== optionIndex)
                : [...openPreviews, optionIndex]
              setOpenPreviews(newPreviews)
            }}
          >
            <span className={"text-blue-500 underline"}>
              {previewShown ? t("t.hide") : t("t.previewLowercase")}
            </span>
          </button>
          {previewShown && (
            <div className={"bg-blue-100 mt-2 p-4"}>
              {getInfoSection(item, -1)}
              {item.multiselectOptions?.map((option, index) => {
                return getInfoSection(option, index)
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid heading={title} subheading={subtitle} inset>
        <Grid.Row>
          <Grid.Cell>
            {!!listingData.length && (
              <div className="mb-5">
                <MinimalTable headers={formTableHeaders} data={formTableData} />
              </div>
            )}

            <Button
              id={`add-${applicationSection}-button`}
              type="button"
              variant="primary-outlined"
              size="sm"
              onClick={() => setTableDrawer(true)}
            >
              {listingData.length ? editText : addText}
            </Button>
          </Grid.Cell>
        </Grid.Row>
      </SectionWithGrid>
      {subNote && <p className="field-sub-note">{subNote}</p>}

      <Drawer
        isOpen={!!tableDrawer}
        onClose={() => {
          if (!selectDrawer) {
            setTableDrawer(null)
          }
        }}
        ariaLabelledBy="select-and-order-drawer-header"
      >
        <Drawer.Header id="select-and-order-drawer-header">{drawerTitle}</Drawer.Header>
        <Drawer.Content>
          <Card>
            {drawerSubtitle && (
              <Card.Section>
                <p>{drawerSubtitle}</p>
              </Card.Section>
            )}
            <Card.Section>
              {!!draftListingData.length && (
                <div className="mb-5">
                  <MinimalTable
                    headers={draggableTableHeaders}
                    data={draggableTableData}
                    draggable={true}
                    setData={setDragOrder}
                  />
                </div>
              )}
              <Button
                type="button"
                variant="primary-outlined"
                onClick={() => {
                  setSelectDrawer(true)
                }}
                id={drawerButtonId}
              >
                {drawerButtonText}
              </Button>
            </Card.Section>
          </Card>
        </Drawer.Content>
        <Drawer.Footer>
          <Button
            id="select-and-order-save-button"
            type="button"
            variant="primary"
            size="sm"
            onClick={() => {
              setListingData(draftListingData)
              setTableDrawer(null)
            }}
          >
            {t("t.save")}
          </Button>
        </Drawer.Footer>
      </Drawer>

      <Drawer
        isOpen={!!selectDrawer}
        onClose={() => {
          setSelectDrawer(null)
          setOpenPreviews([])
        }}
        ariaLabelledBy="select-and-order-nested-drawer-header"
        nested
      >
        <Drawer.Header id="select-and-order-nested-drawer-header">{drawerButtonText}</Drawer.Header>
        <Drawer.Content>
          <Card>
            <Card.Section>
              {fetchedData.map((item, index) => {
                const previewShown = openPreviews.some((preview) => preview === index)
                const alreadySelected = draftListingData.some(
                  (existingItem) => existingItem.id === item.id
                )

                return (
                  <Grid
                    key={index}
                    className={`${
                      enableV2MSQ &&
                      !alreadySelected &&
                      (item.status === MultiselectQuestionsStatusEnum.toRetire ||
                        item.status === MultiselectQuestionsStatusEnum.retired)
                        ? "hidden"
                        : ""
                    }`}
                  >
                    <Grid.Row>
                      <Grid.Cell>
                        <Field
                          className={`font-semibold ${styles["label-option"]}`}
                          id={`${formKey}.${item.id}`}
                          name={`${formKey}.${item.id}`}
                          type="checkbox"
                          label={item.name || item.text}
                          register={register}
                          inputProps={{
                            defaultChecked: alreadySelected,
                          }}
                        />
                        {getPreviewSection(previewShown, index, item)}
                      </Grid.Cell>
                    </Grid.Row>
                  </Grid>
                )
              })}
            </Card.Section>
          </Card>
        </Drawer.Content>
        <Drawer.Footer>
          <Button
            id={`add-${applicationSection}-save-button`}
            type="button"
            variant="primary"
            onClick={() => {
              const formData = getValues()
              const formItems = []
              fetchedData.forEach((uniqueItem) => {
                if (formData[formKey] && formData[formKey][uniqueItem.id]) {
                  formItems.push(uniqueItem)
                }
              })
              setDraftListingData(formItems)
              setSelectDrawer(null)
              setOpenPreviews([])
            }}
          >
            {t("t.save")}
          </Button>
        </Drawer.Footer>
      </Drawer>
    </>
  )
}

export default SelectAndOrder

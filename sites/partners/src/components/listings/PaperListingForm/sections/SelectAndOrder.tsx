import React, { useState, useEffect, useMemo, useCallback } from "react"
import { t, MinimalTable, Drawer, Field, StandardTableData } from "@bloom-housing/ui-components"
import {
  MultiselectQuestion,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Button, Card, Grid, Tag, Icon } from "@bloom-housing/ui-seeds"
import { useFormContext } from "react-hook-form"
import InformationCircleIcon from "@heroicons/react/24/solid/InformationCircleIcon"
import LinkComponent from "../../../../components/core/LinkComponent"
import SectionWithGrid from "../../../shared/SectionWithGrid"

type SelectAndOrderSection = MultiselectQuestion

type SelectAndOrderProps = {
  listingData: SelectAndOrderSection[]
  setListingData: (listingData: SelectAndOrderSection[]) => void
  title: string
  subtitle: string
  editText: string
  addText: string
  drawerTitle: string
  drawerButtonText: string
  dataFetcher: (
    jurisdiction?: string,
    applicationSection?: MultiselectQuestionsApplicationSectionEnum
  ) => {
    data: SelectAndOrderSection[]
    loading: boolean
    error: any
  }
  formKey: string
  applicationSection: MultiselectQuestionsApplicationSectionEnum
  subNote?: string
}

const SelectAndOrder = ({
  applicationSection,
  listingData,
  setListingData,
  title,
  subtitle,
  editText,
  addText,
  drawerTitle,
  drawerButtonText,
  dataFetcher,
  formKey,
  subNote,
}: SelectAndOrderProps) => {
  const [tableDrawer, setTableDrawer] = useState<boolean | null>(null)
  const [selectDrawer, setSelectDrawer] = useState<boolean | null>(null)
  const [draftListingData, setDraftListingData] = useState<SelectAndOrderSection[]>(listingData)
  const [dragOrder, setDragOrder] = useState([])
  const [openPreviews, setOpenPreviews] = useState<number[]>([])

  const formMethods = useFormContext()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, getValues, watch, setValue } = formMethods

  const deleteItem = useCallback(
    (item: SelectAndOrderSection, setRootData?: boolean) => {
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
        name: { content: item.text },
        additionalFields: {
          content: (
            <>{item?.options.some((item) => item.collectAddress) && additionalFieldsTag()}</>
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
        name: { content: item.text },
        additionalFields: {
          content: (
            <>{item?.options.some((item) => item.collectAddress) && additionalFieldsTag()}</>
          ),
        },
        action: {
          content: (
            <div className="flex">
              <Button
                type="button"
                className="font-semibold text-alert"
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
          draftListingData.filter((draftItem) => draftItem.text === item.name.content)[0]
        )
      })
      setDraftListingData(newDragOrder)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragOrder])

  const jurisdiction: string = watch("jurisdictions.id")

  const { data: fetchedData = [] } = dataFetcher(
    jurisdiction,
    applicationSection as unknown as MultiselectQuestionsApplicationSectionEnum
  )

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
    const getInfoSection = (option, index) => {
      const isNotLastItem = index < item.options.length - 1
      return (
        <div key={index} className={isNotLastItem ? "mb-5" : "mb-1"}>
          <div className={"font-semibold mb-1 text-gray-800"}>
            <span>{option.text}</span>
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
          {option.collectAddress && (
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
    return (
      <div className="ml-8 -mt-6 mb-4 text-sm">
        {item.options.some((option) => option.collectAddress) && (
          <div className="mt-6 mb-2">{additionalFieldsTag()}</div>
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
              {item.options.map((option, index) => {
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
            {subNote && <p className="field-sub-note">{subNote}</p>}
          </Grid.Cell>
        </Grid.Row>
      </SectionWithGrid>

      <Drawer
        open={!!tableDrawer}
        title={drawerTitle}
        ariaDescription={drawerTitle}
        onClose={() => {
          if (!selectDrawer) {
            setTableDrawer(null)
          }
        }}
      >
        <div className="border rounded-md p-8 bg-white">
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
            size="sm"
            onClick={() => {
              setSelectDrawer(true)
            }}
          >
            {drawerButtonText}
          </Button>
        </div>
        <Button
          type="button"
          className={"mt-4"}
          variant="primary"
          size="sm"
          onClick={() => {
            setListingData(draftListingData)
            setTableDrawer(null)
          }}
        >
          {t("t.save")}
        </Button>
      </Drawer>

      <Drawer
        open={!!selectDrawer}
        title={drawerButtonText}
        ariaDescription={drawerButtonText}
        onClose={() => {
          setSelectDrawer(null)
          setOpenPreviews([])
        }}
        className={"drawer__small"}
      >
        <Card>
          <Card.Section>
            {jurisdiction
              ? fetchedData.map((item, index) => {
                  const previewShown = openPreviews.some((preview) => preview === index)
                  return (
                    <Grid key={index}>
                      <Grid.Row>
                        <Grid.Cell>
                          <Field
                            className={"font-semibold"}
                            id={`${formKey}.${item.id}`}
                            name={`${formKey}.${item.id}`}
                            type="checkbox"
                            label={item.text}
                            register={register}
                            inputProps={{
                              defaultChecked: draftListingData.some(
                                (existingItem) => existingItem.text === item.text
                              ),
                            }}
                          />
                          {getPreviewSection(previewShown, index, item)}
                        </Grid.Cell>
                      </Grid.Row>
                    </Grid>
                  )
                })
              : t("listings.selectJurisdiction")}
          </Card.Section>
        </Card>
        {jurisdiction && (
          <Button
            id="addPreferenceSaveButton"
            type="button"
            className={"mt-4"}
            variant="primary"
            size="sm"
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
        )}
      </Drawer>
    </>
  )
}

export default SelectAndOrder

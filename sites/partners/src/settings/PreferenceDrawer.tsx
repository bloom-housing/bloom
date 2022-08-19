import React, { useState, useContext } from "react"
import {
  AppearanceSizeType,
  AppearanceStyleType,
  Button,
  Drawer,
  Field,
  FieldGroup,
  GridCell,
  GridSection,
  Select,
  SelectOption,
  Textarea,
  ViewItem,
  t,
  MinimalTable,
  StandardTableData,
} from "@bloom-housing/ui-components"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { useForm } from "react-hook-form"
import { YesNoAnswer } from "../applications/PaperApplicationForm/FormTypes"
import { MultiselectQuestion } from "@bloom-housing/backend-core"
import { OptionDrawerType, PreferenceDrawerType } from "../../pages/settings/index"
import { useEffect } from "react"
import { useMemo } from "react"
import ManageIconSection from "./ManageIconSection"
import PreferenceOptionDrawer from "./PreferenceOptionDrawer"

// type PreferenceOption = {
//   title: string
//   description: string
//   URL?: string
//   linkTitle?: string
//   collectAddress?: boolean
//   exclusive: boolean
// }

// type PreferenceForm = {
//   title: string
//   description: string
//   options: PreferenceOption[]
//   optOut: boolean
//   showOnListing: boolean
//   optOutLabel?: string
//   jurisdiction: Jurisdiction
// }

type PreferenceDrawerProps = {
  drawer: PreferenceDrawerType
  drawerOpen: boolean
  setDrawerOpen: React.Dispatch<React.SetStateAction<PreferenceDrawerType>>
}

type PreferenceFormValues = {
  description?: string
  jurisdictionId?: string
  optOutTitle?: string
  showOnListingQuestion?: YesNoAnswer
  title?: string
}

const PreferenceDrawer = ({ drawer, drawerOpen, setDrawerOpen }: PreferenceDrawerProps) => {
  const [optionDrawerOpen, setOptionDrawerOpen] = useState<OptionDrawerType | null>(null)
  const [dragOrder, setDragOrder] = useState([])

  const { profile } = useContext(AuthContext)

  let defaultValues: PreferenceFormValues = {}

  if (drawer?.type === "edit") {
    defaultValues = {
      description: drawer.preference.description,
      jurisdictionId: drawer.preference.jurisdictions[0].id,
      optOutTitle: drawer.preference.optOutText,
      showOnListingQuestion: drawer.preference.hideFromListing ? YesNoAnswer.No : YesNoAnswer.Yes,
      title: drawer.preference.text,
    }
  }

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, getValues, reset } = useForm<PreferenceFormValues>({
    defaultValues,
  })

  useEffect(() => {
    reset(defaultValues)
  }, [drawer])

  // // Update local state with dragged state
  // useEffect(() => {
  //   if (draftListingData.length > 0 && dragOrder.length > 0) {
  //     const newDragOrder = []
  //     dragOrder.forEach((item) => {
  //       newDragOrder.push(
  //         draftListingData.filter((draftItem) => draftItem.text === item.name.content)[0]
  //       )
  //     })
  //     setDraftListingData(newDragOrder)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [dragOrder])

  const jurisdictionOptions: SelectOption[] = [
    { label: "", value: "" },
    ...profile.jurisdictions.map((jurisdiction) => ({
      label: jurisdiction.name,
      value: jurisdiction.id,
    })),
  ]

  const yesNoOptions = [
    {
      id: YesNoAnswer.Yes,
      label: t("t.yes"),
      value: YesNoAnswer.Yes,
    },
    {
      id: YesNoAnswer.No,
      label: t("t.no"),
      value: YesNoAnswer.No,
    },
  ]

  const draggableTableData: StandardTableData = useMemo(
    () =>
      drawer?.preference?.options?.map((item) => ({
        name: { content: item.text },
        description: { content: item.description },
        action: {
          content: (
            <ManageIconSection
              onCopy={() => alert("copy")}
              onEdit={() => setOptionDrawerOpen({ type: "edit", option: item })}
              onDelete={() => alert("delete")}
            />
          ),
        },
      })),
    [drawer]
  )

  const drawerTitle =
    drawer?.type === "add" ? t("settings.preferenceAdd") : t("settings.preferenceEdit")

  return (
    <>
      <Drawer
        open={!!drawerOpen}
        title={drawerTitle}
        ariaDescription={drawerTitle}
        onClose={() => {
          if (!optionDrawerOpen) {
            setDrawerOpen(null)
          }
        }}
      >
        <div className="border rounded-md p-8 bg-white">
          <GridSection title={t("settings.preference")} columns={3}>
            <GridCell span={2}>
              <ViewItem label={t("t.title")}>
                <Field
                  id="title"
                  name="title"
                  label={t("t.title")}
                  placeholder={t("t.title")}
                  register={register}
                  type="text"
                  readerOnly
                  dataTestId={"preference-title"}
                />
              </ViewItem>
            </GridCell>
          </GridSection>
          <GridSection columns={3} className={"mb-4"}>
            <GridCell span={2}>
              <Textarea
                label={t("t.descriptionTitle")}
                name={"description"}
                id={"description"}
                fullWidth={true}
                placeholder={t("settings.preferenceDescription")}
                register={register}
                dataTestId={"preference-description"}
              />
            </GridCell>
          </GridSection>
          {drawer?.preference?.options?.length > 0 ? (
            <div className="mb-5">
              <MinimalTable
                headers={{
                  name: "t.name",
                  description: "t.description",
                  action: "",
                }}
                data={draggableTableData}
                draggable={true}
                setData={setDragOrder}
              />
            </div>
          ) : (
            <Button
              type="button"
              size={AppearanceSizeType.small}
              onClick={() => {
                setOptionDrawerOpen({ type: "add" })
              }}
              dataTestId={"preference-add-option-button"}
            >
              {t("settings.preferenceAddOption")}
            </Button>
          )}

          <GridSection columns={3} className={"mt-4"}>
            <GridCell>
              <ViewItem label={t("settings.preferenceOptOutLabel")}>
                <Field
                  id="optOutTitle"
                  name="optOutTitle"
                  label={t("settings.preferenceOptOutLabel")}
                  placeholder={t("settings.preferenceOptOutLabel")}
                  register={register}
                  type="text"
                  readerOnly
                  dataTestId={"preference-opt-out-label"}
                  defaultValue={t("application.preferences.dontWantSingular")}
                />
              </ViewItem>
            </GridCell>
          </GridSection>
          <GridSection columns={3} className={"mt-4"}>
            <GridCell>
              <ViewItem label={t("settings.preferenceShowOnListing")} className="mb-1" />
              <FieldGroup
                name="showOnListingQuestion"
                type="radio"
                register={register}
                fields={yesNoOptions}
                fieldClassName="m-0"
                fieldGroupClassName="flex h-12 items-center"
                dataTestId={"preference-show-on-listing"}
              />
            </GridCell>
          </GridSection>
          <GridSection columns={3}>
            <GridCell span={1}>
              <ViewItem label={t("t.jurisdiction")}>
                <Select
                  id={"jurisdictionId"}
                  name={"jurisdictionId"}
                  label={t("t.jurisdiction")}
                  labelClassName="sr-only"
                  register={register}
                  controlClassName={"control"}
                  keyPrefix={"jurisdictions"}
                  options={jurisdictionOptions}
                  dataTestId={"preference-jurisdiction"}
                />
              </ViewItem>
            </GridCell>
          </GridSection>
        </div>
        <Button
          type="button"
          className={"mt-4"}
          styleType={AppearanceStyleType.primary}
          size={AppearanceSizeType.normal}
          onClick={() => {
            setDrawerOpen(null)
          }}
          dataTestId={"preference-save-button"}
        >
          {t("t.save")}
        </Button>
      </Drawer>

      <Drawer
        open={!!optionDrawerOpen}
        title={t("settings.preferenceOptionEdit")}
        ariaDescription={t("settings.preferenceOptionEdit")}
        onClose={() => {
          setOptionDrawerOpen(null)
        }}
        className={"w-auto"}
      >
        <div className="border rounded-md p-8 bg-white">
          <GridSection title={t("t.option")} columns={3}>
            <GridCell span={2}>
              <ViewItem label={t("t.title")}>
                <Field
                  id="optionTitle"
                  name="optionTitle"
                  label={t("t.title")}
                  placeholder={t("t.title")}
                  register={register}
                  type="text"
                  readerOnly
                  dataTestId={"preference-option-title"}
                />
              </ViewItem>
            </GridCell>
          </GridSection>
          <GridSection columns={3} className={"mb-4"}>
            <GridCell span={2}>
              <Textarea
                label={t("t.descriptionTitle")}
                name={"optionDescription"}
                id={"optionDescription"}
                placeholder={t("settings.preferenceOptionDescription")}
                fullWidth={true}
                register={register}
                dataTestId={"preference-option-description"}
              />
            </GridCell>
          </GridSection>
          <GridSection columns={3} className={"mt-4"}>
            <GridCell>
              <ViewItem label={t("t.url")}>
                <Field
                  id="optionURL"
                  name="optionURL"
                  label={t("t.url")}
                  placeholder={"https://"}
                  register={register}
                  type="text"
                  readerOnly
                  dataTestId={"preference-option-URL"}
                />
              </ViewItem>
            </GridCell>
            <GridCell>
              <ViewItem label={t("settings.preferenceLinkTitle")}>
                <Field
                  id="optionLinkTitle"
                  name="optionLinkTitle"
                  label={t("settings.preferenceLinkTitle")}
                  placeholder={t("settings.preferenceLinkTitle")}
                  register={register}
                  type="text"
                  readerOnly
                  dataTestId={"preference-option-link-title"}
                />
              </ViewItem>
            </GridCell>
          </GridSection>
          <GridSection columns={3} className={"mt-8"}>
            <GridCell>
              <Field
                type="checkbox"
                id="collectAddress"
                name="collectAddress"
                label={t("settings.preferenceCollectAddress")}
                register={register}
                dataTestId={"preference-option-collect-address"}
                controlClassName={"font-normal"}
              />
            </GridCell>
          </GridSection>
        </div>
        <Button
          type="button"
          className={"mt-4"}
          styleType={AppearanceStyleType.primary}
          size={AppearanceSizeType.normal}
          onClick={() => {
            setOptionDrawerOpen(null)
          }}
          dataTestId={"preference-option-save"}
        >
          {t("t.save")}
        </Button>
      </Drawer>
      <PreferenceOptionDrawer
        drawer={optionDrawerOpen}
        drawerOpen={!!optionDrawerOpen?.option}
        setDrawerOpen={setOptionDrawerOpen}
      />
    </>
  )
}

export default PreferenceDrawer

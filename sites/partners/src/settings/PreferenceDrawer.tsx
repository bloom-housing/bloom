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
} from "@bloom-housing/ui-components"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { useForm } from "react-hook-form"
import { YesNoAnswer } from "../applications/PaperApplicationForm/FormTypes"
import { Jurisdiction } from "@bloom-housing/backend-core"

type PreferenceOption = {
  title: string
  description: string
  URL?: string
  linkTitle?: string
  collectAddress?: boolean
  exclusive: boolean
}

type PreferenceForm = {
  title: string
  description: string
  options: PreferenceOption[]
  optOut: boolean
  showOnListing: boolean
  optOutLabel?: string
  jurisdiction: Jurisdiction
}

type PreferenceDrawerProps = {
  defaultValues: PreferenceForm
  drawerOpen: boolean
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const PreferenceDrawer = ({ drawerOpen, setDrawerOpen }: PreferenceDrawerProps) => {
  const [optionDrawerOpen, setOptionDrawerOpen] = useState<boolean | null>(null)

  const { profile } = useContext(AuthContext)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = useForm()

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

  return (
    <>
      <Drawer
        open={!!drawerOpen}
        title={t("settings.preferenceEdit")}
        ariaDescription={t("settings.preferenceEdit")}
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
          <Button
            type="button"
            size={AppearanceSizeType.small}
            onClick={() => {
              setOptionDrawerOpen(true)
            }}
            dataTestId={"preference-add-option-button"}
          >
            {t("settings.preferenceAddOption")}
          </Button>
          <GridSection columns={3} className={"mt-4"}>
            <GridCell>
              <ViewItem label={t("settings.preferenceOptOut")} className="mb-1" />
              <FieldGroup
                name="optOutQuestion"
                type="radio"
                register={register}
                fields={yesNoOptions}
                fieldClassName="m-0"
                fieldGroupClassName="flex h-12 items-center"
                dataTestId={"preference-opt-out"}
              />
            </GridCell>
            <GridCell>
              <ViewItem label={t("settings.preferenceOptOutLabel")}>
                <Field
                  id="title"
                  name="title"
                  label={t("settings.preferenceOptOutLabel")}
                  placeholder={t("settings.preferenceOptOutLabel")}
                  register={register}
                  type="text"
                  readerOnly
                  dataTestId={"preference-opt-out-label"}
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
                  id={"jurisdiction.id"}
                  name={"jurisdiction.id"}
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
                  placeholder={t("t.url")}
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
          <GridSection columns={3}>
            <GridCell span={2}>
              <p className="field-label m-4 ml-0">{t("settings.preferenceExclusiveQuestion")}</p>
              <FieldGroup
                name="multiSelectQuestion"
                type="radio"
                register={register}
                fields={[
                  {
                    label: t("settings.preferenceMultiSelect"),
                    value: "multiSelect",
                    id: "multiSelect",
                    defaultChecked: false,
                  },
                  {
                    label: t("settings.preferenceExclusive"),
                    value: "exclusive",
                    id: "exclusive",
                    defaultChecked: false,
                  },
                ]}
                dataTestId={"preference-option-multiselect"}
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
    </>
  )
}

export default PreferenceDrawer

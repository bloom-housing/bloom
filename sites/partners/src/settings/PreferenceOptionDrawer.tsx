import React, { useState, useContext, useEffect } from "react"
import {
  AppearanceSizeType,
  AppearanceStyleType,
  Button,
  Drawer,
  Field,
  GridCell,
  GridSection,
  Textarea,
  ViewItem,
  t,
} from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"
import { OptionDrawerType } from "../../pages/settings/index"

type PreferenceOptionDrawerProps = {
  drawer: OptionDrawerType
  drawerOpen: boolean
  setDrawerOpen: React.Dispatch<React.SetStateAction<OptionDrawerType>>
}

type OptionFormValues = {
  optionTitle?: string
  optionDescription?: string
  optionUrl?: string
  optionLinkTitle?: string
  collectAddress?: boolean
}

const PreferenceOptionDrawer = ({
  drawer,
  drawerOpen,
  setDrawerOpen,
}: PreferenceOptionDrawerProps) => {
  const [optionDrawerOpen, setOptionDrawerOpen] = useState<boolean | null>(null)

  let defaultValues: OptionFormValues = {}

  if (drawer?.type === "edit") {
    defaultValues = {
      optionTitle: drawer.option.text,
      optionDescription: drawer.option.description,
      optionUrl: drawer.option.links?.length > 0 ? drawer.option.links[0].url : null,
      optionLinkTitle: drawer.option.links?.length > 0 ? drawer.option.links[0].title : null,
      collectAddress: drawer.option.collectAddress,
    }
  }

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, getValues, reset, setValue, setError } = useForm<OptionFormValues>({
    defaultValues,
  })

  useEffect(() => {
    console.log("in use effect")
    reset(defaultValues)
  }, [drawer])

  const drawerTitle =
    drawer?.type === "add" ? t("settings.preferenceOptionAdd") : t("settings.preferenceOptionEdit")

  return (
    <Drawer
      open={!!optionDrawerOpen}
      title={drawerTitle}
      ariaDescription={drawerTitle}
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
                id="optionUrl"
                name="optionUrl"
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
  )
}

export default PreferenceOptionDrawer

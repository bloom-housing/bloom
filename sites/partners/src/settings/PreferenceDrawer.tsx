import React, { useState } from "react"
import {
  t,
  Button,
  AppearanceSizeType,
  Drawer,
  AppearanceStyleType,
  GridSection,
  GridCell,
  ViewItem,
  Field,
  Textarea,
  FieldGroup,
} from "@bloom-housing/ui-components"
import { useForm, useFormContext } from "react-hook-form"
import { YesNoAnswer } from "../applications/PaperApplicationForm/FormTypes"

type PreferenceDrawerProps = {
  drawerOpen: boolean
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const PreferenceDrawer = ({ drawerOpen, setDrawerOpen }: PreferenceDrawerProps) => {
  const [optionDrawerOpen, setOptionDrawerOpen] = useState<boolean | null>(null)

  const formMethods = useFormContext()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, getValues, watch, setValue } = useForm()

  const optOutOptions = [
    {
      id: "sameAddressYes",
      label: t("t.yes"),
      value: YesNoAnswer.Yes,
    },
    {
      id: "sameAddressNo",
      label: t("t.no"),
      value: YesNoAnswer.No,
    },
  ]

  return (
    <>
      <Drawer
        open={!!drawerOpen}
        title={"Add / Edit"}
        ariaDescription={"Add / Edit"}
        onClose={() => {
          if (!optionDrawerOpen) {
            setDrawerOpen(null)
          }
        }}
      >
        <div className="border rounded-md p-8 bg-white">
          <GridSection title={"Preference"} columns={4}>
            <GridCell span={2}>
              <ViewItem label={"Title"}>
                <Field
                  id="title"
                  name="title"
                  label={"Title"}
                  placeholder={"Title"}
                  register={register}
                  type="text"
                  readerOnly
                />
              </ViewItem>
            </GridCell>
          </GridSection>
          <GridSection columns={4}>
            <GridCell span={2}>
              <Textarea
                label={"Description"}
                name={"description"}
                id={"description"}
                fullWidth={true}
                register={register}
              />
            </GridCell>
          </GridSection>
          <Button
            type="button"
            size={AppearanceSizeType.normal}
            onClick={() => {
              setOptionDrawerOpen(true)
            }}
          >
            {"Add Preference Option"}
          </Button>
          <GridSection columns={2}>
            <GridCell>
              <ViewItem label={"Can applicants opt out?"} className="mb-1" />
              <FieldGroup
                name="optOutQuestion"
                type="radio"
                register={register}
                fields={optOutOptions}
                fieldClassName="m-0"
                fieldGroupClassName="flex h-12 items-center"
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
            setDrawerOpen(null)
          }}
        >
          {t("t.save")}
        </Button>
      </Drawer>

      <Drawer
        open={!!optionDrawerOpen}
        title={"Add / Edit Option"}
        ariaDescription={"Add / Edit Option"}
        onClose={() => {
          setOptionDrawerOpen(null)
        }}
        className={"w-auto"}
      >
        <div className="border rounded-md p-8 bg-white">Drawer 2</div>
        <Button
          id="addPreferenceSaveButton"
          type="button"
          className={"mt-4"}
          styleType={AppearanceStyleType.primary}
          size={AppearanceSizeType.normal}
          onClick={() => {
            setOptionDrawerOpen(null)
          }}
        >
          {t("t.save")}
        </Button>
      </Drawer>
    </>
  )
}

export default PreferenceDrawer

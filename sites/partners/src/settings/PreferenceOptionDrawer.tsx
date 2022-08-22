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



  return (

  )
}

export default PreferenceOptionDrawer

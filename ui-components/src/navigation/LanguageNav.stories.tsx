import React from "react"

import { LanguageNav, LangItem } from "./LanguageNav"

const ENGLISH_LANG_ITEM: LangItem = {
  prefix: "",
  label: "English",
}

const SPANISH_LANG_ITEM: LangItem = {
  prefix: "es",
  label: "Spanish",
}

export default {
  title: "LanguageNav",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => (
  <LanguageNav
    onChangeLanguage={(_) => {}}
    currentLanguagePrefix={SPANISH_LANG_ITEM.prefix}
    items={[ENGLISH_LANG_ITEM, SPANISH_LANG_ITEM]}
  />
)

import * as React from "react"

import "../blocks/InfoCard.scss"
import { PreferencesList } from "./PreferencesList"
import Gish from "../../__tests__/fixtures/gish.json"

export default {
  title: "Lists/Preferences List",
}

const listing = Object.assign({}, Gish) as any

export const preferences = () => {
  return <PreferencesList preferences={listing.preferences} />
}

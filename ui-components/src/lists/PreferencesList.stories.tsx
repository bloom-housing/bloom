import * as React from "react"

import { PreferencesList } from "./PreferencesList"

export default {
  title: "Lists/Preferences List",
}

const listingPreferences = [
  {
    ordinal: 1,
    links: [],
    title: "Title 1",
    description: "Description 1",
  },
  {
    ordinal: 2,
    links: [
      {
        url: "http://www.google.com",
        title: "Link Title 2",
      },
    ],
    title: "Title 2",
    subtitle: "Subtitle 2",
    description: "Description 2",
  },
  {
    ordinal: 3,
    links: [],
    title: "Title 3",
    subtitle: "Subtitle 3",
    description: "Description 3",
  },
]

export const preferences = () => {
  return <PreferencesList listingPreferences={listingPreferences} />
}

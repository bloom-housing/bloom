import * as React from "react"
import { BADGES } from "../../.storybook/constants"
import { PreferencesList } from "./PreferencesList"
import PreferencesListDocumentation from "./PreferencesList.docs.mdx"

export default {
  title: "Lists/Preferences List 🚩",
  id: "lists/preferences-list",
  decorators: [(storyFn: any) => <div>{storyFn()}</div>],
  parameters: {
    docs: {
      page: PreferencesListDocumentation,
    },
    badges: [BADGES.GEN2],
  },
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
      {
        url: "http://www.apple.com",
        ariaLabel: "Link to Apple",
        title: "Link Title with Aria Label",
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

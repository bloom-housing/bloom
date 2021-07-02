import "@bloom-housing/ui-components/src/global/index.scss"

// Set up translation file
import { addTranslation } from "../src/helpers/translator"
import general from "../src/locales/general.json"
addTranslation(general)

export const parameters = {
  options: {
    storySort: {
      order: [
        "Actions",
        "Blocks",
        "Footers",
        "Forms",
        "Headers",
        "Icons",
        "Lists",
        "Navigation",
        "Notifications",
        "Overlays",
        "Sections",
        "Tables",
      ],
    },
  },
  a11y: {
    config: {
      rules: [
        // An example of how you can turn off a specific rule
        // {
        //   id: 'color-contrast',
        //   enabled: false
        // }
    ]
    }
  }
}

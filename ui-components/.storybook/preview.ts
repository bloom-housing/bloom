import "@bloom-housing/ui-components/src/global/css-imports.scss"
import "@bloom-housing/ui-components/src/global/app-css.scss"

import { BADGES } from "./constants"

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
        // TODO: Enable color-contrast after resolving #1488
        {
          id: "color-contrast",
          enabled: false,
        },
      ],
    },
  },
  badgesConfig: {
    [BADGES.GEN2]: {
      styles: {
        backgroundColor: "#0077da",
        borderColor: "#0077da",
        color: "#fff",
      },
      title: "2nd Generation",
    },
  },
}

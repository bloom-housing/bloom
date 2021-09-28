import "@bloom-housing/ui-components/src/global/css-imports.scss"
import "@bloom-housing/ui-components/src/global/app-css.scss"

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
}

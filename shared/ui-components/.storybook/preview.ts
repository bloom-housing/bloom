import { configure } from "@storybook/react"
import "@bloom-housing/ui-components/styles/index.scss"

// Set up translation file
import { addTranslation } from "../src/helpers/translator"
import general from "../static/locales/general.json"
addTranslation(general)

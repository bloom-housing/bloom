import { configure } from "@storybook/react"
import "@bloom-housing/ui-components/styles/index.scss"

// Set up translation file
import { addTranslation } from "../src/helpers/translator"
import general from "../static/locales/general.json"
addTranslation(general)

// automatically import all files ending in *.stories.tsx
const req = require.context("../src", true, /stories\.tsx$/)

function loadStories() {
  req.keys().forEach(req)
}

configure(loadStories, module)

// Future home of additional Jest config
import { addTranslation } from "@bloom-housing/ui-components"
import generalTranslations from "@bloom-housing/ui-components/src/locales/general.json"
import { configure } from "@testing-library/dom"
import '@testing-library/jest-dom/extend-expect'
import general from "../page_content/locale_overrides/general.json"
addTranslation({ ...generalTranslations, ...general })

process.env.cloudinaryCloudName = "exygy"
process.env.cloudinarySignedPreset = "test123"

configure({ testIdAttribute: "data-test-id" })

// Need to set __next on base div to handle the overlay
const portalRoot = document.createElement("div")
portalRoot.setAttribute("id", "__next")
document.body.appendChild(portalRoot)
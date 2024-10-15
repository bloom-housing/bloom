// Future home of additional Jest config
import { addTranslation } from "@bloom-housing/ui-components"
import generalTranslations from "@bloom-housing/shared-helpers/src/locales/general.json"
import axios from "axios"
import "@testing-library/jest-dom/extend-expect"
import general from "../page_content/locale_overrides/general.json"
import { serviceOptions } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
addTranslation({ ...generalTranslations, ...general })

process.env.cloudinaryCloudName = "exygy"
process.env.cloudinarySignedPreset = "test123"
process.env.backendApiBase = "http://localhost:3100"

global.beforeEach(() => {
  serviceOptions.axios = axios.create({
    baseURL: "http://localhost:3100",
  })
})

// Need to set __next on base div to handle the overlay
const portalRoot = document.createElement("div")
portalRoot.setAttribute("id", "__next")
document.body.appendChild(portalRoot)

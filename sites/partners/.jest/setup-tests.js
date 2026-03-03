// Future home of additional Jest config
import "@testing-library/jest-dom"
import generalTranslations from "@bloom-housing/shared-helpers/src/locales/general.json"
import { serviceOptions } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import axios from "axios"
import general from "../page_content/locale_overrides/general.json"
// ui-components uses ResizeObserver for drag-and-drop, so we need to mock it here before importing anything from ui-components
global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))
import { addTranslation } from "@bloom-housing/ui-components"
addTranslation({ ...generalTranslations, ...general })

process.env.cloudinaryCloudName = "exygy"
process.env.cloudinarySignedPreset = "test123"
process.env.backendApiBase = "http://localhost:3100"

global.beforeEach(() => {
  serviceOptions.axios = axios.create({
    baseURL: "http://localhost:3100",
  })
})

const intersectionObserverMock = () => ({
  observe: () => null,
  disconnect: () => null,
  unobserve: () => null,
})
window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock)

// Need to set __next on base div to handle the overlay
const portalRoot = document.createElement("div")
portalRoot.setAttribute("id", "__next")
document.body.appendChild(portalRoot)

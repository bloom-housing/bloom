// Future home of additional Jest config
import { addTranslation } from "@bloom-housing/ui-components"
import generalTranslations from "@bloom-housing/ui-components/src/locales/general.json"
import { serviceOptions } from "@bloom-housing/backend-core"
import axios from "axios"
import "@testing-library/jest-dom/extend-expect"
import general from "../src/page_content/locale_overrides/general.json"
addTranslation({ ...generalTranslations, ...general })

// see: https://jestjs.io/docs/en/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
window.matchMedia = jest.fn().mockImplementation((query) => {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }
})

process.env.backendApiBase = "http://localhost:3100"

global.beforeEach(() => {
  serviceOptions.axios = axios.create({
    baseURL: "http://localhost:3000",
  })
})

// Need to set __next on base div to handle the overlay
const portalRoot = document.createElement("div")
portalRoot.setAttribute("id", "__next")
document.body.appendChild(portalRoot)

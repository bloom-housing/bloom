// Future home of additional Jest config
import { addTranslation } from "@bloom-housing/ui-components"
import generalTranslations from "../../../shared-helpers/src/locales/general.json"
import general from "../page_content/locale_overrides/general.json"
import generalSharedHelpers from "../../../shared-helpers/src/locales/general.json"
addTranslation({ ...generalTranslations, ...generalSharedHelpers, ...general })
import "@testing-library/jest-dom"
import "whatwg-fetch"
import { serviceOptions } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import axios from "axios"

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

const intersectionObserverMock = () => ({
  observe: () => null,
  disconnect: () => null,
  unobserve: () => null,
})
window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock)

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

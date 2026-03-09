// ui-components uses ResizeObserver for drag-and-drop, so we need to mock it here before importing anything from ui-components
global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))
import { addTranslation } from "@bloom-housing/ui-components"
import generalTranslations from "@bloom-housing/shared-helpers/src/locales/general.json"
import "@testing-library/jest-dom"

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

addTranslation(generalTranslations)

// Future home of additional Jest config
import "@testing-library/jest-dom/extend-expect"

import { addTranslation } from "@bloom-housing/ui-components"
import generalTranslations from "@bloom-housing/ui-components/src/locales/general.json"

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

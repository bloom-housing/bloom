// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.ts using ES2015 syntax:
import { ACCESS_TOKEN_LOCAL_STORAGE_KEY } from "@bloom-housing/ui-components"

// If TypeScript considers this file a module (as opposed to a script), then we need to define this as a global for
// it to register. See:
// https://github.com/cypress-io/add-cypress-custom-command-in-typescript/issues/2#issuecomment-389870033
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable {
      /**
       * Login to the app using the specified email/password
       * @example cy.login('email@example.com", "123abc").then(...)
       */
      login(email: string, password: string, options?: { apiBase: string }): Chainable

      /**
       * Logout from the app (clears session storage's saved version of the key.)
       */
      logout(): Chainable
    }
  }
}

Cypress.Commands.add(
  "login",
  (email: string, password: string, { apiBase = "http://localhost:3100" } = {}) => {
    return cy
      .request({
        url: `${apiBase}/auth/login`,
        method: "POST",
        body: { email, password },
      })
      .its("body")
      .then(({ accessToken }) => {
        cy.window().then((window) =>
          window.sessionStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, accessToken)
        )
      })
  }
)

Cypress.Commands.add("logout", () =>
  cy.window().then((window) => window.sessionStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY))
)

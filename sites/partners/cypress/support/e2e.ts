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
import "@cypress/code-coverage/support"

// Uncomment to run Deque Axe Developer Hub accessibility tests
// import "@axe-core/watcher/dist/cypressCommands"
// afterEach(() => {
//   if (Cypress.env("runAccessibilityTests")) cy.axeWatcherFlush()
// })

// Import commands.js using ES2015 syntax:
import "./commands"

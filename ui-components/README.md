# Bloom UI Components

This package is the home of the core UI components for the Bloom affordable housing system, meant to be imported from one or more applications that provide the end-user interface.

## Types of Components

Bloom components have been design with the principles of [Atomic Design](http://atomicdesign.bradfrost.com/) in mind, and some of the directory structure and naming conventions are based on that.

There are also Page Components as a distinct class, which represent larger combinations of components (atomic: organisms) that are meant to be directly imported into specific pages in the system (e.g. a home page).

## Locales/Translations

`src/locales` contains JSON files with translated keys and copy used within all of our packages.

## Storybook

The UI components package includes [Storybook](https://storybook.js.org/) for easy browsing of the component tree, and is the best way to get started understand what's available ([we publish our Storybook](https://storybook.bloom.exygy.dev/)). When creating a new component write a default story for the base component and include stories for each state.

To spin up Storybook locally, from within `ui-components` run:

```
yarn start
```

## Testing

To run the unit test suite which is built with Jest and RTL, from within `ui-components` run:

```
yarn test
```

or

```
yarn test:coverage
```

which generates local coverage reports, useful as you are writing tests to ensure you have encompassed all the states.

To run our accessibility suite which leverages Storybook, from within `ui-components` run:

```
yarn test:a11y
```

## Tailwind

- We are using the [Tailwind](https://v1.tailwindcss.com) framework to make use of their low-level utility library that styles components based on custom settings. We configure the settings in `tailwind.config`. Some styles live in a global folder, but for the most part our components are styled with isolated SCSS files.

- Use Tailwind where possible before creating custom style sheets or custom classes for consistency.

Vendor Plugins

- [AG Grid](https://www.ag-grid.com)
- [Bulma](https://bulma.io/documentation/components/navbar/) (for the navbar)

## Style Conventions

### Naming Conventions

- Our recommendation for class naming methodology is a modified version of BEM. It still uses blocks, sections within blocks and modifiers, but with a subclass syntax for modifiers.

  - Avoid using Sass nesting to build class names

    - Avoid
      - .accordion
        - &-item
    - Preferred
      - .accordion
      - .accordion-item
      - .accordion-item\_\_label

  - Modify with adjectives
    - is-, has-
    - .accordion-item\_\_label.is-open

- Component naming
  - Be wary of naming components based on content, presentation, location, or theming, as this limits the use of the class or becomes confusing
  - Use capitals for React component names
    - SelectButton instead of selectbutton, or Menu instead of menu
- Avoid including any backend business logic in ui-components so that they may be consumed regardless of the backend implementation

### General Rules

- Don’t use IDs for styles.
- Don’t nest more than 3 layers deep.
- Don’t fix problems with !important. Use !important purposefully.
- Refrain from using overqualified selectors; div.container can simply be stated as .container.
- Use flex instead of float
- Use grid utilities for uniform grids

### Accessibility Considerations

- Storybook A11t test suite runs on all PRs
- Storybook AXE panel when looking at an individual component can be useful
- Keyboard accessibility
  - Consider aria roles, focus state
- Consider color contrast
- Accessible forms
  - Labels for each input
  - Screen reader labels for inputs with no label
  - Fieldsets for groups
  - Required indicators
- Accessible data tables
- Alt tags for images
- Errors and alert messages

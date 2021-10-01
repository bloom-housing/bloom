# Bloom UI Components

This package is the home of the core UI components for the Bloom affordable housing system, meant to be imported from one or more applications that provide the end-user interface.

## Types of Components

Bloom components have been design with the principles of [Atomic Design](http://atomicdesign.bradfrost.com/) in mind, and some of the directory structure and naming conventions are based on that.

There are also Page Components as a distinct class, which represent larger combinations of components (atomic: organisms) that are meant to be directly imported into specific pages in the system (e.g. a home page).

## Locales/Translations

Look in `src/locales` for JSON files containing translated keys for UI elements and copy across all monorepo sites.

## Storybook

The UI components package includes [Storybook](https://storybook.js.org/) for easy browsing of the component tree, and is the best way to get started understand what's available.

## CLI

To spin up Storybook locally, run:

```
yarn start
```

To run the test suite which is built with Jest and RTL run:

```
yarn test

# or

yarn test:coverage # generates local coverage reports, useful as you are writing tests
```

## Style Organization and Best Practices

### Style Frameworks

- [Tailwind](https://v1.tailwindcss.com) v1: Low-level utility library that styles components based on custom settings.

### Sass Architecture

- /ui-components: Components and styles are accessible by multiple apps
  - /global: Styles are accessible by any component
    - index: import frameworks, fonts, components, utilities
    - /elements (no associated markup pattern, if more than 300 lines we break this into a folder with files)
    - mixins
    - utilities
    - typography
    - print
    - /vendors
  - Components: Styles are isolated per component
    - /actions
    - /footers
    - /headers
    - /icons
    - /forms
    - /layouts
    - /lists
    - /navigations
    - /notifications
    - /overlays
    - /sections
    - /structure
    - /tables
    - /text
  - Settings
    - tailwind.config
- Apps: Components and styles that are accessible to a single app
  - Reference
  - Reference components (temp/prototype)

Vendor Plugins

- [AG Grid](https://www.ag-grid.com)
- [Bulma](https://bulma.io/documentation/components/navbar/) (for the navbar)

### Naming Conventions

- **BEM**

  - Structures CSS such that every entity is composed of blocks, elements and modifiers
  - Avoid using Sass nesting to build class names
    - Bad
      - .accordion
        - &-item
    - Good
      - .accordion
      - .accordion-item

- Suggested custom methodology: Our recommendation for a naming methodology is a modified version of BEM. It still uses blocks, sections within blocks and modifiers, but with a subclass syntax for modifiers.

  - BEM

    - .accordion
    - .accordion-item
    - .accordion-item\_\_label

  - Sub Class Modifiers: Name modifiers and state-based rules with adjectives
    - is-, has-
    - .accordion-item\_\_label.is-open

- Component naming
  - Name things clearly
  - Be wary of naming components based on content, as this limits the use of the class
  - Avoid presentation- or location-specific naming
- Use capitals for React component names
  - SelectButton instead of selectbutton, or Menu instead of menu
- Tokenize prop values
  - Avoid presentation-specific words in prop values, as it will change with theming

### Utilities & Custom Class Names

- Use Tailwind utilities to prototype components before writing a custom styles sheet or creating custom classes.
  - Create custom component classes once you understand the component structure and variants.
- Use Tailwind utilities at the app level when creating layout and page level objects.
  - Create custom layout classes once you identify a repeatable layout pattern.

### CSS Formatting

- File declaration order
  1.  Local variables
  2.  Tailwind utilities
  3.  Media queries
  4.  Pseudo states
  5.  Nested classes
  6.  Nested elements

### Specificity

- IDs should be reserved for JavaScript. Don’t use IDs for styles.
- Don’t nest more than 3 layers deep.
- Don’t fix problems with !important. Use !important purposefully.
- Refrain from using overqualified selectors; div.container can simply be stated as .container.

### Spacing Units

- Base 16 using Tailwind Tokens for padding and margins

### Layout

- Use flex instead of float
- Use grid utilities for uniform grids

### Style Customization

- Tailwind Configuration

### Accessibility

- Storybook AXE panel
- Keyboard accessibility
  - Roles
  - Focus state
- Color contrast
  - AA
- Accessible forms
  - Labels for each input
  - Screen reader labels for inputs with no label
  - Fieldsets for groups
  - Required
- Accessible data tables
- Alt tags for images
- Errors and alert messages
- Overlay focus
- Screen reader utilities

### Build Process

### Upstream vs Downstream

## React Best Practices

### Calculate Style Based on Props

- a `warning={true}` prop might turn into an `is-warning` className applied

### Nesting

### Naming Conventions

- CamelCase to css

### Storybook: Creating Stories

- Include a default story for base component
- Include stories for each state

### Accessibility

- Use accessibility tab for QA

### Storybook Knobs

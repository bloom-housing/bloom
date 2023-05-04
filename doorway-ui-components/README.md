# Bloom UI Components

This package contains a component library used by the Bloom affordable housing system.

## Locales/Translations

`src/locales` contains JSON files with translated keys and copy used within all of our packages.

## Storybook

UIC uses [Storybook](https://storybook.js.org/) to document our components, and reviewing it is the best way to get started and understand what's available. You can view our published Storybook [here](https://storybook.bloom.exygy.dev/).

To spin up Storybook locally, from root run:

```
yarn start
```

## Testing

To run the unit test suite which is built with Jest and RTL, from root run:

```
yarn test
```

or

```
yarn test:coverage
```

which generates local coverage reports.

To run our accessibility suite which leverages Storybook, from root run:

```
yarn test:a11y
```

## Contributing

Contributions to UIC are welcomed. To help us meet the project's goals around quality and maintainability, we ask that all contributors read, understand, and agree to our guidelines.

### Issue tracking

Our development tasks are managed through GitHub issues and development in the vast majority of cases should be tied to an issue. Please feel free to submit issues even if you don't plan on implementing them yourself. Before creating an issue, check first to see if one already exists. When creating an issue, give it a descriptive title and include screenshots if relevant. Please comment on an issue if you are starting development.

### Committing, Versioning, and Releasing

We are using [semantic-release](https://www.npmjs.com/package/@semantic-release/npm) to automatically versions and release. In conjunction with semantic-release we are also using [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/), a specification for commit messages that helps semantic-release understand what level of change each commit is in order to automate our processes.

On commit, two steps automatically run: (1) linting and (2) a verification of the conventional commit standard. If you are still learning the conventional commit standard, we recommend not running `git commit` and instead globally installing commitizen (`npm install -g commitizen`) and then committing with `git cz` which will run a commit message CLI. The CLI asks a series of questions about your changeset and builds the commit message for you in the conventional commit format.

On every merge to main, our published Storybook will be updated and a new version of UIC is automatically published to npm.

### Pull Requests

Pull requests are opened to the main branch. When opening a pull request please fill out the entire pull request template which includes tagging the issue your PR is related to, a description of your PR, indicating the type of change, including details for the reviewer about how to test your PR, and a testing checklist.

When your PR is ready for review, add the `2 reviews needed` label to surface it to our internal team. If you are the first reviewer and you approve the PR, change the label to `1 review needed`, an if you request changes, change it to `needs changes`. Once a PR is ready, the second reviewer should update the PR with the `ready to merge` label. If you put up a PR that is not yet ready for eyes, add the `wip` label.

Once the PR has been approved, you should squash and merge. We often wait for the author to merge their own PR if they have the permissions to do so.

As a reviewer on a PR, try not to leave only comments, but a clear next step action. If the PR requires further discussion or changes, mark it with requested changes. If a PR looks good to you (or even if there are small changes requested that won't require an additional review from you), please mark it with approved and comment on the last few changes needed. This helps other reviewers better understand the state of PRs at the list view and prevents an additional unnecessary review cycle.

## Tailwind

- We are using the [Tailwind](https://v2.tailwindcss.com) framework to make use of their low-level utility classes in page-level markup and sometimes in components. We configure the settings in `tailwind.config.js`.

## Vendor Plugins

- [AG Grid](https://www.ag-grid.com)

## Style Conventions

- Our components are styled with SCSS files located alongside React component TS files.

- We are currently in the process of migrating components to a second-generation styling convention which relies on CSS variables for internal design tokens and removes `@apply` Tailwind statements. V2 style components are indicated in our Storybook with a :triangular_flag_on_post:.

- Bloom design tokens encompass many styles including colors, typography settings, sizes, border, + more.

- More information on this migration can be found in [V2Styles.md](https://github.com/bloom-housing/ui-components/blob/main/V2Styles.md).

### Naming Conventions

- Be wary of naming components based on content, presentation, location, or theming, as this limits the use
- Avoid including any Bloom-centered business logic in ui-components so that they may be consumed regardless of the backend implementation

### General Rules

- Don’t use IDs for styles.
- Don’t nest more than 3 layers deep.
- Don’t fix problems with !important. Use !important purposefully.
- Refrain from using overqualified selectors; div.container can simply be stated as .container.
- Use flex instead of float
- Use grid utilities for uniform grids

### Accessibility Considerations

- An A11Y test suite based on our Storybook runs on all PRs
- Checking out the Storybook AXE panel when looking at an individual component can be useful
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
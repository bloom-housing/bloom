# Contributing to Bloom

Contributions to the core Bloom applications and services are welcomed. To help us meet the project's goals around quality and maintainability, we ask that all contributors read, understand, and agree to these guidelines.

## Reporting an Issue

We use GitHub issues to track both bugs and feature ideas, and encourage all developers working with Bloom to file issues for consideration.

Please note that implementation-specific issues with individual Bloom sites should be tracked in the repositories for those sites. Our issue tracker is for issues with the core software and reference implementations only.

## Pull Requests

Pull requests (PRs) are the most effective way to make a contribution to Bloom, and can range from small one-line fixes to major feature additions. Here are some suggestions for having your pull requests quickly accepted:

- Clearly document the issue your pull request is meant to address in the initial comment, and make sure the PR title summarizes the work in a useful way. If your PR addresses a ticketed issue, make sure to link it. You do not need to have a corresponding issue before submitting a PR, but it's usually a good method of getting feedback on your approach before starting major work.

- Make sure that all files touched by your PR still pass all lint and style rules (see below). If you're adding any meaningful functionality to the system, please add matching tests -- the team will be happy to provide guidance on the most time-efficient method for test coverage.

- Since we typically will have a number of PRs open in various states of progress, please label your PR appropriately in GitHub when it's ready for review, and one or more core team members will take a look at it.

## Continuous Integration

Bloom uses GitHub Actions to automatically run tests on any pull requests. No contributions that introduce errors in existing tests will be accepted, so please make sure you see the confidence-inspiring green checkmark next to your commits before marking your PR ready for review and applying the `2 reviews needed` label.

## Linting

We use the ESlint linting system and the automatic code formatter Prettier (which the linter also enforces). **All** pull requests must pass linting to be accepted, so they don't create fix work for future contributors. If you're not using an IDE that integrates with these tools, please run eslint + prettier from the cli on all added or changed code before you submit a pull request. As much as we'll try to keep current, the linting rules can become out of date, and in this case you should file an issue with the adjustments you're looking for.

## Additional Conventions

Bloom is built as a "core" codebase forked by individual housing jurisdictions, which shapes several project-specific conventions beyond general OSS practice — how jurisdiction-specific content is handled, where translation keys live, how feature flags gate custom logic, and our accessibility bar. See the [Conventions](.github/copilot-instructions.md#conventions) section of `.github/copilot-instructions.md`, which also covers testing, translations, feature flags, and accessibility further down the same file. That file is written primarily for AI coding agents, so you can skip its setup and cloud-sandbox sections — those are specific to automated agents.

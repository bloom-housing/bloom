# Contributing to HousingBayArea and Bloom

Contributions to this Bay Area local site, as well as the core Bloom applications and services are welcomed. To help us meet the project's goals around quality and maintainability, we ask that all contributors read, understand, and agree to these guidelines.

It's important to know that this project is a local fork of the [core Bloom framework](https://github.com/bloom-housing/bloom).
If you're planning to contribute, make sure to think through if it's a Bay Area-specific set of code, in which case it should be submitted here, or if it's a general improvement to the framework that would benefit all users and should be submitted to the core upstream project.

## Reporting an Issue

We use GitHub issues to track both bugs and feature ideas, and encourage all developers working with Bloom to file issues for consideration.

This site tracks implementation-specific issues about the Bay Area sites for Alameda County, San Mateo County, and the City of San Jose only.

## Pull Requests

Pull requests (PRs) are the most effective way to make a contribution to Bloom, and can range from small one-line fixes to major feature additions. Here are some suggestions for having your pull requests quickly accepted:

- Clearly document the issue your pull request is meant to address in the initial comment, and make sure the PR title summarizes the work in a useful way. If your PR addresses an issue in the issue tracker, make sure to link it. You do not need to have a corresponding issue before submitting a PR, but it's usually a good method of getting feedback on your approach before starting major work.

- Make sure that all files touched by your PR still pass all lint and style rules (see below). If you're adding any meaningful functionality to the system, please add matching tests -- the team will be happy to provide guidance on the most time-efficient method for helping with test coverage.

- Since we typically will have a number of PRs open in various states of progress, please label your PR appropriately in GitHub when it's ready for review, and one or more core team members will take a look at it.

## Continuous Integration

Bloom uses the Circle CI system to automatically run tests on any pull requests. No contribututions that introduce errors in existing tests will be accepted, so please make sure you see the confidence-inspiring green checkmark next to your commits before marking your PR ready for review.

## Code Style

We use the ESlint linting system and the automatic code formatter Prettier (which the linter also enforces). **All** pull requests must pass linting to be accepted, so they don't create fix work for future contributors. If you're not using an IDE that integrates with these tools, please run eslint + prettier from the cli on all added or changed code before you submit a pull request.

As much as we'll try to keep current, the linting rules can become out of date, and in this case you should file an issue with the adjustments you're looking for. We'll be looking for a resulting PR with a minimum of two commits - one to adjust the rules or tooling, and another that updates the codebase to match. If the latter changes are complex, please discuss in advance and break up the work into reasonably reviewable commits.

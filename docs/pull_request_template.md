# Pull Request Template

## Issue Overview

This PR addresses #issue

- [ ] This change addresses the issue in full
- [ ] This change addresses only certain aspects of the issue
- [ ] This change is a dependency for another issue
- [ ] This change has a dependency from another issue

## Description

Please include a summary of the change and which issue(s) is addressed. Please also include relevant motivation and context. List any dependencies that are required for this change.

## How Can This Be Tested/Reviewed?

Provide instructions so we can review.

Describe the tests that you ran to verify your changes. Please also list any relevant details for your test configuration.

## Checklist:

- [ ] My code follows the style guidelines of this project
- [ ] I have added QA notes to the issue with applicable URLs
- [ ] I have performed a self-review of my own code
- [ ] I have reviewed the changes in a desktop view
- [ ] I have reviewed the changes in a mobile view
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published in downstream modules
- [ ] I have assigned reviewers
- [ ] I have run `yarn generate:client` and/or created a migration if I made backend changes that require them
- [ ] My commit message(s) is/are polished, and any breaking changes are indicated in the message and are well-described
- [ ] Commits made across packages purposefully have the same commit message/version change, else are separated into different commits

## Reviewer Notes:

Steps to review a PR:

- Read and understand the issue, and ensure the author has added QA notes
- Review the code itself from a style point of view
- Pull the changes down locally and test that the acceptance criteria is met
- Also review the acceptance criteria on the Netlify deploy preview (noting that these do not yet include any backend changes made in the PR)
- Either explicitly ask a clarifying question, request changes, or approve the PR if there are small remaining changes but the PR is otherwise good to go

## On Merge:

If you have one commit and message, squash. If you need each message to be applied, rebase and merge.

# tag-with-npm-version

[![GitHub Super-Linter](https://github.com/yieldray/tag-with-npm-version/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/yieldray/tag-with-npm-version/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/yieldray/tag-with-npm-version/actions/workflows/check-dist.yml/badge.svg)](https://github.com/yieldray/tag-with-npm-version/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/yieldray/tag-with-npm-version/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/yieldray/tag-with-npm-version/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

Use this action to automatically tag the Git repository with package.json
version

> [!CAUTION]  
> This action is intended for single repos; monorepos are not supported at the
> moment.

## Usage

```yaml
name: Tag with NPM Version

on:
  workflow_dispatch:
  push:
    branches:
      - main
    paths:
      - package.json

permissions:
  contents: write

jobs:
  tag-with-npm-version:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        id: checkout
        uses: actions/checkout@v5

      - name: Tag
        id: tag-with-npm-version
        uses: yieldray/tag-with-npm-version@main
        with:
          prefix: v
          force: true

      - name: Print version
        id: output
        run: echo "${{ steps.tag-with-npm-version.outputs.version }}"
```

## Trigger other workflows

When you use the repository's `GITHUB_TOKEN` to perform tasks, events triggered
by the `GITHUB_TOKEN`
[**will not create a new workflow run**](https://docs.github.com/en/actions/security-for-github-actions/security-guides/automatic-token-authentication#using-the-github_token-in-a-workflow).

Since there are use cases where you might want to do something after tagging,
for example, release using these actions:
[ncipollo/release-action](https://github.com/ncipollo/release-action)
[softprops/action-gh-release](https://github.com/softprops/action-gh-release)

You can refer to this discussion for a workaround:
<https://github.com/orgs/community/discussions/27028>

---

Note that this actions will output a `skip` variable, so checking this variable
can also serve as a workaround.

```yaml
- name: Tag
  id: tag
  uses: yieldray/tag-with-npm-version@main
  with:
    prefix: v
    force: true

- name: Print version
  if: steps.tag.outputs.skip == 'false'
  run: echo "${{ steps.tag.outputs.version }}"
```

Or
[reuse](https://docs.github.com/en/actions/sharing-automations/reusing-workflows)
[jobs](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/using-jobs-in-a-workflow):

```yaml
jobs:
  attempt-tag:
    runs-on: ubuntu-latest
    outputs:
      - skip: ${{ steps.tag.outputs.skip }}
      - version: ${{ steps.tag.outputs.version }}
    steps:
      - name: Tag
        id: tag
        uses: yieldray/tag-with-npm-version@main
        with:
          prefix: v
          force: true

  after-tag:
    needs: attempt-tag
    runs-on: ubuntu-latest
    if: needs.attempt-tag.outputs.skip == 'false'
    steps:
      - run: echo "${{ needs.attempt-tag.outputs.version }}"
```

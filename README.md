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
name: tag-with-npm-version

on:
  workflow_dispatch:
  push:
    branches:
      - main
    paths:
      - package.json

jobs:
  tag-with-npm-version:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        id: checkout
        uses: actions/checkout@v4

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

After tagging, you may also want to release. Checkout:  
<https://github.com/ncipollo/release-action>  
<https://github.com/softprops/action-gh-release>

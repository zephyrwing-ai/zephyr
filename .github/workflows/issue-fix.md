---
emoji: "🛠️"
description: Implement issues labeled agent:ready and open a reviewable pull request
labels: [automation, agent]
intent: Turn an authorized, well-scoped issue into verified code and a draft pull request.

on:
  issues:
    types: [labeled]
    names: [agent:ready]
    lock-for-agent: true
  reaction: "eyes"
  status-comment: true

permissions:
  contents: read
  issues: read
  pull-requests: read

engine:
  id: codex
  model: deepseek-flash
  env:
    OPENAI_BASE_URL: https://api.deepseek.com
    OPENAI_API_KEY: ${{ secrets.DEEPSEEK_API_KEY }}
    CODEX_MODEL_CATALOG: ${{ github.workspace }}/.github/codex/deepseek-models.json
  config: |
    model_catalog_json = "${CODEX_MODEL_CATALOG}"
    model_reasoning_effort = "high"
    web_search = "disabled"

models:
  default-ai-credits-pricing:
    input: 0.3
    output: 1.2

max-ai-credits: 200
max-turns: 40
timeout-minutes: 30
strict: true

runtimes:
  node:
    version: "22.22.0"

network:
  allowed:
    - defaults
    - node
    - api.deepseek.com

tools:
  github:
    mode: gh-proxy
    toolsets: [issues, pull_requests]

sandbox:
  agent:
    id: awf

safe-outputs:
  create-pull-request:
    draft: true
    base-branch: main
    labels: [agent-generated]
    reviewers: [zephyrwing-ai]
    allowed-files:
      - src/**
      - tests/**
      - docs/**
      - public/**
      - astro.config.mjs
      - tsconfig.json
    protected-files: blocked
    max-patch-files: 40
    max-patch-size: 1024
    github-token-for-extra-empty-commit: ${{ secrets.GH_AW_CI_TRIGGER_TOKEN }}
  add-comment:
    max: 3
---

# Fix An Authorized Issue

Use the triggering issue title, body, and comments as the task contract.

Read `AGENTS.md`, `README.md`, and the documentation relevant to the affected area before changing code.

## Workflow

1. Identify the expected behavior and acceptance criteria.
2. Reproduce the reported problem or inspect the feature's current implementation.
3. Diagnose the root cause and keep the change scoped to this issue.
4. Update implementation and regression tests together.
5. Run `npm test` and `npm run build`.
6. Create one draft pull request against `main`.

## Pull Request

Use the configured `create_pull_request` safe output with:

- A title that describes the user-visible outcome.
- A body containing the problem, root cause, implementation, test evidence, affected pages or routes, and any remaining external dependency.
- A `Fixes #<issue-number>` reference.
- The affected files and commands used for verification.

Visual changes include the routes that need human review. The pull request remains a draft until a maintainer confirms the rendered result.

## Boundaries

Keep code changes inside the allowed-file list. Keep dependency files, workflows, agent instructions, and repository security configuration outside the patch. When the requested fix needs one of those files, add an issue comment describing the required human decision and finish with `noop`.

Use `noop` with a short explanation when the issue already has a fix, lacks enough information to proceed, or requires a product decision that is absent from the issue.

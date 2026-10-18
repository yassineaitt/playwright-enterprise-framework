## What

<!-- One or two sentences. Link the issue if there is one. -->

## Why

## How to verify

- [ ] `npm run lint && npm run typecheck`
- [ ] `npm run test:api`
- [ ] `npm run test:smoke`

## Checklist

- [ ] Tests are tagged (`@smoke` / `@regression`) and live in the right project folder
- [ ] No new `page.waitForTimeout` or hard-coded sleeps
- [ ] Page objects expose intent, tests own the assertions

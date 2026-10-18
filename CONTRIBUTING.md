# Contributing

Thanks for taking the time. This project is small on purpose, so the bar is: every change keeps the
suite green on all three browsers and the API project, and keeps the architecture boundaries intact.

## Setup

```bash
nvm use                 # Node 22 (see .nvmrc)
npm ci                  # installs deps + Husky hooks
npm run browsers:install
cp .env.example .env    # optional, defaults work
```

## Workflow

1. Branch from `main`: `feat/<topic>`, `fix/<topic>`, `test/<topic>`, `ci/<topic>`.
2. Write the test first if the change is behavioural.
3. Run the local gate before pushing:

   ```bash
   npm run lint && npm run typecheck && npm run test:api && npm run test:smoke
   ```

4. Open a PR. CI must be green; the HTML report is attached to the run as an artifact.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/) are enforced by commitlint on
`commit-msg`. Types in use: `feat`, `fix`, `test`, `ci`, `build`, `docs`, `chore`, `refactor`.
Header ≤ 100 characters.

## Where things go

| You are adding…                           | Put it in…                  | Rule                                                                        |
| ----------------------------------------- | --------------------------- | --------------------------------------------------------------------------- |
| A page / component interaction            | `src/pages/`                | Expose intent (`addTodo`), never assertions. Locators: test id → role → CSS |
| An API endpoint                           | `src/api/booking.client.ts` | Return `APIResponse`; no status assertions in the client                    |
| A response contract                       | `src/api/schemas.ts`        | Zod schema + exported type                                                  |
| Cross-cutting setup (auth, data, cleanup) | `src/fixtures/`             | Fixtures, not `beforeEach` chains                                           |
| Test data                                 | `src/data/`                 | Builders with unique values; no shared mutable state                        |
| A UI spec                                 | `tests/ui/`                 | Import `test`/`expect` from `@fixtures/ui.fixtures`                         |
| An API spec                               | `tests/api/`                | Import from `@fixtures/api.fixtures`                                        |

## Tags

- `@smoke` – fast, must-pass-on-every-commit checks (target: < 1 min per browser).
- `@regression` – everything else that is deterministic.
- `@ui` / `@api` – layer, added automatically by the describe blocks.

A test with no tag will not run in the smoke gate. Tag it.

## Things that will be rejected in review

- `page.waitForTimeout` or any fixed sleep (ESLint fails the build).
- Assertions inside page objects or clients.
- `test.only` left behind (`forbidOnly` fails CI).
- Conditional logic inside a test body.
- Hard-coded credentials; use `.env` and `src/utils/env.ts`.

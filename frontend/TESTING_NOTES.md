# Frontend Testing Notes

## Build Process
The frontend is now built using Bun. The command `bun run build` (or `make build` within the frontend directory) successfully compiles the application.

## Unit Test Status
There are known issues with some unit tests when executed with Bun's test runner (`bun test` or `vitest` run via `bunx`). Specifically, tests for `Card.svelte` and `Modal.svelte` are failing with a `TypeError: Cannot read properties of undefined (reading 'ctx')`.

These tests were passing prior to the migration to Bun for the build and test processes. Further investigation is required to adapt the Svelte component tests or the Vitest configuration to be fully compatible with Bun's testing environment.

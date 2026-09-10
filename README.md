<div align="center">

![Inclusive Session Studio](assets/banner.svg)

# Inclusive Session Studio

**Make room for choice, calm, and predictable routines.**

[Open the live demo](https://galafis.github.io/inclusive-session-studio/) · [Technical design](docs/ARCHITECTURE.md) · [Project guide](docs/FACILITATOR.md) · [Contribute](CONTRIBUTING.md)

[![Checks](https://github.com/galafis/inclusive-session-studio/actions/workflows/ci.yml/badge.svg)](https://github.com/galafis/inclusive-session-studio/actions/workflows/ci.yml)
![License: MIT](https://img.shields.io/badge/license-MIT-52665e)
![Runtime dependencies: 0](https://img.shields.io/badge/runtime_dependencies-0-52665e)

</div>

A private browser-based planner and player for predictable, optional activities. Build a visual sequence, customize invitations, and give the participant control over pacing. Designed for inclusive educational activities with children and adults, including autistic participants.

## Why this exists

A useful activity plan should make the next step clearer while preserving the freedom to decline it. This project supports facilitators who want predictable structure, simple language, quiet presentation, and a visible way to pause or finish.

## What works today

| Capability | Implementation |
|---|---|
| Editable activity plans | Three templates, 1–12 activities, reorder controls, editable invitations, and a 20-change undo history. |
| Participant-controlled pacing | Start, pause, resume, finish an activity early, skip, or end the session. |
| Quiet defaults | Optional timer, no sounds or flashing effects, and no automatic move to the next activity. |
| Portable local plans | Device-local storage, validated JSON import/export, and a print-friendly plan. |
| Readable presentation | Now/next preview, labeled controls, optional higher contrast, and age-neutral design. |

## Try it in two minutes

1. Choose **A gentle introduction** and select an activity to edit its invitation.
2. Move or remove activities, then use **Undo change** to compare the plan.
3. Start a session, pause it, and try **Skip activity** or **End session**.
4. Export the plan to keep a copy. Suggested times never force an activity change.

## Run locally

Use **Node.js 22 or newer**. No dependency installation, keys, or account is required.

```sh
git clone https://github.com/galafis/inclusive-session-studio.git
cd inclusive-session-studio
npm test
npm start
```

Open **http://127.0.0.1:4173**. The included development server listens only on your machine. Set the `PORT` environment variable if that port is already in use. The demo is a static application; it can also be hosted by any ordinary static web server. Open it over HTTP, rather than directly from a file, so browser modules load correctly.

## Project structure

```text
src/session.js       Pure domain logic and validation
src/app.js             Browser interaction and rendering
src/browser.js         Import, export, and text escaping
test/                  Behavioral regression tests
examples/              Synthetic, versioned JSON examples
docs/                  Architecture, evaluation, and facilitator material
scripts/serve.mjs       Local static development server
.github/workflows/     Linux and Windows checks on Node 22 and 24
```

## Verification

The initial release includes **24 automated tests**. Run `npm test` for the behavioral suite or `npm run test:coverage` for a local coverage report. The workflow runs the same suite on Linux and Windows with Node 22 and 24. See [validation notes](docs/VALIDATION.md) for the tested properties and remaining review work.

## Status and boundaries

This is an educational planning application, not an assessment, diagnostic, or treatment tool. No participant study or clinical benefit is claimed. The optional robot-observation template is a written plan only; the application does not connect to or operate hardware.

This is an independent project by **Gabriel Demetrios Lafis**. It does not claim endorsement by a hardware vendor, university, emergency service, or clinical organization. Institutional contact: **gabrieldemetrioslafis@usp.br**.

## Related open projects

[Accessible Route Lab](https://github.com/galafis/accessible-route-lab) · [Rescue Scenario Lab](https://github.com/galafis/rescue-scenario-lab)

The projects form a small portfolio for accessible mobility research, rescue education, and inclusive activity planning. They share a commitment to inspectable software and clear limits on demonstrated capability.

## Contributing and license

See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md). The source and documentation are available under the [MIT license](LICENSE). Suggestions from people with lived experience and relevant practitioners are especially welcome.

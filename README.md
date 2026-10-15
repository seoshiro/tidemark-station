# Tidemark Station

An interactive coastal story: restore a lighthouse after a storm. Match three copper rotors, focus the lens and send a light code. The moving lantern connects a reversible scroll scene, a field journal and an opening Fresnel assembly. The coast and journal remain available without completing the game.

Original Canvas 2D dioramas and procedural Web Audio; Russian, English and Kazakh. Static HTML/CSS/TypeScript, no runtime dependencies, backend, analytics, paid API or remote assets. Sound is opt-in. Motion, volume and sound are independent; reduced motion removes pinning and physical movement. Native buttons, ranges, anchors and dialogs support keyboard and touch.

This standalone project has no connection to the deployment of the author's portfolio. Its local progress uses only `tidemark-*` storage keys. The “12 minutes” label is fictional atmosphere, not a countdown.

## Run

Node.js 24 was used. Install the pinned free development tools without lifecycle scripts:

```sh
npm ci --ignore-scripts
npm run dev
```

Open `http://127.0.0.1:5324/tidemark-station/`. For production, run `npm run build` then `npm run preview`. The configured static base is `/tidemark-station/`; fonts are hosted locally. `version.json` and the HTML build meta identify the exact source commit.

## Verify

```sh
npm run typecheck
npm run lint
npm test
npm run build
# Start npm run preview in another terminal, then:
npm run test:browser
```

Browser QA uses installed Chrome. On Windows the default is `C:/Program Files/Google/Chrome/Application/chrome.exe`; on Linux `/usr/bin/google-chrome`. Override with `CHROME_PATH`. Override the tested base URL with `TEST_URL`. The test suite covers all three languages at 320, 360, 390, 768 and 1440 pixels, game progression, errors, reset, reload, opt-in audio, cooldowns/polyphony, reduced motion, storage denial, keyboard, touch, orientation, journal focus and automated accessibility.

`scripts/capture.mjs` captures scene states. `scripts/record-station.mjs` records the real screen and the actual audio master into a short WebM. `scripts/verify-recording.mjs` decodes both tracks and checks signal and clipping. `scripts/prove-priority.mjs` temporarily reconstructs the pre-fix priority race, verifies failure, restores source in `finally`, rebuilds and verifies the fix. Generated evidence, media and local paths are excluded from Git.

## Deployment

The included workflow builds/tests on pushes and deploys the static output using GitHub Pages. It needs no paid service or secrets. A public repository and Pages must be configured for Actions. Deployments are confined to this project's path, `/tidemark-station/`.

See [DESIGN.md](DESIGN.md), [CREDITS.md](CREDITS.md) and [QA_REPORT.md](QA_REPORT.md). Code is MIT; original story/artwork/synthesized audio are CC0; local fonts are SIL OFL 1.1.

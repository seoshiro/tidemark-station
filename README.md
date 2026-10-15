# Tidemark Station

Version 2.0: an original voxel coastal story. Restore a block-built lighthouse after a storm: match three copper rotors, focus the lens and send a light code. One moving lantern travels from a stepped headland to a boat between three islands, a physical field journal and an opening Fresnel assembly. Optional wooden crates contain a coil, prism and chart; items fly into a persistent inventory and restore the beacon's signal crown. The main game and journal remain available without collecting them.

Original textured cubic geometry with a genuine perspective camera, software face projection and Canvas drawing; original procedural Web Audio; Russian, English and Kazakh. Static HTML/CSS/TypeScript, no runtime dependencies, backend, analytics, paid API or remote assets. On phones, large station closeups accompany native controls. Sound is opt-in. Motion, volume and sound are independent; reduced motion removes pinning and physical movement. Native buttons, ranges, anchors and dialogs support keyboard and touch.

[Play Tidemark Station](https://seoshiro.github.io/tidemark-station/)

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

`node scripts/capture.mjs v2/final` captures all required widths and scene states. `scripts/record-station.mjs` records the real screen and actual audio master into a small WebM; `scripts/verify-recording.mjs` decodes both tracks and checks signal/clipping. `scripts/profile-v2.mjs` measures render costs and frame counts. The browser suite checks actual node parameters and visibility handlers; recordings are not labelled as a listening assessment. Generated evidence, media and local paths are excluded from Git. The historical v1 priority proof remains available in the `v1.0.0` tag.

## Deployment

The included workflow builds/tests on pushes and deploys the static output using GitHub Pages. It needs no paid service or secrets. A public repository and Pages must be configured for Actions. Deployments are confined to this project's path, `/tidemark-station/`.

The verified original release is retained as `v1.0.0` at `9c01b033b5936095a2acdd360fc7ff036b1e0a6b`. To inspect it locally, create a branch from that tag and build it normally. Reverting the v2 release commit on `main` provides a deployment rollback without rewriting history.

See [REQUIREMENTS.md](REQUIREMENTS.md), [DESIGN.md](DESIGN.md), [REFERENCE_NOTES.md](REFERENCE_NOTES.md), [CREDITS.md](CREDITS.md) and [QA_REPORT.md](QA_REPORT.md). Code is MIT; original story/artwork/synthesized audio are CC0; local fonts are SIL OFL 1.1.

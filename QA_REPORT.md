# Tidemark Station 2.0.0 — QA

Verified implementation checkpoint: `c63027f1fc8f216e975a2db6dfb10421b9c1dde9`, 2026-10-15. The release documentation does not change the application assets tested below. This report covers the independent Tidemark project; no portfolio, publisher, Signal or other application is part of this revision.

## Result and scope

- Production build, strict TypeScript, ESLint and `git diff --check`: PASS.
- State/geometry tests: **11/11 PASS**. Browser tests: **44/44 PASS**, 0 skipped, 0 flaky; final local browser run 62.7 seconds.
- RU/EN/KK at 320, 360, 390, 768 and 1440 px: fonts/assets loaded, no page errors, HTTP errors or horizontal overflow in the matrix. Final scene captures also report no overflow/errors at all five widths.
- Short desktops 1280×900 and 1440×800: crate access PASS. Chrome touch/orientation 390×844 → 844×390 and 320px reduced-motion collection PASS.
- Fresh silent entry, explicit sound entry, Escape, automatic fail-open entrance and unavailable AudioContext fallback: PASS.
- Three mechanisms, invalid inputs, order independence, rapid clicks, completion, charging reset, corrupt/denied storage and reload mid-scene: PASS.
- Real crate opening, item flight, three-slot inventory, one grant per item, reverse/reload persistence, reset during pending collection and v1 save migration: PASS. Beacon completion without optional salvage: PASS.
- One courier overlay, reversible pin progress and optical opening, projected pointer proximity, keyboard equivalent, offscreen canvas pause and native journal focus/next/back/Escape: PASS.
- Automated WCAG 2 A/AA and WCAG 2.1 AA checks of the story and open journal: zero violations. This is not a complete accessibility certification or a human screen-reader assessment.

## Requirement evidence

The full 324-line brief was read before the revision; `REQUIREMENTS.md` was authored before implementation. The result index appended there distinguishes implementation evidence from environmental limits. `REFERENCE_NOTES.md` records the actual reference observations. The user's browser connection failed twice; reference movement was revisited in installed Chrome instead.

The world has actual projected 3D cuboids and original seeded pixel materials. A single lantern follows blended projected anchors from the dock, boat and mobile station closeups to the book and final optic. The desktop workshop uses 280svh and normalized reversible progress. Saved items/mechanisms are independent of scroll poses. Landing modules descend, compress, emit at most 30 dust cubes and settle. Hinged lids use a timed easing curve; they are not claimed to be a full rigid-body simulation.

All information, exploration and the main beacon game remain usable without optional salvage. Completing the optional kit restores the additional signal crown. Native HTML controls provide equivalents to every actionable canvas object.

## Three actual polish passes

| Pass | Observed defect | Correction and verification |
| --- | --- | --- |
| 1: composition / graphics | Mobile tower framing cut its base; future apparatus floated at the upper edge; the boat competed with panels. The book was hidden by its text card on phones and rectangular canvas backgrounds exposed scene edges. | Reframed/scaled the tower, reduced the workshop camera scale and drop range, hid not-yet-arriving apparatus, moved the boat's camera framing upward, separated the mobile physical book and readable text, and made the book/optic backgrounds transparent. Captured comparisons in `voxel-first`, `voxel-first-refined`, `voxel-pass1-before` and `voxel-pass1-after`. |
| 2: scroll / audio | Repainting the full textured headland on every frame cost a median 38.1ms at 390px and delayed logical activation during slow frames. The original strict rapid-click accent test failed in that heavy state. | Cached static scene snapshots/meshes/textures and kept moving layers separate. Logical collection/activation uses actual visible elapsed time; spring integration remains bounded. The same rapid-click test passes with all three climax voices. The post-master recording shows velocity-driven wind and music ducking. |
| 3: mobile / reliability | The mobile overview made individual apparatus small. The inventory covered reading space; a fractional previous-section boundary prevented quiet mode. A short desktop could put the crate near the panels. | Added larger mobile station closeups, changed active-section selection to viewport focal thresholds, compacted inventory while reading while keeping it expanded during item transfers, and moved crate controls above panels. New mobile, real-salvage and short-desktop tests pass. All important control centers are unoccluded at 320/390/768/1440 in the tested views. Before/after captures are in `voxel-pass3-before` / `voxel-pass3-after`. |

One diagnostic initially read oscillator frequency at `start()`, before a scheduled AudioParam value took effect; it incorrectly recorded 440Hz. Inspecting the live node showed 1174.66Hz. The test now checks the real current AudioParam value. Another diagnostic selector became ambiguous after adding a body scene label; it was scoped to `canvas[data-scene]`. Neither correction removes a product assertion or substitutes an audio call for listening.

## Measured rendering

The same nine-sample probe was run before and after caching. At 390px, the shore median redraw cost went from 38.1ms (p90 66.6ms) to below 0.2ms, and the frame counter advanced 8 versus 28 times during the same probe. Workshop median went from 11.2ms to 2.2ms. At 1440px, shore median went from 30.3ms to below 0.2ms; workshop from 8.6ms to 0.5ms. These are local Canvas timing samples, not compositor/encoding costs or a guarantee for physical phones.

DPR is capped at 1.25. Static geometry and 16×16 textures are reused; scene-local clocks and draw counters stop offscreen. Physics and audio simulation stop on document hiding; observers/listeners and audio resources have cleanup paths.

## Audio and recording

One opt-in AudioContext retains music, ambience and SFX buses into master. Native probes verify the silent initial state, context reuse, independent volume/motion/mute, wind attack/release from actual scroll displacement, material filters/tones, four-voice limit, cooldowns, priority climax and duck/recovery. Visibility suspend/restore passes with a controlled document visibility event.

`tidemark-voxel-with-audio.webm`: **2,024,525 bytes**, VP9 1280×900, one stereo Opus track, 48kHz, audio duration **17.64s**. It shows forward/reverse travel, opening all three crates, item flights, mechanisms, journal and activation. Source is actual Chrome screen frames plus the actual post-master Web Audio signal; there is no replacement soundtrack. Recorded application asset names are `index-BqQtUT35.js` and `index-BDiE1i4l.css`.

Decoded audio: RMS 0.0052113, peak 0.0685390, **0 clipped samples**. In the recording probe wind gain rises from 0.0205 to 0.1313 during travel; music moves from 0.45 to 0.0906 at the climax, with 3 active SFX voices and 1 context. The JS audio scheduling/contact timestamps differ by 2.6ms. This measures event scheduling, not perceived or hardware-output latency.

**Auditory quality, subjective balance and listening-based synchronization: NOT TESTED.** The recording is provided for the user to listen to.

## Limits and rollback

- Actual tab/background restoration: **NOT TESTED**. A separate headed Chrome attempt did not expose `document.hidden=true` after switching tabs, so it did not exercise that condition. The controlled visibility-handler regression passes; no actual OS-backgrounding claim is made.
- Physical Android/iPhone devices, Safari, Firefox and human screen-reader use: **NOT TESTED**. Touch, orientation and reduced motion were tested in installed Chrome emulation.
- User-browser control runtime was unavailable; installed Chrome was the documented fallback.
- Library saves are confirmed independently. Its official metadata helper cannot write local xattrs on this Windows Python runtime; no claim is made that those local xattrs were persisted.

Environment: Windows; Chrome 155.0.8059.39; Node 24.18.0; npm 12.0.1; TypeScript 5.9.3; Vite 7.3.6; Playwright 1.63.0; axe-core 4.13.0. No paid service, external runtime assets, credentials or system/security changes.

Rollback: original source `9c01b033b5936095a2acdd360fc7ff036b1e0a6b`, annotated `v1.0.0` tag and verified local bundle. Publication uses only the existing independent repository and existing Pages URL. Exact deployed SHA and CI/live readback are reported with the final delivery and exposed in `version.json`; they are not guessed in this pre-publication report.

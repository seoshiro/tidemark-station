# Tidemark Station 1.0.0 — QA

Local verification completed 2026-10-15. Standalone new game only; the author's existing portfolio, its publisher and the archived Signal project were outside this change.

## Result

- TypeScript strict check, ESLint and production build: PASS.
- Pure state tests: 6/6 PASS.
- Playwright browser tests: 29/29 PASS, 0 skipped, 0 flaky, 40.7 seconds in the final local run.
- RU/EN/KK at widths 320, 360, 390, 768 and 1440: PASS. Fonts/assets loaded, no page errors, horizontal overflow or HTTP errors in this matrix.
- Automated WCAG 2 A/AA and WCAG 2.1 AA checks on the story and open journal: no violations detected. This is not a claim of a complete accessibility audit.
- Desktop reversible progress 0 → 1 → 0.35 → 0, fast travel, reload mid-scene: PASS.
- Valid and invalid mechanism inputs, independent tasks, rapid/repeated clicks, saved completion, corrupt/denied storage, reset during charging: PASS.
- Keyboard-only completion, touch input, orientation 390×844 → 844×390, journal next/back/Escape and focus return: PASS in desktop Chrome/device emulation.
- Fresh silent entry, opt-in, fail-open entrance and unavailable Web Audio fallback: PASS.
- One AudioContext reused after mute/re-enable; volume and movement independent; air responds to actual smoothed scroll displacement; release, four-voice limit, final duck/recovery and priority accent: PASS.
- Visibility handler suspend/resume and no restore velocity spike: PASS with a controlled visibility event. Actual operating-system backgrounding is not claimed.

## Three polish passes

| Pass | Observed before | Correction and observed after |
| --- | --- | --- |
| Composition / graphics | At 390 px the lighthouse was cut low in the first viewport. Workshop labels could compete with the mechanism panels. Rotor target traces were faint. | Reduced the mobile shore from 1030 to 940 px, repositioned/scaled the tower, tightened the desktop diorama and strengthened traces. Re-captured desktop/mobile and four pinned positions. Tower and labels read clearly. Mechanism art follows the actual rotor/lens/signal state. |
| Scroll / audio | The climax could be discarded because the outgoing completion tones still occupied the SFX pool. | Priority activation now fades the outgoing voices and reserves its chord after they end. A controlled before/after browser regression reproduced **0 instead of 3** climax voices before, then **3** after, with the source restored. Reverse travel, velocity-driven air, cooldowns, volume, mute/re-enable and ducking passed. |
| Mobile / reliability | Automated checks found journal text contrast ratios 3.51:1 and 4.36:1, and 3.96:1 in its modal. Font URLs worked but produced a build warning. | Darkened journal labels/body text and modal label, corrected public-font URL handling. Final automated scans have zero violations and the build has no font warnings. All 15 width/language combinations, touch/orientation, storage denial and audio failure passed. |

Before/after screenshots, detailed browser JSON, the priority regression log, final scene captures and audio/video measurements were retained as local QA evidence, excluded from source Git. An early visibility test accidentally requested a smooth scroll after restore; it was corrected to an immediate restoration-style scroll before the final run. No product assertion was weakened.

## Recording

`tidemark-with-audio.webm`: 1,641,524 bytes, VP9 video 1280×900, one stereo Opus audio track at 48 kHz, 14.4 seconds. The video combines actual Chrome screen frames and the actual post-master Web Audio signal. No replacement soundtrack. It shows forward/reverse travel, all three mechanisms, journal and beacon activation.

Decoded audio RMS 0.005278, peak 0.051176, clipped samples 0. Actual nonzero output, stronger air during travel and music ducking were measured. **Auditory quality/listening assessment: NOT TESTED.**

## Environment and limits

Windows, Chrome 155.0.8059.39, Node 24.18.0, npm 12.0.1, TypeScript 5.9.3, Vite 7.3.6, Playwright 1.63.0 and axe-core 4.13.0. No paid service or runtime network dependency. No credentials or system configuration changed.

Not tested: physical iPhone/Android devices, Safari, Firefox, actual OS tab background/restore, human screen-reader use and auditory artistic quality. Reduced motion, touch and orientation were exercised in Chrome emulation. The game remains usable without audio or persistent storage.

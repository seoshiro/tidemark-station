# Tidemark Station

A standalone interactive coastal story. This is a new game project, not a portfolio or project catalogue. The existing seoshiro portfolio and archived Signal implementation are out of scope and must remain untouched.

The visitor arrives after a storm and restores a lighthouse before the fictional high tide. Three independently solvable mechanisms form the game loop: match copper rotors to their pale guides, focus a lens within 60–68, then repeat the visible code 1–3–2. The journal and coast are always available without solving tasks. Completion enables the beacon; reset starts a new attempt. All readings and narrative details are fictional.

## Visual system

Deep water #091c23, sea green #31554e, limestone #dce5d3, copper #e4a675 and muted mint #98c8b7. Onest UI and Manrope display are hosted locally. The world uses original geometric dioramas: a faceted stone tower with copper roof, glass lantern room, timber path, headland strata and moving water. Light arrives from upper left. Copper connects mechanisms; glass focuses light; paper provides a calm reading interval.

## Scenes and movement

The shore establishes purpose, a strong tower silhouette and an obvious descent. A travelling lantern and tensioned copper line connect it to the workshop. Desktop workshop uses one 260svh reversible pinned scene with normalized progress 0–1; mobile uses a compact diorama followed by accessible mechanism panels. A quiet journal changes the pace. The final optic assembly opens with scroll and becomes a steady beacon after activation.

Native wheel, touch, keyboard and anchors retain control. A shared RAF samples actual displacement/time, smooths velocity with 85ms attack and 380ms release and steps local damped physical reactions. Rendering is capped near 30fps and DPR 1.5. Canvas updates only when in view; all simulation pauses when hidden. Reduced motion removes pinning, parallax, physical impacts and page turns while preserving all tasks.

## Sound and state

One opt-in AudioContext has music, ambience and SFX buses into master. The score is a quiet original D/A/D procedural pad. Filtered procedural air follows smoothed scroll velocity, with moderate stereo placement and a slightly longer release. Copper turns, lens locks, signal pads, paper and final activation have distinct envelopes and event cooldowns. SFX polyphony is capped at four; activation has priority. Music ducks before the final accent, then recovers slowly. Sound/volume and motion settings are independent. Re-enable reuses the same context and sources. Unsupported audio leaves the game playable.

World state supplies active scene, progress, direction, velocity, pointer/focus proximity, mechanisms, journal, opening and activation. Persistent achievements are separate from reversible scroll state. Storage denial falls back to memory; malformed data cannot restore an unearned lit beacon.

## Reference and costs

The earlier browser study of https://datathon.com.kz/ru informed depth, continuity, pinned travel and material responses. Its code, branding, sounds and textures are not used. All new artwork and sound are authored in code. Budget 0; no accounts, keys, paid API, card trials, analytics or backend.

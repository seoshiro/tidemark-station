# v2 requirement matrix — authored before implementation

Source: the complete 324-line Library brief `libfile_2fbe4bca36dc8191995f833a9086f3d8`, read 2026-10-15, plus the user's explicit voxel revision and same-repository/same-URL deployment instructions. The matrix below was authored before implementation. The result index after it records verified coverage and explicit limits; the original plan is not itself a completion claim. Detailed findings are in QA_REPORT.md.

The target is the existing independent Tidemark Station. The cosmic portfolio, its publisher, Signal archive, AYQYN and all other projects remain outside scope. v1.0.0 is preserved at source `9c01b033b5936095a2acdd360fc7ff036b1e0a6b`, local annotated tag `v1.0.0` and verified `../tidemark-v1.0.0.bundle`.

| ID / requirement | Concrete v2 scene or mechanism | Required verification / recording |
| --- | --- | --- |
| 01. Context and purpose | Same coastal station, restore the beacon; preserve existing useful game, RU/EN/KK, local fonts and achievements | Existing regressions; live game loop; migration test |
| 02. Zero budget / static delivery | Existing Vite/TypeScript/Canvas; original geometry, generated pixel textures and synthesized sound; no runtime dependency or backend | Build, lockfile, CREDITS, network requests; free existing Pages path |
| 03. Moving reference | Revisit datathon top/down/back, slow/fast/stop/hover, book/items/sound controls where reachable | Reference captures and factual observation log; distinguish unavailable listening and user-browser failure |
| 04. First-screen composition | Large block-built headland, stepped lighthouse/copper roof, keeper's hut, dock, boat, foreground rocks, distant cliffs | First diorama 1440/390 screenshots through Library before other worlds |
| 05. Materials and original identity | Custom small pixel textures for stone, grass, copper, timber, glass and water; consistent voxel scale and upper-left lighting | Visually inspect near/far faces, shadows and texture density; credits |
| 06. Layered spatial depth | Perspective camera; far cliffs/cloud blocks, main island, near rocks/dock; unequal scroll/parallax rates | Projection unit tests and before/after scroll captures; stop/settle sample |
| 07. One continuous object | One courier lantern rendered once in a shared overlay; tracked screen anchors blend from dock to boat to journal to optic | Count one carrier; cross-section forward/reverse frames; no boundary teleport |
| 08. Reversible pinned journey | ~2.8 viewport desktop workshop; boat travels between three cubic islands, camera tracks it; p=0..1 | p=0/.2/.5/.8/1 and reverse; fastscroll/reload; no scroll trap |
| 09. Mobile counterpart | Unpinned compact world with the same three accessible mechanism stations | 320/360/390/768; touch, orientation and native scrolling |
| 10. Weight / preparation-contact-decay | Block apparatus descends, settles with a damped spring, compresses and emits bounded dust at contact; hinged lids ease open | Timed contact sound and geometry; rapid threshold reversals; reduced motion |
| 11. Scroll-driven opening / assembly | Cubic Fresnel housing separates, lens slices assemble and warm in response to scroll; reversible independently of saved work | Assembly/open values at key scroll states; reverse does not undo achievements |
| 12. Pacing and native travel | Shore → active workshop → quiet field journal → optic finale; native wheel, anchors, keys, touch | Keyboard/anchor/back/Escape; inspect text rhythm on desktop/mobile |
| 13. One source of scene state | World owns active scene, progress, direction, actual velocity, pointer, objects, items, settings and event ages | State tests and renderer/audio receive same World; one RAF |
| 14. Continuous and event audio | Wind/proximity are smoothed parameters; contact, lid, page, item and activation are discrete events | Parameter and event timing probe; no queued chatter |
| 15. Music / ambience / SFX / master | Existing single-context graph retained; original quiet tonal bed, filtered coastal air and material voices | Instrument graph; 0 contexts before opt-in; 1 after repeated toggles |
| 16. Actual scroll velocity → wind | Displacement/time normalized by viewport, capped, fast attack / longer release | Wheel, keyboard and programmatic travel; acceleration/stop/reverse audio measurements |
| 17. Material → sound | Stone contact = muted low impact; copper rotor = metallic transient; wood lid = resonant creak; glass = high ping; paper = short filtered noise; pickup = energy chime | Distinct synthesis parameters/waveforms; actual recorded track; listening not invented |
| 18. Sound variants / cooldown / priority | Small deterministic variants, per-event gates, maximum four SFX voices; climax priority | Repeatclick/threshold stress and priority regression; no growing source count |
| 19. Pointer / focus / touch | Moderate camera response; lantern proximity from its actual projected screen position; focus/touch equivalent cue | Move to projected object vs far region; keyboard focus; touch tests; mono-compatible pan |
| 20. Real optional item quest | Three salvage chests contain coil, prism and keeper's chart; opening lids, item flight and three-slot inventory | Collect all; actual item-to-slot movement in recording; core game/journal without items |
| 21. Persistence without duplication | Earned items are independent of reversible scroll; one grant each; migration, validation and reset | Spam collection, backscroll, reload mid-flight, corrupted/denied storage, reset pending pickup |
| 22. Logical climax | Restore three mechanisms; wait/duck/build/one activation accent/steady beacon. Optional recovered kit adds world details | Complete without optional quest, then full-kit run; reset while charging; video with real audio |
| 23. Silence / opt-in / fallback | Sound or silent entrance; no audio before explicit choice; fail-open loader, unavailable audio keeps play usable | Fresh session, Escape, timeout and rejected AudioContext tests |
| 24. Independent mute / volume / motion | Separate controls and persistent volume/motion; mute affects all buses, motion never silently mutes | Volume, mute before/after start, rapid off/on and paused-motion playback |
| 25. Hidden tab | Suspend graph, RAF and simulation; reset displacement clock on return | Controlled visibility test plus real tab attempt; explicitly distinguish emulation from actual OS result |
| 26. Smooth envelopes and headroom | Existing faded master, short voice envelopes and conservative gain budget | Decoded recording RMS/peak/clipping; human listening only if available |
| 27. Bounded render cost | Cached static voxel meshes/textures, camera face culling/painter order, DPR cap, bounded particles | Frame-cost samples desktop/mobile, fast travel; simplify from measured findings |
| 28. Invisible scene pause / cleanup | Scene-local clocks advance only while visible; shared overlay follows active route; observers/listeners disposed on unload | Offscreen frame counters, restore/resizing, resource lifecycle |
| 29. Reduced motion | Stable camera/object/optic states; no pinning, parallax, shake, particle or flight animation; all actions retained | Reduced-motion complete game and quest; toggle at mid-scene |
| 30. Accessible controls and Cyrillic | Native HTML equivalents for every canvas interaction, visible focus, ≥44px important touch controls; Onest/Manrope | Automated accessibility scan, keyboard-only game/loot, dialog focus/Escape; RU/EN/KK layout matrix |
| 31. Polish 1: composition/graphics | Inspect all finished worlds; fix actual scale, silhouette, empty-space, texture and text issues | Saved before/after desktop/mobile screenshots with specific defects |
| 32. Polish 2: scroll/audio | Inspect slow/fast/reverse/stop/re-entry and object contacts | Real before/after timing/velocity/voice evidence and fixed regressions |
| 33. Polish 3: mobile/reliability | Narrow widths, orientation, input, motion, silence, reset/reload/restore | Actual defects/fixes; full tests rerun after changes |
| 34. Delivery and rollback | Update existing `seoshiro/tidemark-station` and current Pages URL only after QA; retain v1 tag/bundle | Exact source/live SHA, successful existing workflow, root portfolio read-only version check |
| 35. Proof and truthful limits | Small desktop/mobile/scroll-state Library images, short real-audio recording, source archive, final QA | Confirm Library IDs, decode media, distinguish measured audio from NOT TESTED listening |

The remaining restrictions are unchanged: no paid APIs/services/card trials, no Minecraft textures/sounds/branding, no credential/security/system changes and no changes to any other project.

## Verified result index — 2026-10-15

| Matrix IDs | Result and concrete evidence |
| --- | --- |
| 01–02 | Implemented within the same project; 11 state/geometry tests, 44 browser tests, build/types/lint pass. Original geometry/textures/audio and retained font licenses are documented in CREDITS. No new runtime dependency. |
| 03 | Reference observed forward/back, slow/fast, book, inventory and opt-in controls in installed Chrome. User-browser connection and auditory inspection were unavailable; see REFERENCE_NOTES. |
| 04–06 | New first diorama was inspected at desktop/mobile and saved in Library before the other worlds. Real perspective geometry, layered terrain/sky, own pixel materials and coherent lighting are implemented. Projection invariants and final five-width captures pass. |
| 07–12 | One courier overlay and blended projected anchors, 280svh desktop pin, unpinned mobile closeups, landing/compression/dust, hinged book/lids and reversible optical assembly are implemented. Browser tests cover p=0/.2/.5/.85/1 and reverse; captures cover 0/.35/.7/1. Saved achievements survive reversal/reload. |
| 13–19 | Renderer and audio share World. Native probes test actual AudioParams/filters, proximity and keyboard cue, context reuse, velocity response, priority/cooldown and voice limits. The actual post-master track is recorded/decoded. Subjective material character, mono listening and artistic audio balance are NOT TESTED. |
| 20–24 | Real opening/flight/inventory, duplicate prevention, pending reset, persistence/migration, all three mechanisms, completion without salvage and independent audio/motion controls pass. Full-kit recording shows the additional signal crown and beacon finale. |
| 25 | Controlled visibility suspend/restore PASS. Actual tab/OS background condition NOT TESTED: the headed runtime did not report document.hidden=true after its tab switch. |
| 26–28 | Recorded output is nonzero with no clipped samples. Static caching improved the same local frame probe; offscreen draw counters stop while a visible scene continues. Cleanup is implemented and inspected. Perceived loudness and physical-device performance are NOT TESTED. |
| 29–30 | Reduced-motion game and salvage, keyboard/touch, orientation, modal focus/Escape, important control occlusion and 15 width/language combinations pass. Automated accessibility scan reports zero violations; human assistive-technology use is NOT TESTED. |
| 31–33 | Three observed-defect/fix/recheck passes are recorded with before/after captures, performance samples and regressions in QA_REPORT. Instrumentation mistakes are explicitly distinguished from application defects. |
| 34–35 | Local v1 tag/bundle and implementation checkpoint are preserved. Final source/deployment SHA, live smoke results and Library artifact identities accompany the release delivery; publication/CI success is claimed only after actual confirmation. |

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fresh, restore, rotate, powered, focus, ready, count, tap, progress, velocity, Gate, collect, boatPath, deployment } from '../src/state.ts';
import { project, box, rotated, v, type Mesh } from '../src/voxel.ts';
test('only valid mechanisms restore, including malformed and unearned completion', () => {
    assert.deepEqual(restore('{bad'), fresh());
    assert.deepEqual(restore('{"rotors":[99,0,1]}'), fresh());
    assert.equal(restore('{"rotors":[0,1,3],"lens":10,"focused":true,"signal":true,"lit":true}').lit, false);
    const q = restore('{"rotors":[0,1,3],"lens":64,"focused":true,"signal":true,"lit":true}');
    assert.equal(q.lit, true);
    assert.equal(count(q), 3);
});
test('rotor puzzle needs real rotations and cannot accrue duplicate progress', () => { let s = fresh(); assert.equal(powered(s), false); s = rotate(rotate(rotate(rotate(s, 0), 1), 2), 2); assert.equal(powered(s), true); assert.equal(count(s), 1); assert.equal(rotate(s, 0), s); assert.equal(rotate(s, 9), s); });
test('focus rejects imprecise inputs and the ready state requires all three tasks', () => { const s = fresh(); assert.equal(focus(s), s); const f = focus({ ...s, lens: 64 }); assert.equal(f.focused, true); assert.equal(ready(f), false); assert.equal(ready({ ...f, rotors: [0, 1, 3], signal: true }), true); });
test('signal prefix handles errors and restarts without a queued victory', () => { assert.deepEqual(tap(0, 0), { step: 1, correct: true }); assert.deepEqual(tap(1, 1), { step: 0, correct: false }); assert.deepEqual(tap(1, 0), { step: 1, correct: false }); assert.equal(tap(tap(tap(0, 0).step, 2).step, 1).step, 3); });
test('scroll travel reverses and clamps while speed smoothing is refresh-rate independent', () => { assert.equal(progress(-800, 2600, 1000), .5); assert.equal(progress(0, 2600, 1000), 0); assert.equal(progress(-9999, 2600, 1000), 1); let a = 0, b = 0; for (let i = 1; i <= 60; i++)
    a = velocity(a, i * 1000 / 60, (i - 1) * 1000 / 60, 1000, 1 / 60).speed; for (let i = 1; i <= 120; i++)
    b = velocity(b, i * 1000 / 120, (i - 1) * 1000 / 120, 1000, 1 / 120).speed; assert.ok(Math.abs(a - b) < .001); assert.equal(velocity(0, 0, 1000, 1000, .01).direction, -1); });
test('cooldowns prevent threshold chatter without delaying events', () => { const g = new Gate(); assert.equal(g.allow('arrival', 1, .8), true); assert.equal(g.allow('arrival', 1.2, .8), false); assert.equal(g.allow('pad', 1.2, .08), true); assert.equal(g.allow('arrival', 1.9, .8), true); });
test('salvage is granted once, serializes without respawn, and is optional for the beacon', () => { let s = fresh(); s = collect(s, 'coil'); assert.equal(s.items.length, 1); assert.equal(collect(s, 'coil'), s); s = collect(collect(s, 'prism'), 'chart'); assert.deepEqual(restore(JSON.stringify(s)).items, ['coil', 'prism', 'chart']); assert.equal(ready({ ...fresh(), rotors: [0, 1, 3], lens: 64, focused: true, signal: true }), true); });
test('legacy v1 progress migrates and duplicate/invalid salvage is sanitized', () => { const legacy = restore('{"rotors":[0,1,3],"lens":64,"focused":true,"signal":true,"lit":true}'); assert.equal(legacy.lit, true); assert.deepEqual(legacy.items, []); assert.deepEqual(restore('{"rotors":[3,0,1],"items":["coil","coil","prism","unknown",17]}').items, ['coil', 'prism']); });
test('world path and deployments are deterministic, clamp and reverse without mutating earned state', () => { assert.deepEqual(boatPath(-1), boatPath(0)); assert.deepEqual(boatPath(2), boatPath(1)); assert.equal(boatPath(.5).x, 0); assert.equal(deployment(0, 0), 0); assert.equal(deployment(1, 2), 1); assert.equal(deployment(.5, 1), 1); const s = collect(fresh(), 'prism'); for (const p of [0, .5, 1, .8, .2, 0])
    boatPath(p); assert.deepEqual(s.items, ['prism']); });
test('camera is genuinely perspective: identical objects farther away project smaller', () => { const camera = { target: v(0, 0, 0), yaw: 0, pitch: 0, distance: 20, unit: 10, cx: 0, cy: 0 }; const near = project(v(1, 0, 10), camera), far = project(v(1, 0, -10), camera); assert.equal(near.depth, 10); assert.equal(far.depth, 30); assert.ok(Math.abs(near.x / far.x - 3) < .00001); });
test('cuboid faces and hinged-book rotation retain normals and lift the pages', () => { const mesh: Mesh = []; box(mesh, 0, 0, 0, 2, .3, 3, 'paper'); assert.equal(mesh.length, 6); const turned = rotated(mesh, v(0, 0, 0), Math.PI / 2, 'z'); assert.ok(turned.some(f => f.p.some(p => p.y > 1.9))); for (const f of turned)
    assert.ok(Math.abs(Math.hypot(f.n.x, f.n.y, f.n.z) - 1) < .00001); assert.equal(mesh[0].p[0].y, .3); });

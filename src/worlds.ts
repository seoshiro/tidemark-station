import { box, render, project, terrain, transformed, rotated, v, mix, smooth, snapshot, cameraKey, type Mesh, type Camera } from './voxel.ts';
import { cached, pine, sea, crate, tiles, drawCoast, coastCamera, coastAnchor } from './coast.ts';
import { boatPath, deployment, powered, type World, type ItemId } from './state.ts';
const stops = [-11, 0, 11];
function workshopCamera(w: number, h: number, s: World): Camera { const p = s.motion ? s.progress : .5; return { target: v(mix(-5, 5, p), 4, 0), yaw: .62 + (s.motion ? Math.sin(p * Math.PI) * .08 + s.pointer.x * .02 : 0), pitch: .5, distance: 82, unit: Math.min(w / 42, h / 18), cx: w * .54, cy: h * .39 }; }
function bookCamera(w: number, h: number): Camera { return { target: v(0, 1, 0), yaw: .22, pitch: .79, distance: 65, unit: Math.min(w / 19, h / 13), cx: w * .5, cy: h * .58 }; }
function opticCamera(w: number, h: number, s: World): Camera { return { target: v(0, 6, 0), yaw: .30 + (s.motion ? s.pointer.x * .04 : 0), pitch: .16, distance: 60, unit: Math.min(w / 16, h / 16), cx: w * .5, cy: h * .49 }; }
export function cameraFor(kind: string, w: number, h: number, s: World, scroll = 0) { if (kind.startsWith('station-'))
    return { target: v(stops[Number(kind.slice(-1))], 5, 0), yaw: .55, pitch: .42, distance: 60, unit: Math.min(w / 12, h / 13), cx: w * .5, cy: h * .4 }; return kind === 'shore' ? coastCamera(w, h, s, scroll) : kind === 'workshop' ? workshopCamera(w, h, s) : kind === 'journal' ? bookCamera(w, h) : opticCamera(w, h, s); }
export function anchorFor(kind: string, w: number, h: number, s: World, scroll = 0) { if (kind === 'shore')
    return coastAnchor(w, h, s, scroll); if (kind.startsWith('station-'))
    return project(v(stops[Number(kind.slice(-1))], 6, 1), cameraFor(kind, w, h, s)); const p = boatPath(s.motion ? s.progress : .5); return project(kind === 'workshop' ? v(p.x, p.y + 2.3, p.z) : kind === 'journal' ? v(-5, 3, 5) : v(0, 6, 1.5), cameraFor(kind, w, h, s, scroll)); }
export function chestFor(id: ItemId, w: number, h: number, s: World, scroll = 0) { const kind = id === 'coil' ? 'shore' : id === 'prism' ? 'workshop' : 'journal', p = id === 'coil' ? v(-3, 3.4, 4.7) : id === 'prism' ? v(1.8, 4.3, 2.5) : v(5, 2, 4); return project(p, cameraFor(kind, w, h, s, scroll)); }
function workshopBase() { return cached('workshop-world', m => { sea(m); for (const [i, x] of stops.entries()) {
    terrain(m, x, i === 1 ? -2 : 0, 4.2, 4.1, 0);
    pine(m, x - 2.2, 2, -2, .58);
    for (let k = 0; k < 3; k++)
        box(m, x - 2 + k, 3.05, 3, 1, .15, 1, 'copper');
} terrain(m, -20, -23, 6, 4, -1, true); terrain(m, 16, -23, 8, 5, -1, true); }); }
function station(index: number, s: World) {
    const m: Mesh = [], p = s.motion ? deployment(s.progress, index) : 1, x = stops[index], drop = s.motion ? (1 - smooth(p)) * 6 : 0, age = s.landings[index], bounce = s.motion && age >= 0 ? Math.sin(age * 17) * Math.exp(-age * 6) * .3 : 0, yy = 3 + drop + bounce + (s.motion ? s.impact * .045 : 0), base: Mesh = [];
    if (p <= 0)
        return m;
    box(base, -2, 0, -1.5, 4, .5, 3, 'basalt');
    box(base, -1.5, .5, -1, 3, .4, 2, 'copper');
    if (index === 0) {
        box(base, -1.7, .9, -1.1, 3.4, 3, .8, 'darkwood');
        for (let i = 0; i < 3; i++) {
            const turn = s.save.rotors[i] * Math.PI / 2, ring: Mesh = [];
            box(ring, -.5, 1.1 + i * .8, -.15, 1, .22, .35, powered(s.save) ? 'gold' : 'copper');
            box(ring, -.2, 1.1 + i * .8, -.15, .25, .7, .35, powered(s.save) ? 'gold' : 'copper');
            m.push(...transformed(rotated(ring, v(0, 1.3 + i * .8, 0), turn, 'y'), v(x, yy, 0)));
        }
    }
    if (index === 1) {
        for (const side of [-1, 1])
            box(base, side * 1.25, .9, -.1, .3, 3.7, .4, 'copper');
        box(base, -1.4, 4.4, -.1, 2.8, .3, .4, 'copper');
        for (let i = 0; i < 5; i++) {
            const radius = .55 + i * .16, depth = (s.save.lens - 64) * .015 + i * .16;
            box(base, -radius, 2.5 - radius, depth, radius * 2, .13, .18, 'glass', .7);
            box(base, -radius, 2.5 + radius, depth, radius * 2, .13, .18, 'glass', .7);
            box(base, -radius, 2.5 - radius, depth, .13, radius * 2, .18, 'glass', .7);
            box(base, radius, 2.5 - radius, depth, .13, radius * 2, .18, 'glass', .7);
        }
        if (s.save.focused)
            box(base, -.2, 2.3, .3, .4, .5, .3, 'gold');
    }
    if (index === 2) {
        box(base, -1.3, .9, -.8, 2.6, 2.1, 1.5, 'wood');
        for (let i = 0; i < 3; i++)
            box(base, -.85 + i * .7, 2.2, .75, .3, .3, .14, s.save.signal || i < s.signalStep ? 'gold' : 'glass');
        box(base, .9, 3, -.1, .2, 3, .2, 'copper');
        box(base, -.2, 5.6, -.1, 2.4, .15, .2, 'copper');
        box(base, .8, 5, -.1, .2, 1.4, .2, 'copper');
    }
    m.push(...transformed(base, v(x, yy, index === 1 ? -2 : 0), v(1, 1 - (s.motion && age >= 0 ? Math.exp(-age * 10) * .08 : 0), 1)));
    if (s.motion && age >= 0 && age < .7) {
        for (let j = 0; j < 10; j++) {
            const a = j * 2.399, reach = age * 3.5;
            box(m, x + Math.cos(a) * reach, 3 + Math.sin(age / .7 * Math.PI) * .45, Math.sin(a) * reach, .16, .16, .16, 'stone', 1 - age / .7);
        }
    }
    return m;
}
function boat(s: World, time: number) { const p = boatPath(s.motion ? s.progress : .5), m: Mesh = [], rock = s.motion ? Math.sin(time * 1.6) * .1 + s.impact * .08 : 0; box(m, p.x - 1.3, p.y + rock, p.z - 2, .6, .8, 4, 'darkwood'); box(m, p.x + .7, p.y + rock, p.z - 2, .6, .8, 4, 'wood'); box(m, p.x - 1.3, p.y + rock, p.z + 1.6, 2.6, .8, .4, 'wood'); box(m, p.x - 1.3, p.y + rock, p.z - 2, 2.6, .8, .4, 'wood'); box(m, p.x - .8, p.y + .4 + rock, p.z - 1.6, 1.6, .2, 3.2, 'wood'); box(m, p.x - .8, p.y + 1 + rock, p.z - .2, 1.6, .2, .6, 'copper'); box(m, p.x - .1, p.y + 1.3 + rock, p.z, .2, .9, .2, 'darkwood'); return m; }
function bookMesh(s: World) {
    const m: Mesh = [];
    for (let x = -8; x < 8; x++)
        for (let z = -5; z < 6; z++)
            box(m, x, -.1, z, 1, .35, 1, 'darkwood');
    const open = s.motion ? s.bookOpen : 1;
    box(m, -.2, .3, -3, .4, .7, 7, 'copper');
    for (const side of [-1, 1]) {
        const page: Mesh = [];
        box(page, side === -1 ? -6.2 : .2, .5, -3, 6, .55, 7, 'paper');
        box(page, side === -1 ? -6.4 : .1, .35, -3.2, 6.3, .2, 7.4, 'wood');
        const hinge = side === -1 ? .1 : -.1;
        m.push(...rotated(page, v(hinge, .5, 0), side * (1 - open) * 1.35, 'z'));
    }
    for (let i = 0; i < 5; i++)
        box(m, -5 + i * .55, 1.1, -1 + ((i * 3 + s.bookPage) % 4) * .5, .8, .05, .3, 'ink');
    for (let i = 0; i < 4; i++)
        box(m, 1.2, 1.08, -1.2 + i * .8, 3.6 - ((i + s.bookPage) % 2) * .5, .05, .15, 'ink');
    crate(m, 4.9, .3, 4, s.chests.chart);
    return m;
}
function opticMesh(s: World) {
    const m: Mesh = [], open = s.motion ? s.opening : 1;
    for (let i = 0; i < 3; i++)
        box(m, -4 + i * .6, -1 + i * .5, -2.5 + i * .4, 8 - i * 1.2, .5, 5 - i * .8, 'stone');
    for (const x of [-5, 4.5])
        box(m, x, 1, -.8, .5, 10, 1.2, 'copper');
    box(m, -5, 11, -.8, 10, .5, 1.2, 'copper');
    box(m, -5, 1, -.8, 10, .5, 1.2, 'copper');
    for (let i = 0; i < 7; i++) {
        const r = 1 + i * .4, z = -1.4 + (1 - open) * (i * .8 + 1);
        box(m, -r, 6 - r, z, r * 2, .16, .22, 'glass', .78);
        box(m, -r, 6 + r, z, r * 2, .16, .22, 'glass', .78);
        box(m, -r, 6 - r, z, .16, r * 2, .22, 'glass', .78);
        box(m, r, 6 - r, z, .16, r * 2, .22, 'glass', .78);
    }
    for (const side of [-1, 1]) {
        const panel: Mesh = [];
        tiles(panel, side === -1 ? -4.5 : .2, 2, 1, 4, 8, 1, 'copper');
        const shifted = transformed(panel, v(side * open * 3, 0, 0));
        m.push(...rotated(shifted, v(side * (4.5 + open * 3), 6, 1), side * open * .6, 'y'));
    }
    if (s.charge > 0) {
        box(m, -.5, 5.5, .8, 1, 1, 1, 'gold');
        for (let i = 0; i < 6; i++)
            box(m, -.5 - i * .5, 6 - i * .35, 2 + i * 1.8, 1 + i * .8, .2 + i * .1, 1.7, 'gold', s.charge * .14);
    }
    if (s.save.items.length === 3) {
        for (let i = 0; i < 7; i++)
            box(m, -4.5 + i * 1.4, 11.6 + (i % 2) * .45, 0, .65, .6, .65, 'gold');
        for (const x of [-4.5, 4.5])
            box(m, x, 12.2, 0, .6, 1, .6, 'glass');
    }
    return m;
}
function waterMotion(ctx: CanvasRenderingContext2D, cam: Camera, time: number, s: World) { ctx.save(); ctx.fillStyle = '#89c4bb'; ctx.globalAlpha = .12; for (let i = 0; i < 14; i++) {
    const point = project(v(-18 + i * 3.2, -2.98, 5 + (i % 4) * 4 + Math.sin(time * .4 + i) * .4), cam);
    ctx.fillRect(Math.round(point.x), Math.round(point.y), 8 + (i % 3) * 5, 2);
} ctx.restore(); if (s.save.lit) {
    ctx.fillStyle = '#f3ca7833';
    for (let i = 0; i < 5; i++) {
        const p = project(v(2, -2.95, 3 + i * 2), cam);
        ctx.fillRect(p.x, p.y, 6 + i * 3, 2);
    }
} }
export function drawWorld(ctx: CanvasRenderingContext2D, w: number, h: number, s: World, kind: string, time: number, scroll: number) {
    ctx.clearRect(0, 0, w, h);
    if (kind === 'shore')
        return drawCoast(ctx, w, h, s, time, scroll);
    const cam = cameraFor(kind, w, h, s, scroll), key = cameraKey(cam);
    if (kind.startsWith('station-')) {
        const i = Number(kind.slice(-1)), signature = `${key},${JSON.stringify(s.save)},${s.signalStep},${s.impact.toFixed(2)},${s.motion},${s.landings[i] < 1 ? s.landings[i].toFixed(2) : 'settled'}`;
        const stats = snapshot(ctx, w, h, kind, signature, target => { const mesh: Mesh = []; terrain(mesh, stops[i], i === 1 ? -2 : 0, 3.8, 3.4, 0); mesh.push(...station(i, { ...s, progress: 1 })); return render(target, w, h, mesh, cam); });
        return { anchor: anchorFor(kind, w, h, s), stats };
    }
    if (kind === 'workshop') {
        const start = performance.now(), base = snapshot(ctx, w, h, 'workshop-base', key, target => { const bg = target.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#0c192d'); bg.addColorStop(1, '#173c4a'); target.fillStyle = bg; target.fillRect(0, 0, w, h); return render(target, w, h, workshopBase(), cam); });
        const mesh = [...station(0, s), ...station(1, s), ...station(2, s), ...boat(s, time)];
        crate(mesh, 1.5, 3, 2, s.chests.prism);
        const moving = render(ctx, w, h, mesh, cam);
        waterMotion(ctx, cam, time, s);
        return { anchor: anchorFor(kind, w, h, s, scroll), stats: { ...moving, faces: base.faces + moving.faces, milliseconds: performance.now() - start } };
    }
    const signature = kind === 'journal' ? `${key},${s.bookOpen.toFixed(3)},${s.bookPage},${s.chests.chart.toFixed(3)}` : `${key},${s.opening.toFixed(3)},${s.charge.toFixed(3)},${s.save.items.length}`;
    const stats = snapshot(ctx, w, h, kind, signature, target => render(target, w, h, kind === 'journal' ? bookMesh(s) : opticMesh(s), cam));
    return { anchor: anchorFor(kind, w, h, s, scroll), stats };
}
export function drawToken(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, kind: ItemId | 'lantern', angle = 0) {
    const m: Mesh = [];
    if (kind === 'lantern') {
        box(m, -.5, -.5, -.5, 1, 1, 1, 'gold');
        box(m, -.65, -.7, -.65, 1.3, .22, 1.3, 'copper');
        box(m, -.65, .5, -.65, 1.3, .22, 1.3, 'copper');
        for (const a of [-.55, .4])
            for (const b of [-.55, .4])
                box(m, a, -.5, b, .15, 1, .15, 'darkwood');
        box(m, -.2, .7, 0, .4, .4, .15, 'copper');
    }
    else if (kind === 'coil') {
        for (let i = 0; i < 3; i++)
            box(m, -.6, -.5 + i * .35, -.4, 1.2, .16, .8, 'copper');
    }
    else if (kind === 'prism') {
        box(m, -.4, -.6, -.4, .8, 1.3, .8, 'glass');
        box(m, -.25, .7, -.25, .5, .3, .5, 'gold');
    }
    else {
        box(m, -.8, -.1, -.5, 1.6, .18, 1, 'paper');
        box(m, -.5, .1, -.2, .7, .06, .1, 'ink');
    }
    const glow = ctx.createRadialGradient(x, y, 1, x, y, 45 * scale);
    glow.addColorStop(0, kind === 'lantern' ? '#ffd79140' : '#a9ecd030');
    glow.addColorStop(1, '#ffd79100');
    ctx.fillStyle = glow;
    ctx.fillRect(x - 50 * scale, y - 50 * scale, 100 * scale, 100 * scale);
    render(ctx, innerWidth, innerHeight, m, { target: v(0, 0, 0), yaw: .6 + angle, pitch: .3, distance: 25, unit: 18 * scale, cx: x, cy: y });
}

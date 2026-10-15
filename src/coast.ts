import { box, face, terrain, render, v, project, rotated, snapshot, cameraKey, type Mesh, type Camera, type Material } from './voxel.ts';
import type { World } from './state.ts';
const meshes = new Map<string, Mesh>();
export function cached(key: string, build: (mesh: Mesh) => void) { let m = meshes.get(key); if (!m) {
    m = [];
    build(m);
    meshes.set(key, m);
} return m; }
export function tiles(m: Mesh, x: number, y: number, z: number, w: number, h: number, d: number, material: Material) { for (let a = 0; a < w; a++)
    for (let b = 0; b < h; b++)
        for (let c = 0; c < d; c++)
            if (a === 0 || a === w - 1 || b === 0 || b === h - 1 || c === 0 || c === d - 1)
                box(m, x + a, y + b, z + c, 1, 1, 1, material); }
export function pine(m: Mesh, x: number, y: number, z: number, size = 1) { box(m, x, y, z, .65 * size, 4 * size, .65 * size, 'wood'); for (let i = 0; i < 3; i++)
    box(m, x - (1.6 - i * .43) * size, y + (2 + i * 1.3) * size, z - (1.6 - i * .43) * size, (3.8 - i * .9) * size, 1.5 * size, (3.8 - i * .9) * size, 'leaf'); }
function shadow(m: Mesh, x: number, y: number, z: number, w: number, d: number, reach: number) { face(m, [v(x, y, z), v(x + w, y, z), v(x + w + reach, y, z + d + reach * .4), v(x + reach, y, z + d + reach * .4)], v(0, 1, 0), 'shadow', .5); }
function lighthouse(m: Mesh) {
    tiles(m, -.5, 2.8, -3, 6, 2, 6, 'stone');
    for (let y = 5; y < 16; y++)
        for (let x = 0; x < 4; x++)
            for (let z = 0; z < 4; z++)
                if (x === 0 || x === 3 || z === 0 || z === 3) {
                    const window = (y === 7 || y === 10 || y === 13) && (x === 1 || x === 2) && z === 3;
                    box(m, x, y, z - 2, 1, 1, 1, window ? 'ink' : 'stone');
                    if (window)
                        box(m, x + .15, y + .12, z - .96, .7, .7, .12, 'gold', .75);
                }
    tiles(m, -1, 16, -3, 6, 1, 6, 'copper');
    for (const x of [-.6, 4.5])
        for (const z of [-2.6, 2.5])
            box(m, x, 17, z, .3, 2.5, .3, 'darkwood');
    for (const x of [-.5, 4.4])
        box(m, x, 17.1, -2.5, .15, 2.1, 5, 'glass', .58);
    for (const z of [-2.5, 2.4])
        box(m, -.5, 17.1, z, 5, 2.1, .15, 'glass', .58);
    box(m, 1.1, 17.3, -.8, 1.6, 1.7, 1.6, 'gold');
    for (let i = 0; i < 4; i++)
        tiles(m, -1 + i * .5, 19.5 + i * .5, -3 + i * .5, 6 - i, 1, 6 - i, 'copper');
    box(m, 1.75, 22, -.25, .5, 1, .5, 'gold');
    for (const y of [6, 9, 12, 15]) {
        box(m, -.1, y, -2.1, 4.2, .2, .18, 'copper');
        box(m, 3.93, y, -2.1, .18, .2, 4.2, 'copper');
    }
    for (const x of [-1, 4.6])
        for (let z = -3; z <= 3; z++)
            box(m, x, 17, z, .18, .9, .18, 'darkwood');
    for (const z of [-3, 2.6])
        box(m, -1, 17.9, z, 6.6, .18, .18, 'copper');
    shadow(m, 0, 3.02, 0, 4, 3, 10);
}
function hut(m: Mesh) { tiles(m, -7, 3, -2, 4, 3, 4, 'wood'); box(m, -5.8, 3, 2.02, 1.2, 2.5, .14, 'darkwood'); box(m, -6.65, 4.2, 2.1, .65, .8, .08, 'gold'); for (let i = 0; i < 3; i++)
    box(m, -8 + i * .6, 6 + i * .55, -2.7 + i * .45, 6 - i * 1.2, .6, 5.4 - i * .9, 'copper'); box(m, -4.5, 7, -1.5, .7, 2, .7, 'basalt'); shadow(m, -7, 3.03, -2, 4, 3, 4); }
export function crate(m: Mesh, x: number, y: number, z: number, open = 0) { box(m, x, y, z, 1.7, 1.2, 1.3, 'wood'); box(m, x - .05, y + .15, z + .1, 1.8, .18, 1.1, 'copper'); box(m, x + .25, y, z - .02, .22, 1.3, 1.35, 'copper'); box(m, x + 1.25, y, z - .02, .22, 1.3, 1.35, 'copper'); const lid: Mesh = []; box(lid, x, y + 1.2, z, 1.7, .3, 1.3, 'wood'); m.push(...rotated(lid, v(x, y + 1.2, z), -open * 1.8, 'x')); box(m, x + .75, y + .7, z + 1.3, .3, .45, .12, 'gold'); if (open > .2)
    box(m, x + .45, y + 1.05, z + .35, .8, .28, .6, 'ink'); }
export function sea(m: Mesh) { for (let x = -44; x < 46; x += 4)
    for (let z = -30; z < 36; z += 4)
        face(m, [v(x, -3, z), v(x + 4, -3, z), v(x + 4, -3, z + 4), v(x, -3, z + 4)], v(0, 1, 0), 'water'); }
function heroMesh() {
    return cached('hero', m => {
        sea(m);
        terrain(m, -22, -22, 8, 5, -1, true);
        terrain(m, 18, -26, 11, 5, 0, true);
        terrain(m, 0, 0, 10, 7, 0);
        lighthouse(m);
        hut(m);
        for (const [x, z, s] of [[-6, 3, 1], [7, -1, .85], [5, -5, .65], [-3, -5, .7]])
            pine(m, x, 3, z, s);
        for (let z = 6; z < 16; z++) {
            box(m, -1.7, Math.max(-.6, 2.6 - (z - 6) * .55), z, 2.4, .28, 1, 'wood');
            if (z % 3 === 0) {
                box(m, -1.8, -3, z, .25, 3, .25, 'darkwood');
                box(m, .6, -3, z, .25, 3, .25, 'darkwood');
            }
        }
        for (let z = 9; z < 16; z += 2) {
            box(m, .6, 0, z, .2, 1.4, .2, 'wood');
            box(m, -1.8, 0, z, .2, 1.4, .2, 'wood');
        }
        box(m, -1.8, 1.4, 9, .18, .15, 7, 'copper');
        box(m, .6, 1.4, 9, .18, .15, 7, 'copper');
        box(m, 2, -2, 12, 1, .65, 4, 'wood');
        box(m, 1.25, -1.35, 11.75, 2.5, .45, 4.5, 'darkwood');
        box(m, 1.2, -1, 11.7, .35, .7, 4.6, 'wood');
        box(m, 3.4, -1, 11.7, .35, .7, 4.6, 'wood');
        box(m, 1.2, -1, 11.7, 2.5, .7, .4, 'wood');
        box(m, 1.2, -1, 15.9, 2.5, .7, .4, 'wood');
        box(m, 1.55, -.95, 13.5, 1.8, .2, .65, 'copper');
        crate(m, -7.5, 3, 1);
        terrain(m, -15, 17, 4, 3, -1);
        terrain(m, 19, 16, 4, 4, 0);
    });
}
export function coastCamera(w: number, h: number, s: World, scroll: number): Camera { const mobile = w < 600; return { target: v(0, 5, s.motion ? scroll * .004 : 0), yaw: .68 + (s.motion ? s.pointer.x * .025 : 0), pitch: .5 + (s.motion ? s.pointer.y * .012 + s.velocity * .002 : 0), distance: 86, unit: mobile ? w / 28 : Math.min(w / 47, h / 30), cx: w * (mobile ? .59 : .75), cy: h * (mobile ? .77 : .68) - (s.motion ? scroll * .025 : 0) }; }
export function coastAnchor(w: number, h: number, s: World, scroll: number) { return project(v(-.5, 3.7, 10), coastCamera(w, h, s, scroll)); }
export function drawCoast(ctx: CanvasRenderingContext2D, w: number, h: number, s: World, time: number, scroll: number) {
    const camera = coastCamera(w, h, s, scroll), stats = snapshot(ctx, w, h, 'shore', `${cameraKey(camera)},${s.chests.coil.toFixed(3)}`, target => {
        const ctx = target;
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#11182d');
        bg.addColorStop(.53, '#21394a');
        bg.addColorStop(1, '#0b2738');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);
        const haze = ctx.createRadialGradient(w * .77, h * .38, 10, w * .77, h * .38, w * .48);
        haze.addColorStop(0, '#edbd7530');
        haze.addColorStop(1, '#edbd7500');
        ctx.fillStyle = haze;
        ctx.fillRect(0, 0, w, h);
        const mobile = w < 600, px = s.motion ? s.pointer.x : 0, drift = s.motion ? scroll * .006 : 0;
        ctx.fillStyle = '#b6c1bb0b';
        for (let i = 0; i < 9; i++) {
            const x = ((i * 219 + 78) % Math.max(1, w)) + px * 2, y = h * (.12 + (i % 4) * .09) - drift;
            ctx.fillRect(x, y, 100 + (i % 3) * 30, 12);
            ctx.fillRect(x + 25, y - 12, 45, 12);
        }
        ctx.fillStyle = '#d4b87c33';
        ctx.fillRect(w * .86, h * (mobile ? .55 : .2), 28, 28);
        ctx.fillStyle = '#eecf8a22';
        ctx.fillRect(w * .86 - 5, h * (mobile ? .55 : .2) - 5, 38, 38);
        const mesh = heroMesh(), extra: Mesh = [];
        crate(extra, -3.8, 2, 4, s.chests.coil);
        return render(ctx, w, h, [...mesh, ...extra], camera);
    });
    const a = coastAnchor(w, h, s, scroll);
    ctx.save();
    ctx.fillStyle = '#b1d2c7';
    ctx.globalAlpha = .12;
    for (let i = 0; i < 12; i++) {
        const p = project(v(-16 + i * 3, -2.98, 11 + (i % 3) * 3 + Math.sin(time * .4 + i) * .3), camera);
        ctx.fillRect(p.x, p.y, 7 + (i % 3) * 3, 2);
    }
    ctx.restore();
    if (s.save.lit) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = .13;
        ctx.fillStyle = '#ffe1a0';
        const lamp = project(v(2, 18, 0), camera);
        ctx.beginPath();
        ctx.moveTo(lamp.x, lamp.y);
        ctx.lineTo(w, lamp.y - 80 + Math.sin(time * .2) * 10);
        ctx.lineTo(w, lamp.y + 60);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
    return { anchor: a, stats };
}

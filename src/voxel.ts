// Original small software-3D voxel renderer. No models, textures or runtime dependencies.
export interface V3 {
    x: number;
    y: number;
    z: number;
}
export interface Point {
    x: number;
    y: number;
    depth: number;
}
export type Material = 'grass' | 'stone' | 'basalt' | 'copper' | 'wood' | 'darkwood' | 'glass' | 'gold' | 'water' | 'leaf' | 'paper' | 'ink' | 'farstone' | 'fargrass' | 'shadow';
export interface Face {
    p: V3[];
    n: V3;
    material: Material;
    alpha: number;
}
export interface Camera {
    target: V3;
    yaw: number;
    pitch: number;
    distance: number;
    unit: number;
    cx: number;
    cy: number;
}
export type Mesh = Face[];
export const v = (x: number, y: number, z: number): V3 => ({ x, y, z });
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (x: number) => { const n = Math.max(0, Math.min(1, x)); return n * n * (3 - 2 * n); };
export function project(p: V3, c: Camera): Point {
    const x = p.x - c.target.x, y = p.y - c.target.y, z = p.z - c.target.z, sy = Math.sin(c.yaw), cy = Math.cos(c.yaw), sp = Math.sin(c.pitch), cp = Math.cos(c.pitch), depth = c.distance - (x * sy + z * cy) * cp - y * sp;
    const scale = c.unit * c.distance / Math.max(2, depth);
    return { x: c.cx + (x * cy - z * sy) * scale, y: c.cy - (y * cp - (x * sy + z * cy) * sp) * scale, depth };
}
export function face(mesh: Mesh, p: V3[], n: V3, material: Material, alpha = 1) { mesh.push({ p, n, material, alpha }); }
export function box(mesh: Mesh, x: number, y: number, z: number, w: number, h: number, d: number, material: Material, alpha = 1) {
    const a = v(x, y, z), b = v(x + w, y, z), c = v(x + w, y + h, z), e = v(x, y + h, z), f = v(x, y, z + d), g = v(x + w, y, z + d), i = v(x + w, y + h, z + d), j = v(x, y + h, z + d);
    face(mesh, [e, c, i, j], v(0, 1, 0), material, alpha);
    face(mesh, [f, g, i, j], v(0, 0, 1), material, alpha);
    face(mesh, [b, g, i, c], v(1, 0, 0), material, alpha);
    face(mesh, [a, b, c, e], v(0, 0, -1), material, alpha);
    face(mesh, [a, f, j, e], v(-1, 0, 0), material, alpha);
    face(mesh, [a, b, g, f], v(0, -1, 0), material, alpha);
}
export function transformed(mesh: Mesh, offset: V3, scale: V3 = v(1, 1, 1)): Mesh { return mesh.map(f => ({ ...f, p: f.p.map(p => v(p.x * scale.x + offset.x, p.y * scale.y + offset.y, p.z * scale.z + offset.z)) })); }
export function rotated(mesh: Mesh, pivot: V3, angle: number, axis: 'x' | 'y' | 'z'): Mesh { const cs = Math.cos(angle), sn = Math.sin(angle), turn = (p: V3) => axis === 'x' ? v(p.x, p.y * cs - p.z * sn, p.y * sn + p.z * cs) : axis === 'y' ? v(p.x * cs + p.z * sn, p.y, -p.x * sn + p.z * cs) : v(p.x * cs - p.y * sn, p.x * sn + p.y * cs, p.z); return mesh.map(f => ({ ...f, n: turn(f.n), p: f.p.map(p => { const t = turn(v(p.x - pivot.x, p.y - pivot.y, p.z - pivot.z)); return v(t.x + pivot.x, t.y + pivot.y, t.z + pivot.z); }) })); }
export function terrain(mesh: Mesh, cx: number, cz: number, rx: number, rz: number, base = 0, far = false) {
    const heights = new Map<string, number>();
    for (let x = -Math.ceil(rx); x <= rx; x++)
        for (let z = -Math.ceil(rz); z <= rz; z++) {
            const r = Math.hypot(x / rx, z / rz);
            if (r < 1 + .035 * Math.sin(x * 8 + z * 13))
                heights.set(`${x},${z}`, base + Math.min(2, Math.floor((1 - r) * 3.5)));
        }
    for (const [key, h] of heights) {
        const [x, z] = key.split(',').map(Number), xx = cx + x, zz = cz + z;
        face(mesh, [v(xx, h + 1, zz), v(xx + 1, h + 1, zz), v(xx + 1, h + 1, zz + 1), v(xx, h + 1, zz + 1)], v(0, 1, 0), far ? 'fargrass' : 'grass');
        for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const adjacent = heights.get(`${x + dx},${z + dz}`) ?? base - 5;
            for (let y = Math.max(base - 4, adjacent + 1); y <= h; y++) {
                const material: Material = far ? 'farstone' : y < base - 1 ? 'basalt' : 'stone';
                const normal = v(dx, 0, dz);
                let p: V3[];
                if (dx)
                    p = [v(xx + (dx === 1 ? 1 : 0), y, zz), v(xx + (dx === 1 ? 1 : 0), y, zz + 1), v(xx + (dx === 1 ? 1 : 0), y + 1, zz + 1), v(xx + (dx === 1 ? 1 : 0), y + 1, zz)];
                else
                    p = [v(xx, y, zz + (dz === 1 ? 1 : 0)), v(xx + 1, y, zz + (dz === 1 ? 1 : 0)), v(xx + 1, y + 1, zz + (dz === 1 ? 1 : 0)), v(xx, y + 1, zz + (dz === 1 ? 1 : 0))];
                face(mesh, p, normal, material);
            }
        }
    }
}
const palettes: Record<Material, string[]> = { grass: ['#617e42', '#758b47', '#899952', '#4f703a'], stone: ['#c5c4a0', '#b1b592', '#d8d2ab', '#a1a989'], basalt: ['#304e58', '#3b5962', '#294450', '#48616a'], copper: ['#c48044', '#db9d57', '#a2673e', '#eab670'], wood: ['#8d6139', '#a57546', '#b3834e', '#714b30'], darkwood: ['#3a3531', '#514236', '#6c4f35', '#473e34'], glass: ['#4cabb0', '#72c1bd', '#3a828f', '#a3d9c3'], gold: ['#ffe1a0', '#ffc564', '#fff3b6', '#e7a852'], water: ['#164c62', '#1d5c70', '#246b7a', '#205767'], leaf: ['#346a47', '#437d4a', '#5c8e50', '#2c573c'], paper: ['#d0c398', '#e6d7ab', '#bfb489', '#ecdfbb'], ink: ['#102a38', '#173d49', '#204958', '#0c2534'], farstone: ['#355360', '#3c5e68', '#42676d', '#2e4b59'], fargrass: ['#3c6763', '#45726a', '#3a605d', '#4a766a'], shadow: ['#091e2d'] };
const textures = new Map<Material, HTMLCanvasElement>();
function texture(material: Material) {
    let canvas = textures.get(material);
    if (canvas)
        return canvas;
    canvas = document.createElement('canvas');
    canvas.width = canvas.height = 16;
    const ctx = canvas.getContext('2d')!, p = palettes[material];
    ctx.fillStyle = p[0];
    ctx.fillRect(0, 0, 16, 16);
    let seed = material.split('').reduce((s, c) => s + c.charCodeAt(0), 0) * 421;
    for (let i = 0; i < 70; i++) {
        seed = seed * 16807 % 2147483647;
        const x = seed % 16;
        seed = seed * 16807 % 2147483647;
        const y = seed % 16;
        ctx.fillStyle = p[seed % p.length];
        ctx.fillRect(x, y, material === 'wood' || material === 'darkwood' ? 1 + seed % 6 : 1 + seed % 3, material === 'water' ? 1 : 1 + seed % 2);
    }
    if (material === 'stone' || material === 'basalt') {
        ctx.fillStyle = '#263d3c35';
        ctx.fillRect(0, 15, 16, 1);
        ctx.fillRect(15, 0, 1, 16);
    }
    if (material === 'glass') {
        ctx.fillStyle = '#ddf4ce70';
        ctx.fillRect(2, 1, 1, 10);
        ctx.fillRect(4, 2, 2, 5);
    }
    textures.set(material, canvas);
    return canvas;
}
export interface RenderStats {
    faces: number;
    culled: number;
    milliseconds: number;
    textures: number;
}
const snapshots = new Map<string, {
    signature: string;
    canvas: HTMLCanvasElement;
    stats: RenderStats;
}>();
export function snapshot(ctx: CanvasRenderingContext2D, w: number, h: number, key: string, signature: string, paint: (context: CanvasRenderingContext2D) => RenderStats): RenderStats {
    const started = performance.now(), dpr = Math.min(1.25, ctx.getTransform().a), fullSignature = `${w},${h},${dpr}|${signature}`;
    let entry = snapshots.get(key);
    if (!entry || entry.signature !== fullSignature) {
        const canvas = entry?.canvas || document.createElement('canvas');
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        const target = canvas.getContext('2d')!;
        target.setTransform(dpr, 0, 0, dpr, 0, 0);
        const stats = paint(target);
        entry = { canvas, signature: fullSignature, stats };
        snapshots.set(key, entry);
    }
    ctx.drawImage(entry.canvas, 0, 0, w, h);
    return { ...entry.stats, milliseconds: performance.now() - started };
}
export function cameraKey(c: Camera) { return [c.target.x, c.target.y, c.target.z, c.yaw, c.pitch, c.unit, c.cx, c.cy].map(n => n.toFixed(3)).join(','); }
function triangle(ctx: CanvasRenderingContext2D, p: Point[], image: HTMLCanvasElement, second: boolean) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(p[0].x, p[0].y);
    ctx.lineTo(p[1].x, p[1].y);
    ctx.lineTo(p[2].x, p[2].y);
    ctx.closePath();
    ctx.clip();
    const size = 16;
    if (second)
        ctx.transform((p[1].x - p[2].x) / size, (p[1].y - p[2].y) / size, (p[2].x - p[0].x) / size, (p[2].y - p[0].y) / size, p[0].x, p[0].y);
    else
        ctx.transform((p[1].x - p[0].x) / size, (p[1].y - p[0].y) / size, (p[2].x - p[1].x) / size, (p[2].y - p[1].y) / size, p[0].x, p[0].y);
    ctx.drawImage(image, 0, 0);
    ctx.restore();
}
export function render(ctx: CanvasRenderingContext2D, w: number, h: number, mesh: Mesh, camera: Camera): RenderStats {
    const start = performance.now(), sy = Math.sin(camera.yaw), cy = Math.cos(camera.yaw), sp = Math.sin(camera.pitch), cp = Math.cos(camera.pitch), eye = v(camera.target.x + sy * cp * camera.distance, camera.target.y + sp * camera.distance, camera.target.z + cy * cp * camera.distance), drawn = [];
    for (const f of mesh) {
        const a = f.p[0];
        if (f.n.x * (eye.x - a.x) + f.n.y * (eye.y - a.y) + f.n.z * (eye.z - a.z) <= 0)
            continue;
        const p = f.p.map(v => project(v, camera));
        if (p.some(v => v.depth < 2) || p.every(v => v.x < 0) || p.every(v => v.x > w) || p.every(v => v.y < 0) || p.every(v => v.y > h))
            continue;
        drawn.push({ f, p, depth: p.reduce((s, v) => s + v.depth, 0) / 4 });
    }
    drawn.sort((a, b) => b.depth - a.depth);
    ctx.imageSmoothingEnabled = false;
    for (const { f, p, depth } of drawn) {
        ctx.save();
        ctx.globalAlpha = f.alpha;
        const img = texture(f.material);
        triangle(ctx, [p[0], p[1], p[2]], img, false);
        triangle(ctx, [p[0], p[2], p[3]], img, true);
        ctx.beginPath();
        ctx.moveTo(p[0].x, p[0].y);
        for (let i = 1; i < 4; i++)
            ctx.lineTo(p[i].x, p[i].y);
        ctx.closePath();
        const light = Math.max(.2, Math.min(1, .36 + f.n.y * .57 - f.n.x * .14 + f.n.z * .12));
        if (f.material !== 'gold' && light < 1) {
            ctx.fillStyle = `rgba(3,14,25,${1 - light})`;
            ctx.fill();
        }
        const fog = Math.max(0, Math.min(.42, (depth / camera.distance - .93) * .47));
        if (fog > .01) {
            ctx.fillStyle = `rgba(13,35,53,${fog})`;
            ctx.fill();
        }
        ctx.restore();
    }
    return { faces: drawn.length, culled: mesh.length - drawn.length, milliseconds: performance.now() - start, textures: textures.size };
}

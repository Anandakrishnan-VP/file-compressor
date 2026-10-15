// Connected, seeded sheet. Animation and export share UVs, folds and lighting.
export function seededRandom(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function fileSeed(file) {
  let hash = 2166136261;
  for (const char of `${file.name}:${file.size}:${file.lastModified}`)
    hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return hash >>> 0;
}
export function createPaperMesh(texture, seed) {
  const random = seededRandom(seed),
    cols = 8,
    rows = 10;
  const aspect = texture.width / texture.height;
  const width = Math.min(1, aspect),
    height = Math.min(1, 1 / aspect);
  const vertices = [];
  for (let row = 0; row <= rows; row++)
    for (let col = 0; col <= cols; col++) {
      const u = (col + (col && col < cols ? (random() - 0.5) * 0.5 : 0)) / cols;
      const v = (row + (row && row < rows ? (random() - 0.5) * 0.5 : 0)) / rows;
      const a = (u - 0.5) * Math.PI * 1.65,
        b = (v - 0.5) * Math.PI * 1.2;
      const radius = 0.22 + random() * 0.065;
      vertices.push({
        u,
        v,
        x: (u - 0.5) * width,
        y: (v - 0.5) * height,
        fx: Math.sin(a) * Math.cos(b) * radius + (random() - 0.5) * 0.07,
        fy: Math.sin(b) * radius * 0.89 + (random() - 0.5) * 0.055,
        fz: Math.cos(a) * Math.cos(b) * radius + (random() - 0.5) * 0.13,
        phase: random() * Math.PI * 2,
      });
    }
  const triangles = [];
  for (let row = 0; row < rows; row++)
    for (let col = 0; col < cols; col++) {
      const a = row * (cols + 1) + col,
        b = a + 1,
        c = a + cols + 1,
        d = c + 1;
      triangles.push(
        ...((row + col) % 2
          ? [
              [a, b, c],
              [b, d, c],
            ]
          : [
              [a, b, d],
              [a, d, c],
            ]),
      );
    }
  return { texture, vertices, triangles, seed };
}
export function deformVertices(mesh, progress) {
  const p = Math.max(0, Math.min(1, progress)),
    buckle = Math.sin(p * Math.PI);
  return mesh.vertices.map((v) => ({
    x: v.x * (1 - p) + v.fx * p + Math.sin(v.v * 17 + v.phase) * buckle * 0.055,
    y: v.y * (1 - p) + v.fy * p + Math.sin(v.u * 14 + v.phase) * buckle * 0.035,
    z: v.fz * p + Math.cos(v.v * 19 + v.phase) * buckle * 0.11,
  }));
}
function trianglePath(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  ctx.lineTo(points[1].x, points[1].y);
  ctx.lineTo(points[2].x, points[2].y);
  ctx.closePath();
}
function textureTriangle(ctx, texture, source, target) {
  const [s0, s1, s2] = source,
    [d0, d1, d2] = target;
  const sx1 = s1.x - s0.x,
    sy1 = s1.y - s0.y,
    sx2 = s2.x - s0.x,
    sy2 = s2.y - s0.y;
  const det = sx1 * sy2 - sx2 * sy1;
  const dx1 = d1.x - d0.x,
    dy1 = d1.y - d0.y,
    dx2 = d2.x - d0.x,
    dy2 = d2.y - d0.y;
  const a = (dx1 * sy2 - dx2 * sy1) / det,
    b = (dy1 * sy2 - dy2 * sy1) / det;
  const c = (dx2 * sx1 - dx1 * sx2) / det,
    d = (dy2 * sx1 - dy1 * sx2) / det;
  if (Math.abs(a * d - b * c) < 0.00001) return;
  ctx.save();
  trianglePath(ctx, target);
  ctx.clip();
  ctx.transform(
    a,
    b,
    c,
    d,
    d0.x - a * s0.x - c * s0.y,
    d0.y - b * s0.x - d * s0.y,
  );
  ctx.drawImage(texture, 0, 0);
  ctx.restore();
}
export function drawPaper(ctx, mesh, { x, y, size, progress = 1, alpha = 1 }) {
  if (progress <= 0.0001) {
    const aspect = mesh.texture.width / mesh.texture.height;
    const width = Math.min(1, aspect) * size,
      height = Math.min(1, 1 / aspect) * size;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.drawImage(mesh.texture, x - width / 2, y - height / 2, width, height);
    ctx.restore();
    return;
  }
  const vertices = deformVertices(mesh, progress);
  const ordered = mesh.triangles.map((ids) => ({
    ids,
    depth: ids.reduce((sum, id) => sum + vertices[id].z, 0),
  }));
  ordered.sort((a, b) => a.depth - b.depth);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  for (const { ids } of ordered) {
    const points3d = ids.map((id) => vertices[id]);
    const points = points3d.map((p) => ({ x: p.x * size, y: p.y * size }));
    const source = ids.map((id) => ({
      x: mesh.vertices[id].u * mesh.texture.width,
      y: mesh.vertices[id].v * mesh.texture.height,
    }));
    // Underpaint closes antialiasing seams between clipped facets.
    trianglePath(ctx, points);
    ctx.fillStyle = "#faf7ef";
    ctx.strokeStyle = "#e7e1d4";
    ctx.lineWidth = 0.7;
    ctx.fill();
    ctx.stroke();
    textureTriangle(ctx, mesh.texture, source, points);
    if (progress > 0) {
      const [a, b, c] = points3d;
      const ux = b.x - a.x,
        uy = b.y - a.y,
        uz = b.z - a.z;
      const vx = c.x - a.x,
        vy = c.y - a.y,
        vz = c.z - a.z;
      let nx = uy * vz - uz * vy,
        ny = uz * vx - ux * vz,
        nz = ux * vy - uy * vx;
      const length = Math.hypot(nx, ny, nz) || 1,
        flip = nz < 0 ? -1 : 1;
      nx *= flip / length;
      ny *= flip / length;
      nz *= flip / length;
      const light = -0.35 * nx - 0.5 * ny + 0.78 * nz;
      trianglePath(ctx, points);
      ctx.fillStyle =
        light < 0.55
          ? `rgba(47,39,30,${Math.min(0.55, (0.55 - light) * 0.58) * progress})`
          : `rgba(255,255,245,${(light - 0.55) * 0.35 * progress})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(56,45,30,${0.17 * progress})`;
      ctx.lineWidth = Math.max(0.45, size * 0.001);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y - 0.45);
      ctx.lineTo(points[1].x, points[1].y - 0.45);
      ctx.strokeStyle = `rgba(255,255,255,${0.42 * progress})`;
      ctx.stroke();
    }
  }
  ctx.restore();
}
export function paperBounds(mesh, progress = 1) {
  const points = deformVertices(mesh, progress);
  return {
    minX: Math.min(...points.map((p) => p.x)),
    maxX: Math.max(...points.map((p) => p.x)),
    minY: Math.min(...points.map((p) => p.y)),
    maxY: Math.max(...points.map((p) => p.y)),
  };
}
export function drawSoftShadow(ctx, x, y, width, height, opacity = 0.2) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(width, height);
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  gradient.addColorStop(0, `rgba(49,42,30,${opacity})`);
  gradient.addColorStop(1, "rgba(49,42,30,0)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

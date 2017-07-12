const defaultStyler = (ctx, pt, i) => {
  ctx.fillStyle = 'orange';
};

const defaultRadiusGenerator = (pt, i) => 2 + Math.abs(pt.s * 15);

export default function drawPoints(
  canvas,
  ctx,
  generator,
  mirrorX = false,
  mirrorY = false,
  styler = defaultStyler,
  radiusGenerator = defaultRadiusGenerator,
) {
  const timeBudget = 12;
  const trans = canvas.width / 2;
  const t0 = +new Date();
  for (let i = 0; i < 30000; i++) {
    const cp = Math.random() * Math.PI * 2;
    const pt = generator.compute(cp);
    ctx.beginPath();
    const r = radiusGenerator(pt, i);
    styler(ctx, pt, i);
    if (mirrorX && Math.random() < 0.5) {
      pt.x *= -1;
    }
    if (mirrorY && Math.random() < 0.5) {
      pt.y *= -1;
    }
    ctx.ellipse(trans + pt.x * trans, trans + pt.y * trans, r, r, 0, 0, 6.283, false);
    ctx.fill();
    const t = (+new Date()) - t0;
    if (t >= timeBudget) {
      break;
    }
  }
}

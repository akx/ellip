const defaultStyler = (ctx, pt, i) => {
  ctx.fillStyle = 'orange';
};

/*

 */

export default function drawPoints(canvas, ctx, generator, styler = defaultStyler, mirror = true) {
  const timeBudget = 12;
  const trans = canvas.width / 2;
  const t0 = +new Date();
  for (let i = 0; i < 30000; i++) {
    const cp = Math.random() * Math.PI * 2;
    const pt = generator.compute(cp);
    ctx.beginPath();
    const r = 2 + Math.abs(pt.s * 15);
    styler(ctx, pt, i);
    if (mirror && (i & 1) === 0) {
      pt.x *= -1;
    }
    ctx.ellipse(trans + pt.x * trans, trans + pt.y * trans, r, r, 0, 0, 6.283, false);
    ctx.fill();
    /*
     if (mirror) {
     ctx.beginPath();
     ctx.ellipse(trans - pt.x * trans, trans + pt.y * trans, r, r, 0, 0, 6.283, false);
     ctx.fill();
     }
     */
    const t = (+new Date()) - t0;
    if (t >= timeBudget) {
      break;
    }
  }
}

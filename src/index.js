import {dist} from './math';
import colors from './palette';
import makeGradient from './gradient';
import drawPoints from './drawer';
import CurveGenerator from './generator';

require('./style.css');


const color1 = colors[Math.floor(Math.random() * colors.length)];
const color2 = colors[Math.floor(Math.random() * colors.length)];
const gradient = makeGradient([color1, color2], 800);
const generator = new CurveGenerator();
generator.randomizeEllipse();
generator.randomizeAttractors(2, 5);

const canvas = Object.assign(document.createElement('canvas'), {
  width: 800,
  height: 800,
  style: 'border: 1px solid orange',
});
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
let currentAttractor = null;
let clearNext = true;

function translateCoords(e) {
  return {
    x: e.x / (e.target.width / 2) - 1,
    y: e.y / (e.target.height / 2) - 1,
  };
}

canvas.addEventListener('mousedown', (event) => {
  const {x, y} = translateCoords(event);
  generator.attractors.forEach((at) => {
    if (dist(x, y, at.x, at.y) < 0.05) {
      currentAttractor = at;
      if (event.metaKey) {
        currentAttractor.s *= -1;
        clearNext = true;
      }
    }
  });
});

canvas.addEventListener('mousemove', (event) => {
  if (currentAttractor === null) {
    return;
  }
  const {x, y} = translateCoords(event);
  currentAttractor.x = x;
  currentAttractor.y = y;
  clearNext = true;
});

document.body.addEventListener('mouseup', () => {
  currentAttractor = null;
});

function gradientStyler(ctx, pt) {  // eslint-disable-line no-shadow
  const colorIdx = Math.floor((pt.y + 1) / 2 * gradient.length);
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = gradient[colorIdx];
}


function step() {
  const trans = canvas.width / 2;
  if (clearNext) {
    ctx.fillStyle = '#333333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    clearNext = false;
  }
  drawPoints(canvas, ctx, generator, gradientStyler, false);
  ctx.globalAlpha = 1;
  ctx.lineWidth = 0;

  generator.attractors.forEach((attractor) => {
    ctx.strokeStyle = (attractor === currentAttractor ? 'orange' : (attractor.s < 0 ? 'purple' : 'red'));
    ctx.beginPath();
    const r = Math.abs(attractor.s) * 5;
    ctx.ellipse(trans + attractor.x * trans, trans + attractor.y * trans, r, r, 0, 0, 6.283, false);
    ctx.stroke();
  });
  requestAnimationFrame(step);
}

step();

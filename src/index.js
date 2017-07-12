import EllipApp from './app';

require('./style.css');

const app = new EllipApp();
document.body.appendChild(app.canvas);
function step() {
  app.step();
  requestAnimationFrame(step);
}
step();

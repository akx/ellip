import EllipApp from './app';
import EllipUi from './ui';
import addGithubBadge from './github-badge';

require('./style.css');

const app = new EllipApp();
document.body.appendChild(app.canvas);
function step() {
  app.step();
  requestAnimationFrame(step);
}
step();

const uiRoot = Object.assign(document.createElement('div'), {className: 'ellip-ui'});
const ui = new EllipUi(app);
document.body.appendChild(uiRoot);
ui.mount(uiRoot);

addGithubBadge('https://github.com/akx/ellip/');

import {dist} from './math';
import colors from './palette';
import makeGradient from './gradient';
import drawPoints from './drawer';
import CurveGenerator from './generator';

function translateCoords(event) {
  return {
    x: event.offsetX / (event.target.width / 2) - 1,
    y: event.offsetY / (event.target.height / 2) - 1,
  };
}

export default class EllipApp {
  constructor(width = 800, height = 800) {
    this.canvas = Object.assign(document.createElement('canvas'), {className: 'ellip-canvas'});
    this.ctx = this.canvas.getContext('2d');
    this.drawCanvas = document.createElement('canvas');
    this.drawCtx = this.drawCanvas.getContext('2d');
    this.setSize(width, height);

    this.currentAttractor = null;
    this.clearNext = true;
    this.generator = new CurveGenerator();
    this.generator.randomizeEllipse();
    this.generator.randomizeAttractors(2, 5);
    this.generateGradient();
    this.setUpManipulation(this.canvas);
    this.options = {
      mirrorX: false,
      mirrorY: false,
      drawAttractors: true,
      radiusMul: 5 / 800,
      maxRadius: 10 / 800,
    };
  }

  setUpManipulation(canvas) {
    canvas.addEventListener('mousedown', (event) => {
      const {x, y} = translateCoords(event);
      this.generator.attractors.forEach((at) => {
        if (dist(x, y, at.x, at.y) < 0.05) {
          this.currentAttractor = at;
          if (event.metaKey || event.altKey) {
            this.currentAttractor.s *= -1;
            this.clearNext = true;
          }
        }
      });
    });
    canvas.addEventListener('mousemove', (event) => {
      if (this.currentAttractor === null) {
        return;
      }
      const {x, y} = translateCoords(event);
      this.currentAttractor.x = x;
      this.currentAttractor.y = y;
      this.clearNext = true;
    })
    ;

    document.body.addEventListener('mouseup', () => {
      this.currentAttractor = null;
    });
  }

  generateGradient() {
    const color1 = colors[Math.floor(Math.random() * colors.length)];
    const color2 = colors[Math.floor(Math.random() * colors.length)];
    this.gradient = makeGradient([color1, color2], 800);
  }


  setSize(width, height) {
    Object.assign(this.canvas, {width, height});
    Object.assign(this.drawCanvas, {width, height});
    this.clearNext = true;
  }

  stepPoints() {
    if (this.clearNext) {
      this.drawCtx.clearRect(0, 0, this.drawCanvas.width, this.drawCanvas.height);
      this.clearNext = false;
    }

    const {gradient, options, drawCanvas} = this;

    function gradientStyler(ctx, pt) {
      const colorIdx = Math.floor((pt.y + 1) / 2 * gradient.length);
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = gradient[colorIdx];
    }

    function radiusGenerator(pt) {
      return Math.min(
        options.maxRadius * drawCanvas.width,
        2 + Math.abs(pt.s * options.radiusMul * drawCanvas.width)
      );
    }

    drawPoints(
      this.drawCanvas, this.drawCtx,
      this.generator,
      this.options.mirrorX,
      this.options.mirrorY,
      gradientStyler,
      radiusGenerator,
    );
  }

  drawAttractors() {
    const {ctx, canvas} = this;
    const trans = canvas.width / 2;
    ctx.globalAlpha = 1;
    ctx.lineWidth = 0;
    this.generator.attractors.forEach((attractor) => {
      ctx.strokeStyle = (attractor === this.currentAttractor ? 'orange' : (attractor.s < 0 ? 'purple' : 'red'));
      ctx.beginPath();
      const r = Math.abs(attractor.s) * 5;
      ctx.ellipse(trans + attractor.x * trans, trans + attractor.y * trans, r, r, 0, 0, 6.283, false);
      ctx.stroke();
    });
  }

  step() {
    const {ctx, canvas} = this;
    this.stepPoints();
    ctx.fillStyle = '#333333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      this.drawCanvas,
      0, 0, canvas.width, canvas.height,
      0, 0, this.drawCanvas.width, this.drawCanvas.height
    );
    ctx.filter = '';

    if (this.options.drawAttractors) {
      this.drawAttractors();
    }
  }
}

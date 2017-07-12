import {rotate, dist, normalize} from './math';

function roundFloat(f, d = 3) {
  return parseFloat(f.toFixed(d));
}

function generateAttractor() {
  return {
    x: roundFloat(-1 + Math.random() * 2),
    y: roundFloat(-1 + Math.random() * 2),
    s: roundFloat(-1 + Math.random() * 2),
  };
}

function applyAttractor(point, attractor) {
  const {x, y, s} = point;
  const dst = dist(x, y, attractor.x, attractor.y);
  const strength = 1 / dst * attractor.s * 0.2;
  const norm = normalize(x - attractor.x, y - attractor.y);
  return {
    x: x + strength * norm.x,
    y: y + strength * norm.y,
    s: s + strength,
  };
}

export default class CurveGenerator {
  constructor() {
    this.ellipse = {
      rotation: 0,
      radiusA: 0,
      radiusB: 0,
    };
    this.attractors = [];
  }

  toState() {
    return {ellipse: this.ellipse, attractors: this.attractors};
  }

  fromState(state) {
    Object.assign(this.ellipse, state.ellipse || {});
    this.attractors = Array.from(state.attractors || []);
  }

  randomizeEllipse() {
    this.ellipse.rotation = roundFloat(Math.random() * Math.PI * 2);
    this.ellipse.radiusA = roundFloat(0.3 + Math.random() * 0.7);
    this.ellipse.radiusB = roundFloat(0.3 + Math.random() * 0.7);
  }

  randomizeAttractors(minN = 0, maxN = 25) {
    this.attractors.splice(0, this.attractors.length);
    const n = minN + Math.random() * (maxN - minN);
    for (let i = 0; i < n; i++) {
      this.attractors.push(generateAttractor());
    }
  }

  compute(t) {
    const ox = Math.cos(t) * this.ellipse.radiusA;
    const oy = Math.sin(t) * this.ellipse.radiusB;
    let pt = rotate(ox, oy, this.ellipse.rotation);
    pt.s = 0;
    for (let i = 0; i < this.attractors.length; i++) {
      pt = applyAttractor(pt, this.attractors[i]);
    }
    return pt;
  }

}

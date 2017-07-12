import {rotate, dist, normalize} from './math';

function generateAttractor() {
  return {
    x: -1 + Math.random() * 2,
    y: -1 + Math.random() * 2,
    s: -1 + Math.random() * 2,
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
    this.rotation = 0;
    this.radiusA = 0;
    this.radiusB = 0;
    this.attractors = [];
  }

  randomizeEllipse() {
    this.rotation = Math.random() * Math.PI * 2;
    this.radiusA = 0.3 + Math.random() * 0.7;
    this.radiusB = 0.3 + Math.random() * 0.7;
  }

  randomizeAttractors(minN = 0, maxN = 25) {
    this.attractors.splice(0, this.attractors.length);
    const n = minN + Math.random() * (maxN - minN);
    for (let i = 0; i < n; i++) {
      this.attractors.push(generateAttractor());
    }
  }

  compute(t) {
    const ox = Math.cos(t) * this.radiusA;
    const oy = Math.sin(t) * this.radiusB;
    let pt = rotate(ox, oy, this.rotation);
    pt.s = 0;
    for (let i = 0; i < this.attractors.length; i++) {
      pt = applyAttractor(pt, this.attractors[i]);
    }
    return pt;
  }

}

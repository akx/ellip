import {rotate, dist, normalize} from './math';
import colors from './palette';
import makeGradient from './gradient';
require('./style.css');


const color1 = colors[Math.floor(Math.random() * colors.length)];
const color2 = colors[Math.floor(Math.random() * colors.length)];
const gradient = makeGradient([color1, color2], 800);

const canvas = Object.assign(document.createElement('canvas'), {
	width: 800,
	height: 800,
	style: 'border: 1px solid orange',
});
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
let currentAt = null;
let clearNext = false;

function translateCoords(e) {
	return {
		x: e.x / (e.target.width / 2) - 1,
		y: e.y / (e.target.height / 2) - 1,
	};
}

canvas.addEventListener('mousedown', (e) => {
	const {x, y} = translateCoords(e);
	console.log(e);
	ats.forEach((at) => {
		if(dist(x, y, at.x, at.y) < 0.05) {
			currentAt = at;
			if(e.metaKey) {
				currentAt.s *= -1;
				clearNext = true;
			}
		}
	});
});

canvas.addEventListener('mousemove', (e) => {
	if(currentAt === null) {
		return;
	}
	const {x, y} = translateCoords(e);
	currentAt.x = x;
	currentAt.y = y;
	if(!e.shiftKey) {
		clearNext = true;
	}
});

document.body.addEventListener('mouseup', (e) => {
	currentAt = null;
});


function genAt() {
	return {
		x: -1 + Math.random() * 2,
		y: -1 + Math.random() * 2,
		s: -1 + Math.random() * 2,
	};
}

function applyAt({x, y, s}, at) {
	const dst = dist(x, y, at.x, at.y);
	const strength = 1 / dst * at.s * 0.2	;
	const norm = normalize(x - at.x, y - at.y);
	return {
		x: x + strength * norm.x,
		y: y + strength * norm.y,
		s: s + strength,
	};
}


let rot = Math.random() * Math.PI * 2;
const radA = 0.3 + Math.random() * 0.7;
const radB = 0.3 + Math.random() * 0.7;

const ats = [];
for(var i = 0; i < Math.random() * 25; i++) {
	ats.push(genAt());
}

function compute(t) {
	const ox = Math.cos(t) * radA;
	const oy = Math.sin(t) * radB;
	let pt = rotate(ox, oy, rot);
	pt.s = 0;
	ats.forEach((at) => {
		pt = applyAt(pt, at);
	});
	return pt;
}

let dStep = 0;
const colorIdxMul = 150;

function step() {
	const trans = canvas.width / 2;
	if(clearNext) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		clearNext = false;
		dStep = 0;
	} else {
		/*
		rot += 0.01;
		ctx.globalAlpha = 0.02;
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		*/
	}

	ctx.globalAlpha = 0.9;
	const t0 = +new Date();
	for(var i = 0; i < 50000; i++) {
		const pt = compute((dStep++)/100.);
		ctx.beginPath();
		const r = 2 + Math.abs(pt.s * 15);
		/*const colorIdx = Math.floor(
			Math.min(colorIdxMul, Math.abs(pt.s * colorIdxMul)) / colorIdxMul * gradient.length
		);
		*/
		const colorIdx = Math.floor((pt.y + 1) / 2 * gradient.length);
		ctx.fillStyle = gradient[colorIdx];
		ctx.ellipse(trans + pt.x * trans, trans + pt.y * trans, r, r, 0, 0, 6.283, false);		
		ctx.fill();
		if(true) {
			ctx.beginPath();
			ctx.ellipse(trans - pt.x * trans, trans + pt.y * trans, r, r, 0, 0, 6.283, false);
			ctx.fill();
		}

		const t = (+new Date()) - t0;
		if(t >= 10) break;
	}
	ctx.globalAlpha = 1;
	ctx.lineWidth = 0;
	ats.forEach((at) => {
		ctx.strokeStyle = (at === currentAt ? 'orange' : (at.s < 0 ? 'purple' : 'red'));
		ctx.beginPath();
		const r = Math.abs(at.s) * 5;
		ctx.ellipse(trans + at.x * trans, trans + at.y * trans, r, r, 0, 0, 6.283, false);
		ctx.stroke();
	});
	requestAnimationFrame(step);
}

step();
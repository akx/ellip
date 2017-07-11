import {rotate, dist, normalize} from './math';
require('./style.css');

const colors = [
	'#06d6a0',
	'#118ab2',
	'#2274a5',
	'#2a9d8f',
	'#32936f',
	'#348aa7',
	'#525174',
	'#5bc0eb',
	'#5dd39e',
	'#9bc53d',
	'#bce784',
	'#e55934',
	'#e76f51',
	'#e83f6f',
	'#e9c46a',
	'#ef476f',
	'#f4a261',
	'#f71735',
	'#fa7921',
	'#fde74c',
	'#ffbf00',
	'#ffd166',
];
const strokeColor = colors[Math.floor(Math.random() * colors.length)];

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
	ats.forEach((at) => {
		if(dist(x, y, at.x, at.y) < 0.05) {
			currentAt = at;
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
		s: s + Math.abs(strength),
	};
}


const rot = Math.random() * Math.PI * 2;
const radA = 0.3 + Math.random() * 0.7;
const radB = 0.3 + Math.random() * 0.7;

const ats = [];
for(var i = 0; i < Math.random() * 3; i++) {
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

function step(t0=0) {
	const trans = canvas.width / 2;
	if(clearNext) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		clearNext = false;
		dStep = 0;
	}

	ctx.fillStyle = strokeColor;
	ctx.globalAlpha = 0.08;
	for(var i = 0; i < 500; i++) {
		const pt = compute((dStep++)/100.);
		ctx.beginPath();
		const r = pt.s * 15;
		ctx.ellipse(trans + pt.x * trans, trans + pt.y * trans, r, r, 0, 0, 6.283, false);
		ctx.fill();
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
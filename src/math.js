
export function rotate(x, y, a) {
	const c = Math.cos(a);
	const s = Math.sin(a);
	return {
		x: x * c - y * s,
		y: x * s + y * c,
	};
}

export function distSqr(x0, y0, x1, y1) {
	const dx = (x0 - x1);
	const dy = (y0 - y1);
	return dx * dx + dy * dy;
}

export function dist(x0, y0, x1, y1) {
	return Math.sqrt(distSqr(x0, y0, x1, y1));
}

export function normalize(x, y) {
	const dst = dist(0, 0, x, y);
	return {
		x: x / dst,
		y: y / dst,
	};
}
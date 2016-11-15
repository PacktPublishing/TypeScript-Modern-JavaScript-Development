export function flatten<U>(source: U[][]): U[] {
	return (<U[]>[]).concat(...source);
}

export function update<U extends V, V>(old: U, changes: V): U {
	const result = Object.create(Object.getPrototypeOf(old));
	for (const key of Object.keys(old)) {
		result[key] = (<any> old)[key];
	}
	for (const key of Object.keys(changes)) {
		result[key] = (<any> changes)[key];
	}
	return result;
}

export function randomInt(min: number, max: number) {
	return min + Math.floor(Math.round(
		Math.random() * (max - min + 1)
	));
}
export function chance(x: number) {
	return Math.random() < x;
}

export function square(x: number) {
	return x * x;
}
export function distance(x1: number, y1: number, x2: number, y2: number) {
	return Math.sqrt(square(x1 - x2) + square(y1 - y2));
}

export function isInt(x: number) {
	return Math.abs(Math.round(x) - x) < 0.001;
}

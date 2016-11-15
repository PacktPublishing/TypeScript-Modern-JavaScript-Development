export function factorial(x: number): number {
	if (x <= 1) return 1;
	return x * factorial(x - 1);
}

export function flatten<U>(source: U[][]) {
	return (<U[]>[]).concat(...source);
}
export function flatMap<U, V>(source: U[], callback: (value: U) => V[]): V[] {
	return flatten(source.map(callback));
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
export function updateArray<U>(array: U[], index: number, item: U) {
	return [...array.slice(0, index), item, ...array.slice(index + 1)];
}

export function rangeMap<U>(start: number, end: number, callback: (index: number) => U): U[] {
	const result: U[] = [];
	for (let i = start; i < end; i++) {
		result[i] = callback(i);
	}
	return result;
}

export function flatten<U>(array: U[][]) {
	return (<U[]>[]).concat(...array);
}

export function arrayModify<U>(array: U[], index: number, newValue: U) {
	return array.map((oldValue, currentIndex) =>
		currentIndex === index ? newValue : oldValue);
}

export function randomInt(max: number) {
	return Math.floor(Math.random() * max);
}

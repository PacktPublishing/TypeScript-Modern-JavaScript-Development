export const enum KeyEventKind {
	Press,
	Release
}
export class KeyEvent {
	constructor(
		public kind: KeyEventKind,
		public keyCode: number
	) {}
}

export function createEventSource(element: HTMLElement) {
	let queue: KeyEvent[] = [];

	const handleKeyEvent = (kind: KeyEventKind) => (e: KeyboardEvent) => {
		e.preventDefault();
		queue.push(new KeyEvent(
			kind,
			e.keyCode
		));
	};
	const keypress = handleKeyEvent(KeyEventKind.Press);
	const keyup = handleKeyEvent(KeyEventKind.Release);
	element.addEventListener("keydown", keypress);
	element.addEventListener("keyup", keyup);
	function events() {
		const result = queue;
		queue = [];
		return result;
	}
	return events;
}

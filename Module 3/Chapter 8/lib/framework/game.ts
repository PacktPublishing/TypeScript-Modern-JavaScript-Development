import { Picture } from "./picture";
import { drawPicture } from "./draw";
import { createEventSource, KeyEvent } from "./event";

export function game<UState>(
	canvas: HTMLCanvasElement,
	eventElement: HTMLElement,
	fps: number,
	state: UState,
	drawState: (state: UState, width: number, height: number) => Picture,
	timeHandler: (state: UState) => UState = x => x,
	eventHandler: (state: UState, event: KeyEvent) => UState) {

	const eventSource = createEventSource(eventElement);

	const context = canvas.getContext("2d")!;
	
	setInterval(step, 1000 / fps);

	let drawAnimationFrame = -1;
	draw();

	function step() {
		let previous = state;
		for (const event of eventSource()) {
			state = eventHandler(state, event);
		}
		state = timeHandler(state);
		if (previous !== state && drawAnimationFrame === -1) {
			drawAnimationFrame = requestAnimationFrame(draw);
		}
	}
	function draw() {
		drawAnimationFrame = -1;
		const { width, height } = canvas;

		context.clearRect(0, 0, width, height);

		context.save();
		context.translate(Math.round(width / 2), Math.round(height / 2));
		context.scale(1, -1);

		drawPicture(context, drawState(state, width, height));

		context.restore();
	}
}

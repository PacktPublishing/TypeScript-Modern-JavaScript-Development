import { Picture, Rectangle, RectangleOutline, Circle, CircleOutline, Line, Text, Color, Translate, Rotate, Scale, Pictures, Path } from "./picture";

export function drawPicture(context: CanvasRenderingContext2D, item: Picture) {
	context.save();
	if (item instanceof RectangleOutline) {
		const { x, y, width, height, thickness } = item;
		context.strokeRect(x - width / 2, y - height / 2, width, height);
	} else if (item instanceof Rectangle) {
		const { x, y, width, height } = item;
		context.fillRect(x - width / 2, y - height / 2, width, height);
	} else if (item instanceof CircleOutline || item instanceof Circle) {
		const { x, y, width, height } = item;
		if (width !== height) {
			context.scale(1, height / width);
		}
		context.beginPath();
		context.arc(x, y, width / 2, 0, Math.PI * 2);
		context.closePath();
		if (item instanceof CircleOutline) {
			context.lineWidth = item.thickness;
			context.stroke();
		} else {
			context.fill();
		}
	} else if (item instanceof Line) {
		const { path, thickness } = item;
		context.lineWidth = thickness;
		context.beginPath();
		if (path.length === 0) return;
		const [head, ...tail] = path;
		const [headX, headY] = head;
		context.moveTo(headX, headY);
		for (const [x, y] of tail) {
			context.lineTo(x, y);
		}
		context.stroke();
	} else if (item instanceof Text) {
		const { text, font } = item;
		context.scale(1, -1);
		context.font = font;
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillText(text, 0, 0);
	} else if (item instanceof Color) {
		const { color, picture } = item;
		context.fillStyle = color;
		context.strokeStyle = color;
		drawPicture(context, picture);
	} else if (item instanceof Translate) {
		const { x, y, picture } = item;
		context.translate(x, y);
		drawPicture(context, picture);
	} else if (item instanceof Rotate) {
		const { angle, picture } = item;
		context.rotate(angle);
		drawPicture(context, picture);
	} else if (item instanceof Scale) {
		const { x, y, picture } = item;
		context.scale(x, y);
		drawPicture(context, picture);
	} else if (item instanceof Pictures) {
		const { pictures } = item;
		for (const picture of pictures) {
			drawPicture(context, picture);
		}
	}
	context.restore();
}

function drawPath(context: CanvasRenderingContext2D, path: Path) {
	context.beginPath();
	if (path.length === 0) return;
	const [head, ...tail] = path;
	const [headX, headY] = head;
	context.moveTo(headX, headY);
	for (const point of tail) {
		const [x, y] = point;
		context.lineTo(x, y);
	}
}

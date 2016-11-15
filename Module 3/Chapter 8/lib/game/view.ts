import { State, Level, Object, Wall, Side, Menu } from "./model";
import { Picture, Pictures, Translate, Scale, Rotate, Rectangle, Line, Circle, Color, Text, Empty } from "../framework/picture";

const font = "Arial";

export function draw(state: State, width: number, height: number) {
	return new Pictures([
		drawLevel(state.level, width, height),
		drawMenu(state.menu, width, height)
	]);
}
function drawLevel(level: Level, width: number, height: number) {
	const scale = Math.min(width / (level.width + 1), height / (level.height + 1));
	return new Scale(scale, scale,
		new Translate(-level.width / 2 + 0.5, -level.height / 2 + 0.5, new Pictures([
			drawObjects(level.walls, drawWall),
			drawObjects(level.walls, drawWallLines),
			drawObjects(level.dots, drawDot),
			drawObjects(level.enemies, drawEnemy),
			drawObject(drawPlayer)(level.player)
		]))
	);
	
	function drawObject<U extends Object>(callback: (item: U) => Picture) {
		return (item: U) =>
			new Translate(item.x, item.y, callback(item));
	}
	function drawObjects<U extends Object>(items: U[], callback: (item: U) => Picture) {
		return new Pictures(items.map(drawObject(callback)));
	}
}
function drawMenu(menu: Menu | undefined, width: number, height: number): Picture {
	if (menu === undefined) return new Empty();
	const selected = menu.selected;
	const background = new Color("rgba(40,40,40,0.8)", new Rectangle(0, 0, width, height));
	const title = new Translate(0, 200, new Scale(4, 4,
		new Color("#fff", new Text(menu.title, font))
	));
	const options = new Pictures(menu.options.map(showOption));

	return new Pictures([background, title, options]);

	function showOption(item: [string, (state: State) => State], index: number) {
		const isSelected = index === selected;
		return new Translate(0, 100 - index * 50, new Pictures([
			new Color(isSelected ? "#ff0000" : "#000000",
				new Rectangle(0, 0, 200, 40)),
			new Color(isSelected ? "#000000" : "#ffffff",
				new Scale(1.6, 1.6, new Text(item[0], font)))
		]));
	}
}
function drawWall() {
	return new Color("#111", new Rectangle(0, 0, 1, 1));
}
const leftTop: [number, number] = [-0.5, 0.5];
const leftBottom: [number, number] = [-0.5, -0.5];
const rightTop: [number, number] = [0.5, 0.5];
const rightBottom: [number, number] = [0.5, -0.5];
const wallLines: [Side, Line][] = [
	[Side.Left, new Line([leftTop, leftBottom], 0.1)],
	[Side.Right, new Line([rightTop, rightBottom], 0.1)],
	[Side.Top, new Line([leftTop, rightTop], 0.1)],
	[Side.Bottom, new Line([leftBottom, rightBottom], 0.1)]
];
function drawWallLines({ neighbours }: Wall) {
	const lines = wallLines
		.filter(([side]) => (side & neighbours) === 0)
		.map(([side, line]) => line);
	return new Color("#0021b3", new Pictures(lines));
}
function drawDot() {
	return new Color("#f0c0a8", new Circle(0, 0, 0.2, 0.2));
}
function drawPlayer() {
	return new Color("#ffff00", new Circle(0, 0, 0.8, 0.8));
}
function drawEnemy() {
	const shape = new Color("#ff0000", new Pictures([
		new Circle(0, 0.15, 0.6),
		new Rectangle(0, -0.05, 0.6, 0.4),
		new Translate(-0.15, -0.25,
			new Rotate(Math.PI / 4, new Rectangle(0, 0, 0.2, Math.SQRT2 * 0.15))),
		new Translate(0.15, -0.25,
			new Rotate(Math.PI / 4, new Rectangle(0, 0, 0.2, Math.SQRT2 * 0.15)))
	]));
	const eyes = new Color("#fff", new Pictures([
		new Circle(-0.12, 0.15, 0.2),
		new Circle(0.12, 0.15, 0.2)
	]));
	const pupils = new Color("#000", new Pictures([
		new Circle(-0.12, 0.15, 0.06),
		new Circle(0.12, 0.15, 0.06)
	]));
	return new Pictures([shape, eyes, pupils]);
}

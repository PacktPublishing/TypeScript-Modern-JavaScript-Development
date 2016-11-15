export type Picture
	= Empty
	| Rectangle
	| RectangleOutline
	| Circle
	| CircleOutline
	| Line
	| Text
	| Color
	| Translate
	| Rotate
	| Scale
	| Pictures;

export class Empty {
	__emptyBrand: void;
}
export class Rectangle {
	__rectangleBrand: void;

	constructor(
		public x = 0,
		public y = 0,
		public width = 1,
		public height = width
	) {}
}
export class RectangleOutline {
	__rectangleOutlineBrand: void;

	constructor(
		public x = 0,
		public y = 0,
		public width = 1,
		public height = width,
		public thickness = 1
	) {}
}
export class Circle {
	__circleBrand: void;

	constructor(
		public x = 0,
		public y = 0,
		public width = 1,
		public height = width
	) {}
}
export class CircleOutline {
	__circleOutlineBrand: void;

	constructor(
		public x = 0,
		public y = 0,
		public width = 1,
		public height = width,
		public thickness = 1
	) {}
}
export type Point = [number, number];
export type Path = Point[];
export class Line {
	__lineBrand: void;

	constructor(
		public path: Path,
		public thickness: number
	) {}
}
export class Text {
	__textBrand: void;

	constructor(
		public text: string,
		public font: string
	) {}
}

export class Color {
	__colorBrand: void;

	constructor(
		public color: string,
		public picture: Picture
	) {}
}
export class Translate {
	__translateBrand: void;

	constructor(
		public x: number,
		public y: number,
		public picture: Picture
	) {}
}
export class Rotate {
	__rotateBrand: void;

	constructor(
		public angle: number,
		public picture: Picture
	) {}
}
export class Scale {
	__scaleBrand: void;

	constructor(
		public x: number,
		public y: number,
		public picture: Picture
	) {}
}
export class Pictures {
	__picturesBrand: void;

	constructor(
		public pictures: Picture[]
	) {}
}

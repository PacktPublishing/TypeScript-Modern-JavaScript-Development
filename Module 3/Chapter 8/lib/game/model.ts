import { flatten, update, isInt } from "./utils";

export enum Difficulty {
	Easy,
	Hard,
	Extreme
}
export enum Movement {
	None = 0,
	Left = 1,
	Right = -1,
	Top = 2,
	Bottom = -2
}
export function isOppositeMovement(a: Movement, b: Movement) {
	return a + b === 0;
}

export enum Side {
	Left = 1 << 0,
	Right = 1 << 1,
	Top = 1 << 2,
	Bottom = 1 << 3,
	LeftTop = 1 << 4,
	RightTop = 1 << 5,
	LeftBottom = 1 << 6,
	RightBottom = 1 << 7
}

export interface Object {
	x: number;
	y: number;
}
export interface Enemy extends Object {
	toX: number;
	toY: number;
}

export interface Wall extends Object {
	neighbours: Side;
}

export interface Level {
	walls: Wall[];
	dots: Object[];
	enemies: Enemy[];
	player: Object;
	width: number;
	height: number;
	inputMovement: Movement;
	currentMovement: Movement;
	difficulty: Difficulty;
}

const defaultLevel = parseLevel([
	"WWWWWWWWWWWWWWW",
	"W....E........W",
	"W.WWWWW.WWWWW.W",
	"W.W...W.W...W.W",
	"WE..W.....W...W",
	"W.W...W.W...W.W",
	"W.WWWWW.WWWWW.W",
	"W.............W",
	"WWWW.WW WW.WWWW",
	"W....W   W....W",
	"W.WW.W P W.WW.W",
	"W.WW.WW WW.WWEW",
	"W.............W",
	"WWWWWWWWWWWWWWW"
]);

function parseLevel(data: string[]): Level {
	const grid = data.map(row => row.split(""));
	
	return {
		walls: mapBoard(toWall),
		dots: mapBoard(toObject(".")),
		enemies: mapBoard(toEnemy),
		player: mapBoard(toObject("P"))[0],
		width: grid[0].length,
		height: grid.length,
		inputMovement: Movement.None,
		currentMovement: Movement.None,
		difficulty: Difficulty.Easy
	};

	function mapBoard<U>(callback: (field: string, x: number, y: number) => U | undefined): U[] {
		const mapped = grid.map((row, y) => row.map((field, x) => callback(field, x, y)));
		return flatten(mapped).filter(item => item !== undefined) as U[];
	}
	function toObject(kind: string) {
		return (value: string, x: number, y: number) => {
			if (value !== kind) return undefined;
			return { x, y };
		}
	}
	function get(x: number, y: number) {
		const row = grid[y];
		if (!row) return undefined;
		return row[x];
	}
	function toWall(kind: string, x: number, y: number): Wall | undefined {
		if (kind !== "W") return undefined;
		let neighbours: Side = 0;
		if (get(x - 1, y) === "W") neighbours |= Side.Left;
		if (get(x + 1, y) === "W") neighbours |= Side.Right;
		if (get(x, y - 1) === "W") neighbours |= Side.Bottom;
		if (get(x, y + 1) === "W") neighbours |= Side.Top;
		if (get(x - 1, y - 1) === "W") neighbours |= Side.LeftBottom;
		if (get(x - 1, y + 1) === "W") neighbours |= Side.LeftTop;
		if (get(x + 1, y - 1) === "W") neighbours |= Side.RightBottom;
		if (get(x + 1, y + 1) === "W") neighbours |= Side.RightTop;
		
		return {
			x,
			y,
			neighbours
		}
	}
	function toEnemy(kind: string, x: number, y: number) {
		if (kind !== "E") return undefined;
		return {
			x,
			y,
			toX: x,
			toY: y
		};
	}
}

export function onGrid({ x, y }: Object) {
	return isInt(x) && isInt(y);
}

export interface Menu {
	title: string;
	options: [string, (state: State) => State][];
	selected: number;
}
export interface State {
	menu: Menu | undefined;
	level: Level;
}

const startGame = (difficulty: Difficulty) => (state: State) => ({
	menu: undefined,
	level: update(defaultLevel, { difficulty })
});

export const menuMain: Menu = {
	title: "Pac Man",
	options: [
		["Easy", startGame(Difficulty.Easy)],
		["Hard", startGame(Difficulty.Hard)],
		["Extreme", startGame(Difficulty.Extreme)]
	],
	selected: 0
}
export const menuWon: Menu = {
	title: "You won!",
	options: [
		["Back", state => ({ menu: menuMain, level: state.level })]
	],
	selected: 0
}
export const menuLost: Menu = {
	title: "Game over!",
	options: [
		["Back", state => ({ menu: menuMain, level: state.level })]
	],
	selected: 0
}

export const defaultState: State = {
	menu: menuMain,
	level: defaultLevel
};

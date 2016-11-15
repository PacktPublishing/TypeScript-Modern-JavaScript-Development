import { flatten, arrayModify } from "./utils";

export type Grid = Player[][];
export enum Player {
	Player1 = 1,
	Player2 = -1,
	None = 0
}

export function getOpponent(player: Player): Player {
	return -player;
}

export type Index = [number, number];

export function get(grid: Grid, [rowIndex, columnIndex]: Index) {
	const row = grid[rowIndex];
	if (!row) return undefined;
	return row[columnIndex];
}
export function set(grid: Grid, [row, column]: Index, value: Player) {
	return arrayModify(grid, row,
		arrayModify(grid[row], column, value)
	);
}

function showPlayer(player: Player) {
	switch (player) {
		case Player.Player1:
			return "X";
		case Player.Player2:
			return "O";
		default:
			return " ";
	}
}
const concat = (separator: string) => (left: string, right: string) =>
	left + separator + right;
function showRow(row: Player[]) {
	return row.map(showPlayer).reduce(concat("|"));
}
export function showGrid(grid: Grid) {
	const separator = "\n" + grid[0].map(() => "-").reduce(concat("+")) + "\n";
	return grid.map(showRow).reduce(concat(separator));
}

export function isFull(grid: Grid) {
	for (const row of grid) {
		for (const field of row) {
			if (field === Player.None) return false;
		}
	}
	return true;
}
function allRows(grid: Grid) {
	return [
		...grid,
		...grid[0].map((field, index) => getVertical(index)),
		...grid.map((row, index) => getDiagonal([index, 0], stepDownRight)),
		...grid[0].slice(1).map((field, index) => getDiagonal([0, index + 1], stepDownRight)),
		...grid.map((row, index) => getDiagonal([index, grid[0].length - 1], stepDownLeft)),
		...grid[0].slice(1).map((field, index) => getDiagonal([0, index], stepDownLeft))
	];
	
	function getVertical(index: number) {
		return grid.map(row => row[index]);
	}
	
	function getDiagonal(start: Index, step: (index: Index) => Index) {
		const row: Player[] = [];
		let index: Index = start;
		let value = get(grid, index);
		while (value !== undefined) {
			row.push(value);
			index = step(index);
			value = get(grid, index);
		}
		return row;
	}
	function stepDownRight([i, j]: Index): Index {
		return [i + 1, j + 1];
	}
	function stepDownLeft([i, j]: Index): Index {
		return [i + 1, j - 1];
	}
	function stepUpRight([i, j]: Index): Index {
		return [i - 1, j + 1];
	}
}
function isWinningRow(row: Player[], player: Player, index: number, originalLength: number, length: number): boolean {
	if (length === 0) {
		return true;
	}
	if (index + length > row.length) {
		return false;
	}
	if (row[index] === player) {
		return isWinningRow(row, player, index + 1, originalLength, length - 1);
	}
	return isWinningRow(row, player, index + 1, originalLength, originalLength);
}
export function findWinner(grid: Grid, rowLength: number): Player {
	const rows = allRows(grid);
	for (const row of rows) {
		if (isWinningRow(row, Player.Player1, 0, rowLength, rowLength)) {
			return Player.Player1;
		}
		if (isWinningRow(row, Player.Player2, 0, rowLength, rowLength)) {
			return Player.Player2;
		}
	}
	return Player.None;
}

export function getOptions(grid: Grid, player: Player) {
	const rowIndices = grid.map((row, index) => index);
	const columnIndices = grid[0].map((column, index) => index);
	
	const allFields = flatten(rowIndices.map(
		row => columnIndices.map(column => <Index> [row, column])
	));
	
	return allFields
		.filter(index => get(grid, index) === Player.None)
		.map(index => set(grid, index, player));
}

export function createGrid(width: number, height: number) {
	const grid: Grid = [];
	for (let i = 0; i < height; i++) {
		grid[i] = [];
		for (let j = 0; j < width; j++) {
			grid[i][j] = Player.None;
		}
	}
	return grid;
}

export function parseGrid(input: string) {
	const lines = input.split(";");
	return lines.map(parseLine);
	
	function parseLine(line: string) {
		return line.split("").map(parsePlayer);
	}
	function parsePlayer(character: string) {
		switch (character) {
			case "X":
				return Player.Player1;
			case "O":
				return Player.Player2;
			default:
				return Player.None;
		}
	}
}

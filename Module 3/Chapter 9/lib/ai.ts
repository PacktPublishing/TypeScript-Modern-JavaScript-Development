import { Player, Grid, findWinner, isFull, getOpponent, getOptions } from "./model";

export function minimax(grid: Grid, rowLength: number, player: Player): [Grid | undefined, number] {
	const winner = findWinner(grid, rowLength);
	if (winner === player) {
		return [undefined, 1];
	} else if (winner !== Player.None) {
		return [undefined, -1];
	} else if (isFull(grid)) {
		return [undefined, 0];
	} else {
		let options = getOptions(grid, player);
		const gridSize = grid.length * grid[0].length;
		if (options.length === gridSize) {
			options = options.slice(0, Math.ceil(gridSize / 2));
		}
		const opponent = getOpponent(player);
		/*return options.map<[Grid, number]>(
			option => [option, -(minimax(option, rowLength, opponent)[1])]
		).reduce(
			(previous, current) => previous[1] < current[1] ? current : previous
		)!;*/
		let best: [Grid, number] | undefined = undefined;
		for (const option of options) {
			const current: [Grid, number] = [option, -(minimax(option, rowLength, opponent)[1])];
			if (current[1] === 1) {
				return current;
			} else if (best === undefined || current[1] > best[1]) {
				best = current;
			}
		}
		return best!;
	}
}

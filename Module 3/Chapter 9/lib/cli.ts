import { Grid, Player, getOptions, getOpponent, showGrid, findWinner, isFull, createGrid } from "./model";
import { minimax } from "./ai";

function readLine() {
	return new Promise<string>(resolve => {
		process.stdin.once("data", (data: string | Buffer) => resolve(data.toString()));
	});
}

async function readAndValidate<U>(message: string, parse: (data: string) => U, validate: (value: U) => boolean): Promise<U> {
	const data = await readLine();
	const value = parse(data);
	if (validate(value)) {
		return value;
	} else {
		console.log(message);
		return readAndValidate(message, parse, validate);
	}
}
async function choose(question: string, options: string[]) {
	console.log(question);
	for (let i = 0; i < options.length; i++) {
		console.log((i + 1) + "\t" + options[i].replace(/\n/g, "\n\t"));
		console.log();
	}
	return await readAndValidate(
		`Enter a number between 1 and ${ options.length }`,
		parseInt,
		index => index >= 1 && index <= options.length
	) - 1;
}

type PlayerController = (grid: Grid) => Grid | Promise<Grid>;

const getUserPlayer = (player: Player) => async (grid: Grid) => {
	const options = getOptions(grid, player);
	const index = await choose("Choose one out of these options:", options.map(showGrid));
	return options[index];
};
const getAIPlayer = (player: Player, rowLength: number) => (grid: Grid) =>
	minimax(grid, rowLength, player)[0]!;

async function getPlayer(index: number, player: Player, rowLength: number): Promise<PlayerController> {
	switch (await choose(`Who controls player ${ index }?`, ["You", "Computer"])) {
		case 0:
			return getUserPlayer(player);
		default:
			return getAIPlayer(player, rowLength);
	}
}

export async function game() {
	console.log("Tic-Tac-Toe");
	console.log();
	console.log("Width");
	const width = await readAndValidate("Enter an integer", parseInt, isFinite);
	console.log("Height");
	const height = await readAndValidate("Enter an integer", parseInt, isFinite);
	console.log("Row length");
	const rowLength = await readAndValidate("Enter an integer", parseInt, isFinite);
	const player1 = await getPlayer(1, Player.Player1, rowLength);
	const player2 = await getPlayer(2, Player.Player2, rowLength);
	
	return play(createGrid(width, height), Player.Player1);
	
	async function play(grid: Grid, player: Player): Promise<[Grid, Player]> {
		console.log();
		console.log(showGrid(grid));
		console.log();
		
		const winner = findWinner(grid, rowLength);
		if (winner === Player.Player1) {
			console.log("Player 1 has won!");
			return <[Grid, Player]> [grid, winner];
		} else if (winner === Player.Player2) {
			console.log("Player 2 has won!");
			return <[Grid, Player]>[grid, winner];
		} else if (isFull(grid)) {
			console.log("It's a draw!");
			return <[Grid, Player]>[grid, Player.None];
		}
		
		console.log(`It's player ${ player === Player.Player1 ? "one's" : "two's" } turn!`);
		
		const current = player === Player.Player1 ? player1 : player2;
		return play(await current(grid), getOpponent(player));
	}
}

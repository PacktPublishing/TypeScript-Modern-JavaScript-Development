import test from "ava";
import { createGrid, Grid, findWinner, isFull, getOptions, Player } from "../model";
import { minimax } from "../ai";
import { randomInt } from "../utils";

type PlayerController = (grid: Grid) => Grid;
function run(grid: Grid, a: PlayerController, b: PlayerController): Player {
	const winner = findWinner(grid, 3);
	if (winner !== Player.None) return winner;
	if (isFull(grid)) return Player.None;
	return run(a(grid), b, a);
}
const aiPlayer = (player: Player) => (grid: Grid) =>
	minimax(grid, 3, player)[0]!;

test("AI vs AI", t => {
	const result = run(createGrid(3, 3), aiPlayer(Player.Player1), aiPlayer(Player.Player2))
	t.is(result, Player.None);
});

const randomPlayer = (player: Player) => (grid: Grid) => {
	const options = getOptions(grid, player);
	return options[randomInt(options.length)];
};

test("random vs AI", t => {
	for (let i = 0; i < 20; i++) {
		const result = run(createGrid(3, 3), randomPlayer(Player.Player1), aiPlayer(Player.Player2))
		t.not(result, Player.Player1);
	}
});

test("AI vs random", t => {
	for (let i = 0; i < 20; i++) {
		const result = run(createGrid(3, 3), aiPlayer(Player.Player1), randomPlayer(Player.Player2))
		t.not(result, Player.Player2);
	}
});

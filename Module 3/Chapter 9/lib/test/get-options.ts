import test from "ava";
import { createGrid, Player, isFull, getOptions } from "../model";
import { randomInt } from "../utils";

function randomPlayer() {
	switch (randomInt(4)) {
		case 0:
		case 1:
			return Player.Player1;
		case 2:
		case 3:
			return Player.Player2;
		default:
			return Player.None;
	}
}

test("get-options", t => {
	for (let i = 0; i < 10000; i++) {
		const grid = createGrid(randomInt(10) + 1, randomInt(10) + 1)
			.map(row => row.map(randomPlayer));
		const options = getOptions(grid, Player.Player1)
		t.is(isFull(grid), options.length === 0);
		for (let i = 1; i < options.length; i++) {
			for (let j = 0; j < i; j++) {
				t.notSame(options[i], options[j]);
			}
		}
	}
});

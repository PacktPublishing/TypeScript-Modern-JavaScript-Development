import test from "ava";
import { Player, parseGrid, findWinner } from "../model";

test("player winner", t => {
	t.is(findWinner(parseGrid("   ;XXX;   "), 3), Player.Player1);
	t.is(findWinner(parseGrid("   ;OOO;   "), 3), Player.Player2);
	t.is(findWinner(parseGrid("   ;   ;   "), 3), Player.None);
});
test("3x3 winner", t => {
	const grids = [
		"XXX;   ;   ",
		"   ;XXX;   ",
		"   ;   ;XXX",
		"X  ;X  ;X  ",
		" X ; X ; X ",
		"  X;  X;  X",
		"X  ; X ;  X",
		"  X; X ;X  "
	];
	for (const grid of grids) {
		t.is(findWinner(parseGrid(grid), 3), Player.Player1);
	}
});
test("3x3 no winner", t => {
	const grids = [
		"XXO;OXX;XOO",
		"   ;   ;   ",
		"XXO;   ;OOX",
		"X  ;X  ; X "
	];
	for (const grid of grids) {
		t.is(findWinner(parseGrid(grid), 3), Player.None);
	}
});
test("4x3 winner", t => {
	const grids = [
		"X   ; X  ;    ",
		" X  ;  X ;    ",
		"  X ;   X;    ",
		"    ;X   ; X  ",
		"  X ;   X;    ",
		" X  ;  X ;    ",
		"X   ; X  ;    ",
		"    ;   X;  X "
	];
	for (const grid of grids) {
		t.is(findWinner(parseGrid(grid), 2), Player.Player1);
	}
});


import { State, Level, Object, Enemy, Wall, Movement, isOppositeMovement, menuLost, menuWon, onGrid, Difficulty } from "./model";
import { update, randomInt, chance, distance, isInt } from "./utils";

export function step(state: State) {
	if (state.menu === undefined) {
		return stepLevel(state);
	} else {
		return state;
	}
}

function stepLevel(state: State): State {
	const level = state.level;
	
	const enemies = level.enemies.map(enemy => stepEnemy(enemy, level.player, level.walls, level.difficulty));
	const player = stepPlayer(level.player, level.currentMovement, level.walls);
	const dots = stepDots(level.dots, player);
	
	const currentMovement = onGrid(player) || isOppositeMovement(level.inputMovement, level.currentMovement) ? level.inputMovement : level.currentMovement;
	
	const menu = newMenu(player, dots, enemies);
	const newLevel = update(level, { enemies, dots, player, currentMovement });
	return update(state, { level: newLevel, menu });
}

function collidesWall(x: number, y: number, walls: Wall[]) {
	for (const wall of walls) {
		if (Math.abs(wall.x - x) < 1 && Math.abs(wall.y - y) < 1) {
			return true;
		}
	}
	return false;
}

function stepEnemy(enemy: Enemy, player: Object, walls: Wall[], difficulty: Difficulty): Enemy {
	const enemyStepSize = difficulty === Difficulty.Easy ? 0.0125 : 0.025;

	let { x, y, toX, toY } = enemy;
	if (chance(1 / (difficulty === Difficulty.Extreme ? 30 : 10))) {
		toX = Math.round(player.x) + randomInt(-2, 2);
		toY = Math.round(player.y) + randomInt(-2, 2);
	}
	
	if (!isInt(x)) {
		x += toX > x ? enemyStepSize : -enemyStepSize;
	} else if (!isInt(y)) {
		y += toY > y ? enemyStepSize : -enemyStepSize;
	} else {
		x = Math.round(x);
		y = Math.round(y);
		const options: [number, number][] = [
			[x + enemyStepSize, y],
			[x - enemyStepSize, y],
			[x, y + enemyStepSize],
			[x, y - enemyStepSize]
		];
		const possible = options
			.filter(([x, y]) => !collidesWall(x, y, walls))
			.sort(compareDistance);
		if (possible.length !== 0) {
			if (possible.length > 1 && chance(0.2)) {
				[x, y] = possible[1];
			}
			[x, y] = possible[0];
		}
	}
	
	return {
		x, y, toX, toY
	};
	
	function compareDistance([x1, y1]: [number, number], [x2, y2]: [number, number]) {
		return distance(toX, toY, x1, y1) - distance(toX, toY, x2, y2);
	}
}

const playerStepSize = 0.04;
function stepPlayer(player: Object, movement: Movement, walls: Wall[]): Object {
	let { x, y } = player;
	if (onGrid(player)) {
		x = Math.round(x);
		y = Math.round(y);
	}
	switch (movement) {
		case Movement.None:
			return player;
		case Movement.Left:
			x -= playerStepSize;
			break;
		case Movement.Right:
			x += playerStepSize;
			break;
		case Movement.Top:
			y += playerStepSize;
			break;
		case Movement.Bottom:
			y -= playerStepSize;
			break;
	}
	if (onGrid(player) && collidesWall(x, y, walls)) {
		return player;
	}
	return { x, y };
}

function stepDots(dots: Object[], player: Object) {
	return dots.filter(dot => distance(dot.x, dot.y, player.x, player.y) >= 0.55)
}

function newMenu(player: Object, dots: Object[], enemies: Enemy[]) {
	for (const enemy of enemies) {
		if (distance(enemy.x, enemy.y, player.x, player.y) <= 1) {
			return menuLost;
		}
	}
	if (dots.length === 0) return menuWon;
	return undefined;
}

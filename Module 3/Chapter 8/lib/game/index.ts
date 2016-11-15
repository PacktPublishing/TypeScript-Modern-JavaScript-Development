import { game } from "../framework/game";
import { defaultState } from "./model";
import { draw } from "./view";
import { step } from "./step";
import { eventHandler } from "./event";

const canvas = <HTMLCanvasElement> document.getElementById("game");
game(canvas, document.body, 60, defaultState, draw, step, eventHandler);

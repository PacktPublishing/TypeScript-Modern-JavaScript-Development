import { KeyEvent, KeyEventKind } from "../framework/event";
import { State, Movement } from "./model";
import { update } from "./utils";

enum Keys {
	Top = 38,
	Left = 37,
	Bottom = 40,
	Right = 39,
	Space = " ".charCodeAt(0)
}
function getMovement(key: number) {
	switch (key) {
		case Keys.Top:
			return Movement.Top;
		case Keys.Left:
			return Movement.Left;
		case Keys.Bottom:
			return Movement.Bottom;
		case Keys.Right:
			return Movement.Right;
	}
	return undefined;
}

export function eventHandler(state: State, event: KeyEvent) {
	if (state.menu) {
		return eventHandlerMenu(state, event);
	} else {
		return eventHandlerPlaying(state, event);
	}
}

function eventHandlerMenu(state: State, event: KeyEvent) {
	if (event instanceof KeyEvent && event.kind === KeyEventKind.Press) {
		const menu = state.menu!;
		let selected = menu.selected;
		switch (event.keyCode) {
			case Keys.Top:
				selected--;
				if (selected < 0) {
					selected = menu.options.length - 1;
				}
				return {
					menu: update(menu, {
						selected
					}),
					level: state.level
				};
			case Keys.Bottom:
				selected++;
				if (selected >= menu.options.length) {
					selected = 0;
				}
				return {
					menu: update(menu, {
						selected
					}),
					level: state.level
				};
			case Keys.Space:
				const option = menu.options[menu.selected];
				return option[1](state);
			default:
				return state;
		}
	}
	return state;
}
function eventHandlerPlaying(state: State, event: KeyEvent) {
	if (event instanceof KeyEvent) {
		const inputMovement = getMovement(event.keyCode);
		if (event.kind === KeyEventKind.Press) {
			if (inputMovement) {
				return update(state, {
					level: update(state.level, { inputMovement })
				});
			}
		} else {
			if (inputMovement === state.level.inputMovement) {
				return update(state, {
					level: update(state.level, { inputMovement: Movement.None })
				});
			}
		}
	}
	return state;
}

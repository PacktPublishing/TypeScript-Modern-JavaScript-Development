import { State } from "./state";
import { calculateSheet, Field, rows, fieldToString, parseField } from "./sheet";
import { update, updateArray, rangeMap } from "./utils";

const modifyResult = (state: State) =>
	update(state, {
		result: calculateSheet(state.sheet)
	});

export const addRow = (state: State) =>
	modifyResult(update(state, {
		sheet: update(state.sheet, {
			grid: state.sheet.grid.map(column => [...column, ""])
		})
	}));
export const addColumn = (state: State) =>
	modifyResult(update(state, {
		sheet: update(state.sheet, {
			grid: [
				...state.sheet.grid,
				rangeMap(0, rows(state.sheet), () => "")
			]
		})
	}));

export const setTitle = (title: string) => (state: State) =>
	update(state, {
		sheet: update(state.sheet, { title })
	});

export const popupOpen = (selectedColumn: number, selectedRow: number) => (state: State) =>
	update(state, {
		selectedColumn,
		selectedRow,
		popupInput: fieldToString(state.sheet.grid[selectedColumn][selectedRow]),
		popupSyntaxError: false
	});
export const popupClose = (state: State) =>
	update(state, {
		selectedColumn: undefined,
		selectedRow: undefined,
		popupInput: ""
	});
export const popupToggle = (column: number, row: number) => (state: State) =>
	(column === state.selectedColumn && row === state.selectedRow)
		? popupClose(state) : popupOpen(column, row)(state);

export const popupChangeInput = (popupInput: string) => (state: State) =>
	update(state, {
		popupInput
	});
export const popupSave = (state: State) => {
	const input = state.popupInput;
	const value = parseField(input);
	if (value === undefined) {
		return update(state, {
			popupSyntaxError: true
		});
	}
	return modifyResult(update(state, {
		sheet: update(state.sheet, {
			grid: updateArray(state.sheet.grid, state.selectedColumn,
				updateArray(state.sheet.grid[state.selectedColumn], state.selectedRow, value)
			)
		}),
		selectedColumn: undefined,
		selectedRow: undefined,
		popupInput: ""
	}));
};

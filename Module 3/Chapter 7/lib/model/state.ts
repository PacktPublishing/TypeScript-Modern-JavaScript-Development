import { Sheet, Result } from "./sheet";

export interface State {
	sheet: Sheet;
	result: Result;

	selectedColumn: number;
	selectedRow: number;
	popupInput: string;
	popupSyntaxError: boolean;
}

const emptyRow = ["", ""];
const emptyGrid = [
	emptyRow,
	emptyRow
]
export const emptySheet = new Sheet("Untitled", emptyGrid)

export const empty: State = {
	sheet: emptySheet,
	result: emptyGrid,

	selectedColumn: undefined,
	selectedRow: undefined,
	popupInput: "",
	popupSyntaxError: false
}

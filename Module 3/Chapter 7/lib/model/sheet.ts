import { Expression, Variable, calculateExpression, Constant, Failure, FailureKind, validate, expressionToString } from "./expression";
import { parse, parseConstant, parseExpression } from "./parser";

export class Sheet {
	constructor(
		public title: string,
		public grid: Field[][]
	) {}
}
export type Field = Expression | string;

export function columns(sheet: Sheet) {
	return sheet.grid.length;
}
export function rows(sheet: Sheet) {
	const firstColumn = sheet.grid[0];
	if (firstColumn) return firstColumn.length;
	return 0;
}

export function parseField(content: string): Field {
	if (content.charAt(0) === "=") {
		return parse(parseExpression, content.substring(1));
	} else {
		return content;
	}
}
export function fieldToString(field: Field) {
	if (typeof field === "string") {
		return field;
	} else {
		return "=" + expressionToString(field);
	}
}

export type Result = ResultField[][];
export type ResultField = string | number | Failure[];

export function calculateSheet({ grid }: Sheet) {
	const result: ResultField[][] = [];

	for (let column = 0; column < grid.length; column++) {
		const columnContent = grid[column];
		result[column] = [];
		for (let row = 0; row < columnContent.length; row++) {
			result[column][row] = calculateField(column, row);
		}
	}

	return result;

	function calculateField(column: number, row: number): ResultField {
		const field = grid[column][row];
		if (typeof field === "string") {
			return field;
		} else {
			const errors = validate(column, row, field);
			if (errors.length !== 0) return errors;
			return calculateExpression(field, resolveVariable);
		}
	}
	function resolveVariable(location: Variable): number | Failure[] {
		const { column, row } = location;
		const value = result[column][row];
		if (typeof value === "string") {
			const num = parse(parseConstant, value);
			if (num === undefined) {
				return [new Failure(FailureKind.TextNotANumber, location)];
			}
			return num.value;
		} else if (value instanceof Array) {
			return [new Failure(FailureKind.FailedDependentRow, location)];
		} else {
			return value;
		}
	}
}

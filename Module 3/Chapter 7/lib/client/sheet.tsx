import * as React from "react";
import { Dispatch } from "../model/store";
import { Expression, expressionToString, failureText } from "../model/expression"
import { State } from "../model/state";
import { Sheet, Field, Result, ResultField, columns, rows, parseField, fieldToString } from "../model/sheet";
import { update, rangeMap } from "../model/utils";
import * as action from "../model/action";

export function RenderSheet({ state, dispatch }: { state: State, dispatch: Dispatch<State> }) {
	const { sheet, result } = state;
	const columnCount = columns(sheet);
	const rowCount = rows(sheet);
	return (
		<div className="sheet">
			<input className="sheet-title" value={sheet.title}
				onChange={e => dispatch(action.setTitle((e.target as HTMLInputElement).value))} />
			<table>
				<tbody>
					<tr>
						<th></th>
						{ rangeMap(0, columnCount, index => <th key={index}>{ index }</th>) }
						<th rowSpan={rowCount + 1} className="sheet-add-column">
							<a href="javascript:;"
								onClick={() => dispatch(action.addColumn)}>Add column</a>
						</th>
					</tr>
					{ rangeMap(0, rowCount, renderRow) }
					<tr><th colSpan={columnCount + 2}>
						<a href="javascript:;"
							onClick={() => dispatch(action.addRow)}>Add row</a>
					</th></tr>
				</tbody>
			</table>
		</div>
	);
	function renderRow(row: number) {
		return (
			<tr key={row}>
				<th>{ row }</th>
				{ rangeMap(0, columnCount, renderColumn) }	
			</tr>
		);
		function renderColumn(column: number) {
			return (
				<RenderField key={column} column={column} row={row} state={state} dispatch={dispatch} />
			);
		}
	}
}
function RenderField({ column, row, state, dispatch }: {column: number, row: number, state: State, dispatch: Dispatch<State> }) {
	const field = state.sheet.grid[column][row];
	const result = state.result[column][row];
	const open = state.selectedColumn === column
		&& state.selectedRow === row;

	let text: string;
	let className: string;

	if (typeof result === "string") {
		text = result;
		className = "field-string";
	} else if (typeof result === "number") {
		text = result.toString();
		className = "field-value";
	} else {
		text = result.length === 1 ? "1 error" : result.length + " errors";
		className = "field-error";
	}
	className += " field";
	if (open) {
		className += " field-open";
	}
	return (
		<td className={className}>
			<span onClick={() => dispatch(action.popupToggle(column, row))}>
				{ text }
			</span>
			{ open ?
				<RenderPopup
					field={field}
					content={result}
					syntaxError={state.popupSyntaxError}
					input={state.popupInput}
					dispatch={dispatch} />
				: undefined
			}
		</td>
	);
}
function RenderPopup({ field, content, syntaxError, input, dispatch }: { field: Field, content: ResultField, syntaxError: boolean, input: string, dispatch: Dispatch<State> }) {
	let errors: JSX.Element | JSX.Element[];
	if (syntaxError) {
		errors = <div className="failure">
			Could not parse this expression.
		</div>;
	} else if (content instanceof Array) {
		errors = content.map((failure, index) => <div className="failure" key={index.toString()}>
			<span className="failure-text">{ failureText(failure) }</span>
			<span className="failure-source">{ expressionToString(failure.location) }</span>
		</div>);
	}
	return (
		<div className="field-popup">
			<form onSubmit={(e) => {e.preventDefault(); dispatch(action.popupSave);}}>
				<input value={input} autoFocus
					onChange={e => dispatch(action.popupChangeInput((e.target as HTMLInputElement).value))} />
			</form>
			<a href="javascript:;" onClick={() => dispatch(action.popupSave)}>Save</a>
			<a href="javascript:;" onClick={() => dispatch(action.popupClose)}>Cancel</a>
			<br />
			{ errors }
		</div>
	);
}

import * as test from "ava";
import { empty } from "../model/state";
import { addColumn, addRow, setTitle } from "../model/action";
import { columns, rows } from "../model/sheet";

test("addColumn", t => {
	const state = addColumn(empty);
	t.is(columns(state.sheet), columns(empty.sheet) + 1);
	t.is(rows(state.sheet), rows(empty.sheet));
});
test("addRow", t => {
	const state = addRow(empty);
	t.is(columns(state.sheet), columns(empty.sheet));
	t.is(rows(state.sheet), rows(empty.sheet) + 1);
});
test("setTitle", t => {
	const state = setTitle("foo")(empty);
	t.is(state.sheet.title, "foo");
	t.is(state.sheet.grid, empty.sheet.grid);
});

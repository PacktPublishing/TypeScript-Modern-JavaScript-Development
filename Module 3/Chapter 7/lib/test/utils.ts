import * as test from "ava";
import { factorial } from "../model/utils";

test("factorial", t => {
	t.is(factorial(0), 1);
	t.is(factorial(1), 1);
	t.is(factorial(2), 2);
	t.is(factorial(3), 6);
	t.is(factorial(4), 24);
});

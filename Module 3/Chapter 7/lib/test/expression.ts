import * as test from "ava";
import { Expression, Constant, UnaryOperation, UnaryOperationKind, BinaryOperation, BinaryOperationKind, Variable, calculateExpression, expressionToString } from "../model/expression";

test("calculateExpression", t => {
	function testExpression(result: number, expression: Expression) {
		t.is(calculateExpression(expression, () => 1), result);
	}

	testExpression(5,
		new Constant(5));
	testExpression(-14,
		new UnaryOperation(new Constant(14), UnaryOperationKind.Minus));
	testExpression(28,
		new BinaryOperation(new Constant(14), new Constant(2), BinaryOperationKind.Multiply));
	testExpression(1,
		new Variable(0, 0));
});
test("expressionToString", t => {
	function testString(result: string, expression: Expression) {
		t.is(expressionToString(expression), result);
	}

	testString("5",
		new Constant(5));
	testString("-14",
		new UnaryOperation(new Constant(14), UnaryOperationKind.Minus));
	testString("14*2",
		new BinaryOperation(new Constant(14), new Constant(2), BinaryOperationKind.Multiply));
	testString("0:0",
		new Variable(0, 0));
});


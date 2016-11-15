import { factorial } from "./utils";

export class Constant {
	constructor(
		public value: number
	) {}
}
export class UnaryOperation {
	constructor(
		public expression: Expression,
		public kind: UnaryOperationKind
	) {}
}
export enum UnaryOperationKind {
	Minus,
	Factorial
}
export class BinaryOperation {
	constructor(
		public left: Expression,
		public right: Expression,
		public kind: BinaryOperationKind
	) {}
}
export enum BinaryOperationKind {
	Add,
	Subtract,
	Multiply,
	Divide
}
export class Variable {
	constructor(
		public column: number,
		public row: number
	) {}
}
export class Parenthesis {
	constructor(
		public expression: Expression
	) {}
}
export type Expression = Constant | UnaryOperation | BinaryOperation | Variable | Parenthesis;

export function expressionToString(formula: Expression): string {
	if (formula instanceof Constant) {
		return formula.value.toFixed();
	} else if (formula instanceof UnaryOperation) {
		const { expression, kind } = formula;
		switch (kind) {
			case UnaryOperationKind.Factorial:
				return expressionToString(expression) + "!";
			case UnaryOperationKind.Minus:
				return "-" + expressionToString(expression);
		}
	} else if (formula instanceof BinaryOperation) {
		const { left, right, kind } = formula;
		const leftString = expressionToString(left);
		const rightString = expressionToString(right);
		switch (kind) {
			case BinaryOperationKind.Add:
				return leftString + "+" + rightString;
			case BinaryOperationKind.Subtract:
				return leftString + "-" + rightString;
			case BinaryOperationKind.Multiply:
				return leftString + "*" + rightString;
			case BinaryOperationKind.Divide:
				return leftString + "/" + rightString;
		}
	} else if (formula instanceof Variable) {
		const { column, row } = formula;
		return column + ":" + row;
	} else if (formula instanceof Parenthesis) {
		const { expression } = formula;
		return "(" + expressionToString(expression) + ")";
	}
}

export class Failure {
	constructor(
		public kind: FailureKind,
		public location: Expression
	) {}
}
export enum FailureKind {
	ForwardReference,
	SelfReference,
	TextNotANumber,
	DivideByZero,
	FactorialNegative,
	FactorialNonInteger,
	FailedDependentRow
}

export function failureText({ kind }: Failure) {
	switch (kind) {
		case FailureKind.ForwardReference:
			return "This expression contains a forward reference to another variable";
		case FailureKind.SelfReference:
			return "This expression references itself";
		case FailureKind.TextNotANumber:
			return "This expression references a field that does not contain a number";
		case FailureKind.DivideByZero:
			return "Cannot divide by zero";
		case FailureKind.FactorialNegative:
			return "Cannot compute the factorial of a negative number";
		case FailureKind.FactorialNonInteger:
			return "The factorial can only be computed of an integer";
		case FailureKind.FailedDependentRow:
			return "This expression references a field that has one or more errors";
	}
}

export function validate(column: number, row: number, formula: Expression): Failure[] {
	if (formula instanceof UnaryOperation || formula instanceof Parenthesis) {
		return validate(column, row, formula.expression);
	} else if (formula instanceof BinaryOperation) {
		return [
			...validate(column, row, formula.left),
			...validate(column, row, formula.right)
		];
	} else if (formula instanceof Variable) {
		if (formula.column === column && formula.row === row) {
			return [new Failure(FailureKind.SelfReference, formula)];
		}
		if (formula.column > column || formula.row > row) {
			return [new Failure(FailureKind.ForwardReference, formula)];
		}
		return [];
	} else {
		return [];
	}
}

export function calculateExpression(formula: Expression, resolve: (variable: Variable) => number | Failure[]): number | Failure[] {
	if (formula instanceof Constant) {
		return formula.value;
	} else if (formula instanceof UnaryOperation) {
		const { expression, kind } = formula;
		const value = calculateExpression(expression, resolve);
		if (value instanceof Array) {
			return value;
		} else {
			switch (kind) {
				case UnaryOperationKind.Factorial:
					if (value < 0) {
						return [new Failure(FailureKind.FactorialNegative, formula)];
					}
					if (Math.round(value) !== value) {
						return [new Failure(FailureKind.FactorialNonInteger, formula)];
					}
					return factorial(Math.round(value));
				case UnaryOperationKind.Minus:
					return -value;
			}
		}
	} else if (formula instanceof BinaryOperation) {
		const { left, right, kind } = formula;
		const leftValue = calculateExpression(left, resolve);
		const rightValue = calculateExpression(right, resolve);
		if (leftValue instanceof Array) {
			if (rightValue instanceof Array) {
				return [...leftValue, ...rightValue];
			}
			return leftValue;
		} else if (rightValue instanceof Array) {
			return rightValue;
		} else {
			switch (kind) {
				case BinaryOperationKind.Add:
					return leftValue + rightValue;
				case BinaryOperationKind.Subtract:
					return leftValue - rightValue;
				case BinaryOperationKind.Multiply:
					return leftValue * rightValue;
				case BinaryOperationKind.Divide:
					if (rightValue === 0) {
						return [new Failure(FailureKind.DivideByZero, formula)];
					}
					return leftValue / rightValue;
			}
		}
	} else if (formula instanceof Variable) {
		return resolve(formula);
	} else if (formula instanceof Parenthesis) {
		return calculateExpression(formula.expression, resolve);
	}
}

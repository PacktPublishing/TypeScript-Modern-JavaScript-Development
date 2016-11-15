import { Expression, Constant, Variable, UnaryOperation, UnaryOperationKind, BinaryOperation, BinaryOperationKind, Parenthesis } from "./expression";
import { flatten, flatMap } from "./utils";

type ParseResult<T> = [T, string][];
type Parser<T> = (source: string) => ParseResult<T>;

export function parse<U>(parser: Parser<U>, source: string): U {
	const result = parser(source)
		.filter(([result, rest]) => rest.length === 0)[0];
	if (!result) return undefined;
	return result[0];
}

const epsilon = <U>(value: U): Parser<U> => source =>
	[[value, source]];

const token = <U>(term: string, value: U): Parser<U> => source => {
	if (source.substring(0, term.length) === term) {
		return [[value, source.substring(term.length)]];
	} else {
		return [];
	}
};

const or = <U>(...parsers: Parser<U>[]): Parser<U> => source =>
	(<[U, string][]>[]).concat(...parsers.map(parser => parser(source)));

const parseDigit = or(
	token("0", 0), token("1", 1),
	token("2", 2), token("3", 3),
	token("4", 4), token("5", 5),
	token("6", 6), token("7", 7),
	token("8", 8), token("9", 9)
);

const map = <U, V>(parser: Parser<U>, callback: (value: U) => V): Parser<V> => source =>
	parser(source).map<[V, string]>(([item, rest]) => [callback(item), rest]);

const bind = <U, V>(parser: Parser<U>, callback: (value: U) => Parser<V>): Parser<V> => source =>
	flatMap(parser(source), ([result, rest]) => callback(result)(rest));

const sequence2 = <U, V, W>(
	left: Parser<U>,
	right: Parser<V>,
	combine: (x: U, y: V) => W) =>
	bind(left, x => map(right, y => combine(x, y)));

const sequence3 = <U, V, W, T>(
	first: Parser<U>,
	second: Parser<V>,
	third: Parser<W>,
	combine: (x: U, y: V, z: W) => T) =>
	bind(first, x => sequence2(second, third, (y, z) => combine(x, y, z)));

function list<U>(parseItem: Parser<U>) {
	const parser: Parser<U[]> = or(
		map(parseItem, item => [item]),
		sequence2(
			parseItem,
			source => parser(source),
			(item, items) => [item, ...items]
		)
	);
	return parser;
}

interface SeparatedList<U, V> {
	first: U;
	items: [V, U][];
}
const separatedList = <U, V>(parseItem: Parser<U>, parseSeparator: Parser<V>) =>
	or(
		map(parseItem, first => ({ first, items: [] })),
		sequence2(
			parseItem,
			list(sequence2(parseSeparator, parseItem, (sep, item) => <[V, U]>[sep, item])),
			(first, items) => ({ first, items })
		)
	);

const parseDigits = list(parseDigit);

const toInteger = (digits: number[]) => digits.reduce(
	(previous, current, index) =>
		previous + current * Math.pow(10, digits.length - index - 1),
	0
);

const parseInteger = map(parseDigits, toInteger);

const parseVariable = sequence3(parseInteger, token(":", undefined), parseInteger,
	(column, separator, row) => new Variable(column, row));

const parseDecimal = or(
	epsilon(0),
	sequence2(
		token(".", undefined),
		parseDigits,
		(dot, digits) => toInteger(digits) / Math.pow(10, digits.length)
	)
);
const parseExponent = or(
	epsilon(1),
	sequence2(
		token("e", undefined),
		parseDigits,
		(e, digits) => Math.pow(10, toInteger(digits))
	)
);

export const parseConstant = sequence3(
	parseInteger,
	parseDecimal,
	parseExponent,
	(int, decimal, exp) => new Constant((int + decimal) * exp)
);

const parseConstantVariableOrParenthesis = or(parseConstant, parseVariable, parseParenthesis);
const parseFactor = or(
	parseConstantVariableOrParenthesis,
	sequence2(
		token("-", undefined),
		parseConstantVariableOrParenthesis,
		(t, value) => new UnaryOperation(value, UnaryOperationKind.Minus)
	),
	sequence2(
		parseConstantVariableOrParenthesis,
		token("!", undefined),
		(value) => new UnaryOperation(value, UnaryOperationKind.Factorial)
	)
);

function foldBinaryOperations({ first, items }: SeparatedList<Expression, BinaryOperationKind>) {
	return items.reduce(fold, first);

	function fold(previous: Expression, [kind, next]: [BinaryOperationKind, Expression]) {
		return new BinaryOperation(previous, next, kind);
	}
}
const parseTerm = map(
	separatedList(
		parseFactor,
		or(
			token("*", BinaryOperationKind.Multiply),
			token("/", BinaryOperationKind.Divide)
		)
	),
	foldBinaryOperations
);
export const parseExpression = map(
	separatedList(
		parseTerm,
		or(
			token("+", BinaryOperationKind.Add),
			token("-", BinaryOperationKind.Subtract)
		)
	),
	foldBinaryOperations
);

function parseParenthesis(source: string): ParseResult<Expression> {
	return sequence3(
		token("(", undefined),
		parseExpression,
		token(")", undefined),
		(left, expression, right) => new Parenthesis(expression)
	)(source);
}

import { NumberToken } from "../../../src/lexer/tokens";
import {
	// Helper FNs
	atom,
	qString,
	op,
	num,
	// Premade tokens
	tokenNil,
	tokenOpenParen,
	tokenCloseParen,
	tokenSP,
} from "./constants";
import { TestSpec } from "./types";

const lexerComplexitySpec: TestSpec[] = [
	{
		name: "Empty value",
		input: "",
		results: {
			lexer: [],
		},
	},
	{
		name: "Empty quoted string",
		input: '""',
		results: { lexer: [qString("")] },
	},
	{
		name: "Simple, two key-value pxairs with nil",
		input: "FLAGS NIL RFC822.SIZE 44827",
		results: {
			lexer: [
				atom("FLAGS"),
				tokenSP,
				tokenNil,
				tokenSP,
				atom("RFC822.SIZE"),
				tokenSP,
				num(44827),
			],
		},
	},
	{
		name: "Simple, two key-value pairs with list",
		input: "FLAGS (\\Seen) RFC822.SIZE 44827",
		results: {
			lexer: [
				atom("FLAGS"),
				tokenSP,
				tokenOpenParen,
				op("\\"),
				atom("Seen"),
				tokenCloseParen,
				tokenSP,
				atom("RFC822.SIZE"),
				tokenSP,
				num(44827),
			],
		},
	},
	{
		name: "Integer exceeding JavaScript max int size",
		input: "RFC822.SIZE 9007199254740993",
		results: {
			lexer: [
				atom("RFC822.SIZE"),
				tokenSP,
				new NumberToken("9007199254740993"),
			],
		},
	},
	{
		name: "Quoted string",
		input: 'FLAGS (\\Seen) INTERNALDATE "17-Jul-1996 02:44:25 -0700"',
		results: {
			lexer: [
				atom("FLAGS"),
				tokenSP,
				tokenOpenParen,
				op("\\"),
				atom("Seen"),
				tokenCloseParen,
				tokenSP,
				atom("INTERNALDATE"),
				tokenSP,
				qString("17-Jul-1996 02:44:25 -0700"),
			],
		},
	},
	{
		name: "Lists with varying spacing",
		input: '("Foo")("Bar") ("Baz")',
		results: {
			lexer: [
				tokenOpenParen,
				qString("Foo"),
				tokenCloseParen,
				tokenOpenParen,
				qString("Bar"),
				tokenCloseParen,
				tokenSP,
				tokenOpenParen,
				qString("Baz"),
				tokenCloseParen,
			],
		},
	},
	{
		name: "Quoted string with escaped chars",
		input: '"\\"IMAP\\" is terrible :\\\\"',
		results: { lexer: [qString('\\"IMAP\\" is terrible :\\\\')] },
	},
	{
		name: "Quoted string with escaped chars #2",
		input: '"\\\\\\"IMAP\\" is terrible :\\\\"',
		results: { lexer: [qString('\\\\\\"IMAP\\" is terrible :\\\\')] },
	},
	{
		name: "Quoted string with escaped chars #3",
		input: '"Who does not think \\"IMAP\\" is terrible\\\\bad?"',
		results: {
			lexer: [
				qString('Who does not think \\"IMAP\\" is terrible\\\\bad?'),
			],
		},
	},
	{
		name: "Quoted string with escaped chars #4",
		input: '"Who does not think \\\\\\"IMAP\\" is terrible\\\\bad?"',
		results: {
			lexer: [
				qString(
					'Who does not think \\\\\\"IMAP\\" is terrible\\\\bad?',
				),
			],
		},
	},
	{
		name: "Triple backslash in quoted string (GH Issue #345)",
		input:
			'ENVELOPE ("Wed, 30 Mar 2014 02:38:23 +0100" "=?ISO-8859-1?Q?##ALLCAPS##123456## - ?= =?ISO-8859-1?Q?[ALERT][P3][ONE.TWO.FR] ?= =?ISO-8859-1?Q?Some Subject Line \\"D:\\\\\\"?=" (("Test Account (Rltvty L)" NIL "account" "test.com")) (("Test Account (Rltvty L)" NIL "account" "test.com")) ((NIL NIL "account" "test.com")) ((NIL NIL "one.two" "test.fr") (NIL NIL "two.three" "test.fr")) NIL NIL NIL "<message@test.eu>")',
		results: {
			lexer: [
				atom("ENVELOPE"),
				tokenSP,
				tokenOpenParen,
				qString("Wed, 30 Mar 2014 02:38:23 +0100"),
				tokenSP,
				qString(
					'=?ISO-8859-1?Q?##ALLCAPS##123456## - ?= =?ISO-8859-1?Q?[ALERT][P3][ONE.TWO.FR] ?= =?ISO-8859-1?Q?Some Subject Line \\"D:\\\\\\"?=',
				),
				tokenSP,
				tokenOpenParen,
				tokenOpenParen,
				qString("Test Account (Rltvty L)"),
				tokenSP,
				tokenNil,
				tokenSP,
				qString("account"),
				tokenSP,
				qString("test.com"),
				tokenCloseParen,
				tokenCloseParen,
				tokenSP,
				tokenOpenParen,
				tokenOpenParen,
				qString("Test Account (Rltvty L)"),
				tokenSP,
				tokenNil,
				tokenSP,
				qString("account"),
				tokenSP,
				qString("test.com"),
				tokenCloseParen,
				tokenCloseParen,
				tokenSP,
				tokenOpenParen,
				tokenOpenParen,
				tokenNil,
				tokenSP,
				tokenNil,
				tokenSP,
				qString("account"),
				tokenSP,
				qString("test.com"),
				tokenCloseParen,
				tokenCloseParen,
				tokenSP,
				tokenOpenParen,
				tokenOpenParen,
				tokenNil,
				tokenSP,
				tokenNil,
				tokenSP,
				qString("one.two"),
				tokenSP,
				qString("test.fr"),
				tokenCloseParen,
				tokenSP,
				tokenOpenParen,
				tokenNil,
				tokenSP,
				tokenNil,
				tokenSP,
				qString("two.three"),
				tokenSP,
				qString("test.fr"),
				tokenCloseParen,
				tokenCloseParen,
				tokenSP,
				tokenNil,
				tokenSP,
				tokenNil,
				tokenSP,
				tokenNil,
				tokenSP,
				qString("<message@test.eu>"),
				tokenCloseParen,
			],
		},
	},
];

export default lexerComplexitySpec;
// @ts-check

import tseslint from "typescript-eslint";

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
	{
		ignores: ["**/*.test.ts"],
	},
	...tseslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				project: "tsconfig.json",
				tsconfigRootDir: __dirname,
			},
		},
		linterOptions: {
			reportUnusedDisableDirectives: true,
		},
		// plugins: {
		// 	"unused-imports": unusedImports,
		// 	unicorn,
		// },
		rules: {
			// Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
			"@typescript-eslint/no-parameter-properties": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-use-before-define": [
				"error",
				{
					functions: false,
					typedefs: false,
					classes: false,
				},
			],
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					ignoreRestSiblings: true,
					argsIgnorePattern: "^_",
				},
			],
			"@typescript-eslint/no-object-literal-type-assertion": "off",
			"@typescript-eslint/interface-name-prefix": "off",
			"@typescript-eslint/no-non-null-assertion": "off", // This is necessary for Map.has()/get()!
			"@typescript-eslint/no-inferrable-types": [
				"error",
				{
					ignoreProperties: true,
					ignoreParameters: true,
				},
			],
			"@typescript-eslint/ban-ts-comment": [
				"error",
				{
					"ts-expect-error": false,
					"ts-ignore": true,
					"ts-nocheck": true,
					"ts-check": false,
				},
			],
			"@typescript-eslint/restrict-template-expressions": [
				"error",
				{
					allowNumber: true,
					allowBoolean: true,
					// This is necessary to log errors
					// TODO: Consider switching to false when we may annotate catch clauses
					allowAny: true,
					allowNullish: true,
				},
			],
			"@typescript-eslint/no-misused-promises": [
				"error",
				{
					checksVoidReturn: false,
				},
			],

			// Make sure type imports are used where necessary
			"@typescript-eslint/consistent-type-imports": [
				"error",
				{
					fixStyle: "inline-type-imports",
					disallowTypeAnnotations: false,
				},
			],
			"@typescript-eslint/consistent-type-exports": "error",

			// We can turn this on from time to time but in general these rules
			// make our lives harder instead of easier
			"@typescript-eslint/no-unsafe-argument": "off",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unsafe-return": "off",
			"@typescript-eslint/no-unsafe-call": "off",
			"@typescript-eslint/no-unsafe-enum-comparison": "off",
			"@typescript-eslint/no-unsafe-declaration-merging": "off",

			// Although this rule makes sense, it takes about a second to execute (and we don't need it)
			"@typescript-eslint/no-implied-eval": "off",

			"@typescript-eslint/explicit-module-boundary-types": [
				"warn",
				{ allowArgumentsExplicitlyTypedAsAny: true },
			],
			"@typescript-eslint/no-this-alias": "off",
			"@typescript-eslint/no-deprecated": "error",

			// Prefer simple property access and declaration without quotes
			"dot-notation": "off",
			"@typescript-eslint/dot-notation": [
				"error",
				{
					allowPrivateClassPropertyAccess: true,
					allowProtectedClassPropertyAccess: true,
				},
			],
			"quote-props": ["error", "as-needed"],

			// Avoid node-specific globals
			// See https://sindresorhus.com/blog/goodbye-nodejs-buffer for the reason behind this
			"no-restricted-globals": [
				"error",
				{
					name: "Buffer",
					message:
						"Use Uint8Array instead.",
				},
			],
		},
	},
	// Disable unnecessarily strict rules for test files
	{
		files: ["**/*.test.ts"],
		rules: {
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/no-empty-function": "off",
			"@typescript-eslint/ban-ts-comment": "off",
			"@typescript-eslint/no-unsafe-argument": "off",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unsafe-member-return": "off",
			"@typescript-eslint/no-unsafe-return": "off",
			"@typescript-eslint/no-unsafe-call": "off",
			"@typescript-eslint/no-floating-promises": "off",
			"@typescript-eslint/require-await": "off",
			"@typescript-eslint/unbound-method": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"@typescript-eslint/dot-notation": "off",
		},
	},
);

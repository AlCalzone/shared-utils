module.exports = {
	out: "docs/",
	exclude: [
		"**/src/index.ts",
		"**/src/**/*.test.ts",
		"**/src/types/*.ts"
	],
	externalPattern: "node_modules",
	excludePrivate: true,
	readme: "none",
};

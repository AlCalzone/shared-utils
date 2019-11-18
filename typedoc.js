module.exports = {
	out: "docs/",
	mode: "modules",
	moduleResolution: "node",
	exclude: [
		"**/src/index.ts",
		"**/src/**/*.test.ts",
		"**/src/types/*.ts"
	],
	externalPattern: "node_modules",
	excludeNotExported: true,
	excludePrivate: true,
	target: "ES2015",
	readme: "none",
};

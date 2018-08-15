module.exports = {
	out: "docs/",
	mode: "modules",
	moduleResolution: "node",
	exclude: [
		"**/src/index.ts",
		"**/src/types/*.ts"
	],
	externalPattern: "node_modules",
	excludeNotExported: true,
	excludePrivate: true,
	target: "ES5",
	readme: "none",
};

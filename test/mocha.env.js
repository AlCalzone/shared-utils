process.env.TS_NODE_IGNORE_WARNINGS = "TRUE";

// Don't silently swallow unhandled rejections
process.on("unhandledRejection", (e) => {
	throw e;
})
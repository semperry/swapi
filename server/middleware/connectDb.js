const dbConfig = require("../app/dbConfig");

async function connectDb(req, res, next) {
	await dbConfig();
	next();
}

module.exports = connectDb;

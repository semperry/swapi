// const redis = require("redis");

// const redis_port = process.env.REDIS_URL || 6379;
// Place port back into position
// const redis_client = redis.createClient(redis_port);

// module.exports = redis_client;

// app.use("/getKeys", (req, res) => {
// 	redisClient.keys("*", (err, data) => {
// 		if (data) {
// 			data.forEach((key) => {
// 				redisClient.get(key, (err, reply) => {
// 					if (reply) {
// 						console.log(`${key}: ${reply}`);
// 					}
// 				});
// 			});
// 		}

// 		redisClient.dbsize((err, reply) => {
// 			if (reply) {
// 				console.log("There are " + reply + " keys.");
// 			}
// 		});
// 	});

// 	res.end();
// });

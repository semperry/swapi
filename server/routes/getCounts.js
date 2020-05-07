const countRouter = require("express").Router();

const [People, Planets, Films, Species, Vehicles, Starships] = [
	require("../models/peopleModel"),
	require("../models/planetModel"),
	require("../models/filmModel"),
	require("../models/speciesModel"),
	require("../models/vehicleModel"),
	require("../models/starshipModel"),
];
const models = [People, Planets, Films, Species, Vehicles, Starships];

// Get counts
countRouter.get("/all", (req, res) => {
	const counts = {};

	models.forEach((mod) => {
		mod.countDocuments((err, total) => {
			counts[mod.modelName] = total;

			if (Object.keys(counts).length === models.length) {
				res.status(200).json({
					message: "ok",
					counts,
				});
			}
		});
	});
});

module.exports = countRouter;

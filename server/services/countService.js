const models = ([People, Planets, Films, Species, Vehicles, Starships] = [
	require("../models/PeopleModel"),
	require("../models/PlanetModel"),
	require("../models/FilmModel"),
	require("../models/SpeciesModel"),
	require("../models/VehicleModel"),
	require("../models/StarshipModel"),
]);

const getAllCounts = async () => {
	const counts = {};

	try {
		for (const model of models) {
			const count = await model.countDocuments();

			counts[model.modelName] = count;
		}

		return counts;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	getAllCounts,
};

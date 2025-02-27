// Get all root info
const getRootData = ({ swapi_url }) => {
	try {
		const baseUrl = swapi_url + "/api";

		return {
			films: `${baseUrl}/films`,
			people: `${baseUrl}/people`,
			planets: `${baseUrl}/planets`,
			species: `${baseUrl}/species`,
			starships: `${baseUrl}/starships`,
			vehicles: `${baseUrl}/vehicles`,
		};
	} catch (err) {
		throw err;
	}
};

module.exports = {
	getRootData,
};

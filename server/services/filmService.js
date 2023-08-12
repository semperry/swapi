const Films = require("../models/FilmModel");

// Get All
const getAllFilms = async () => {
	try {
		const films = await Films.find();

		return films;
	} catch (error) {
		throw error;
	}
};

// Get by ID
const getFilmById = async (id) => {
	try {
		const film = await Films.findOne({ uid: id });

		return film;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	getAllFilms,
	getFilmById,
};

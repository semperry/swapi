const filmService = require("../services/filmService");
const withWookie = require("../utils/wookieeEncoding");
const { setCache } = require("../utils/cache");

// Get All Films
const getFilms = async (req, res) => {
	try {
		const films = await filmService.getAllFilms();

		if (!films) {
			return res.status(404).json({ message: "Films not found" });
		}

		return withWookie(req, res, films);
	} catch (err) {
		console.error("Get Films Error: ", err);

		return res
			.status(500)
			.json({ message: "Could not GET Films", errors: `${err}` });
	}
};

// Get Film by ID
const getFilm = async (req, res) => {
	const id = req.params.id;

	try {
		const film = await filmService.getFilmById(id);

		if (!film) {
			return res.status(404).json({ message: "Film not found" });
		}

		if (!isWookiee(req)) {
			setCache(req, film.toObject());
		}

		return withWookie(req, res, film);
	} catch (error) {
		console.error("Get Film Error: ", error);

		return res
			.status(500)
			.json({ message: "Could not GET Film", errors: `${error}` });
	}
};

module.exports = {
	getFilms,
	getFilm,
};

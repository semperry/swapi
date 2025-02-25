const lookup = {
	a: "ra",
	b: "rh",
	c: "oa",
	d: "wa",
	e: "wo",
	f: "ww",
	g: "rr",
	h: "ac",
	i: "ah",
	j: "sh",
	k: "or",
	l: "an",
	m: "sc",
	n: "wh",
	o: "oo",
	p: "ak",
	q: "rq",
	r: "rc",
	s: "c",
	t: "ao",
	u: "hu",
	v: "ho",
	w: "oh",
	x: "k",
	y: "ro",
	z: "uf",
};

const translateWookiee = (data) => {
	data = JSON.stringify(data);
	let encodedString = "";

	for (let i in data) {
		if (Object.keys(lookup).includes(data[i].toLowerCase())) {
			data[i] = data[i].toLowerCase();
		}

		if (lookup[data[i]]) {
			encodedString += lookup[data[i]];
		} else {
			encodedString += data[i];
		}
	}
	encodedString = JSON.stringify(encodedString);

	return JSON.parse(encodedString);
};

module.exports = withWookiee = (req, res, data) => {
	let results;
	let pager;

	if (!data.results) {
		results = { message: "ok", result: data };
	} else {
		pager = {
			message: "ok",
			total_records: data.total_records,
			total_pages: data.total_pages,
			previous: data.previous,
			next: data.next,
		};

		results = [...data.results];
	}

	const wookieeSpeak = translateWookiee(data);
	switch (req.encoding) {
		case "wookiee":
			return res.status(200).json(wookieeSpeak);
		case "json":
			return res
				.status(200)
				.json(!data.results ? results : { ...pager, results });
		default:
			return res
				.status(200)
				.json(!data.results ? results : { ...pager, results });
	}
};

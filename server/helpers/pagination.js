class Pagination {
	constructor(req, page, limit, total) {
		this.meta = {
			req,
			page,
			limit,
			total,
		};
		this.query = {};
	}

	paginate = () => {
		const { req, page, limit, total } = this.meta;

		this.query = {
			skip: limit * (page - 1),
			limit,
		};

		return {
			total_records: total,
			total_pages: Math.ceil(total / limit),
			previous:
				page === 1
					? null
					: `${req.swapi_url}/api${req.route.path}?page=${
							page - 1
					  }&limit=${limit}`,
			next:
				page >= Math.ceil(total / limit)
					? null
					: `${req.swapi_url}/api${req.route.path}?page=${
							page + 1
					  }&limit=${limit}`,
		};
	};

	static parseSkip = (page, limit, total) => {
		const pageNumber =
			page && limit
				? parseInt(page) < 1
					? 1
					: parseInt(page) > Math.ceil(total / limit)
					? Math.ceil(total / limit)
					: parseInt(page)
				: 1;

		const resultLimit =
			page && limit ? (parseInt(limit) > total ? total : parseInt(limit)) : 10;

		return { pageNumber, resultLimit };
	};
}

module.exports = Pagination;

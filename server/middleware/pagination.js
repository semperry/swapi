class Pagination {
  constructor(req, page, limit, total) {
    this.state = {
      req,
      page,
      limit,
      total,
    };
    this.query = {};
  }

  paginate = () => {
    const { req, page, limit, total } = this.state;
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
          : `http://localhost:4000/api${req.route.path}?page=${
              page - 1
            }&limit=${limit}`,
      next:
        page >= Math.ceil(total / limit)
          ? null
          : `http://localhost:4000/api${req.route.path}?page=${
              page + 1
            }&limit=${limit}`,
    };
  };
}

module.exports = Pagination;

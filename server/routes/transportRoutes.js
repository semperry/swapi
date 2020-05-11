require("dotenv").config();
const express = require("express");
const transportRouter = express.Router();

const verifyToken = require("../middleware/verifyToken");
const Paginate = require("../middleware/pagination");

// GET all transports
transportRouter.get("/transport", verifyToken, (req, res) => {
  const { page, limit } = req.query;

  TransportModel.countDocuments((err, total) => {
    if (err) {
      return res.status(400).json({ error: true, message: "Could not Count" });
    }
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

    const transportPagination = new Paginate(
      req,
      pageNumber,
      resultLimit,
      total
    );
    const pager = transportPagination.paginate();

    TransportModel.find({}, {}, transportPagination.query, (err, results) => {
      if (err) {
        res
          .status(400)
          .json({ message: "Could not GET transports", errors: `${err}` });
      } else if (results) {
        res.status(200).json({
          message: "ok",
          ...pager,
          results: results.map((transport) => {
            return {
              uid: transport.uid,
              name: transport.properties.name,
              url: transport.properties.url,
            };
          }),
        });
      } else {
        res.status(404).end();
      }
    });
  });
});

module.exports = transportRouter;

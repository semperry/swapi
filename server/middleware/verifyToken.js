const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies._token || "";

  try {
    if (!token) {
      return res
        .status(401)
        .json({ message: "not logged in", error: "No Session Found" });
    }

    const decrypt = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      _id: decrypt._id,
      roles: decrypt.roles,
    };
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "not logged in", error: `${error}` });
  }
};

module.exports = verifyToken;

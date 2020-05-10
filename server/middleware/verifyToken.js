const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies._token || "";

  try {
    if (!token) {
      return res
        .status(401)
        .json({ message: "not logged in", error: "No Session Found" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "invalid token", error: `${err}` });
      } else {
        req.user = {
          _id: decoded._id,
          roles: decoded.roles,
        };
        next();
      }
    });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "not logged in", error: `${error}` });
  }
};

module.exports = verifyToken;

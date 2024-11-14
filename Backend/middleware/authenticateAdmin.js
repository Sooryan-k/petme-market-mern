const admin = require("../firebase").admin;

const authenticateAdmin = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) return res.status(403).send("Unauthorized: No token provided");

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (decodedToken.admin) {
      // check if the user has the admin claim
      req.user = decodedToken;
      next();
    } else {
      res.status(403).send("Unauthorized: Admin access required");
    }
  } catch (error) {
    res.status(403).send("Unauthorized: Invalid token");
  }
};


module.exports = authenticateAdmin;

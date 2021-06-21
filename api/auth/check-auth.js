const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    //Bearer token
    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, process.env.JWT_KEY);
    req.userData = data;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Auth failed" });
  }
};

//4:51 ... 11.3.

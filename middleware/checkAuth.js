const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (!token) {
      return res.json({
        metadata: {
          message: "Unauthenticated! Please provide a valid token",
          data: false,
          error: true,
        },
        data: null,
        error: {
          message: "Please login and try again later.",
          code: 400,
        },
      });
    }
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userData = { id: data.id, email: data.email, phone: data.phone };
    next();
  } catch (err) {
    console.log(err);
    return res.json({
      metadata: {
        message: "Unauthenticated! Please provide a valid token",
        data: false,
        error: true,
      },
      data: null,
      error: {
        message: "Please login and try again later!",
        code: 400,
      },
    });
  }
};

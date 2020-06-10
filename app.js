const express = require("express");
const bodyParser = require("body-parser");
const commonHeaders = require("./middleware/common-headers");
const authRoutes = require("./routes/auth-routes");
const passport = require("passport");
const app = express();

app.use(bodyParser.json()); //parse request body

app.use(commonHeaders); //add common headers like  CORS

app.use(passport.initialize()); //init passport for fb authentication
app.use(passport.session());
require('./config/passport'); //passport config for facebook authentication

app.use("/api/v1/auth", authRoutes);

app.listen(5000);

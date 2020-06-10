const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcryptjs");
const HttpError = require("../models/http-error");

const DUMMY_USERS = [
  {
    id: "u1",
    email: "test@test.com",
    name: "Test test",
    image: "",
    account: {
      connectedVia: "email",
      secret: "test@123",
    },
  },
];

const facebookAuth = (req, res, next) => {
  DUMMY_USERS.push(req.user);
  return res.json({ user: req.user });
};

const googleAuth = async (req, res, next) => {
  const { token } = req.body;
  const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);
  let ticket;
  try {
    ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log(payload);
    const createdUser = {
      id: "u2",
      email: payload["email"],
      name: payload["given_name"] + " " + payload["family_name"],
      image: payload["picture"],
      account: {
        connectedVia: "google",
        secret: payload["sub"],
      },
    };
    DUMMY_USERS.push(createdUser);
    res.json({ user: createdUser });
  } catch (err) {
    console.log(err);
    res.json({ error: err.message });
  }
};

const emailSignup = async (req, res, next) => {
  const { name, email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 12);
  const createdUser = {
    id: "u2",
    email: email,
    name: name,
    image: "",
    account: {
      connectedVia: "email",
      secret: hashPassword,
    },
  };
  DUMMY_USERS.push(createdUser);
  res.json({ user: createdUser });
};

const emailLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find((user) => {
    return user.email === email;
  });
  if (!identifiedUser) {
    return next(
      new HttpError("Could not find any account with this email", 401)
    );
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(
      password,
      identifiedUser.account.secret
    );
    console.log("valid: " + isValidPassword); 
  } catch (err) {
    return next(new HttpError("Server error!", 500));
  }
  if (!isValidPassword) {
    return next(
      new HttpError("Please check your credentials and try again!", 401)
    );
  }
  res.json({ user: identifiedUser });
};

const getAllUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

exports.facebookAuth = facebookAuth;
exports.googleAuth = googleAuth;
exports.emailSignup = emailSignup;
exports.emailLogin = emailLogin;
exports.getAllUsers = getAllUsers;

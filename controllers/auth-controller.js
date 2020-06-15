const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcryptjs");
const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Test test",
    email: "test@test.com",
    emailVerified: false,
    phone: "",
    phoneVerified: false,
    image: "",
    events: [],
    account: {
      connectedVia: "email",
      secret: "test@123",
    },
  },
];

const facebookAuth = (req, res, next) => {
  if (req.user) {
    DUMMY_USERS.push(req.user);
  } else {
    const error = new HttpError("Authentication using FB failed!", 401);
    return next(error);
  }
  const token = jwt.sign(
    {
      id: req.user.id,
      email: req.user.email,
      phone: req.user.phone,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );
  res.setHeader("Authorization", "Bearer " + token);
  res.setHeader("Authorization-token-expiration", 1000 * 60 * 60);
  res.json({
    metdata: {
      message:
        "Facebook authentication successfull! Please find the auth token in the headers.",
      data: true,
    },
    data: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      emailVerified: req.user.emailVerified,
      phone: req.user.phone,
      phoneVerified: req.user.phoneVerified,
    },
  });
};

const googleAuth = async (req, res, next) => {
  const { idToken } = req.body;
  if (!idToken) {
    res.status(400);
    return next(new HttpError("idToken field expected!"), 400);
  }
  const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);
  let ticket;
  try {
    ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log(payload);
    const createdUser = {
      id: "u1",
      name: "Test test",
      email: "test@test.com",
      emailVerified: false,
      phone: "",
      phoneVerified: false,
      image: "",
      events: [],
      account: {
        connectedVia: "google",
        secret: payload["sub"],
      },
    };
    DUMMY_USERS.push(createdUser);
    const token = jwt.sign(
      {
        id: createdUser.id,
        email: createdUser.email,
        phone: createdUser.phone,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    res.setHeader("Authorization", "Bearer " + token);
    res.setHeader("Authorization-token-expiration", 1000 * 60 * 60);
    res.json({
      metdata: {
        message:
          "Google authentication successfull! Please find the auth token in the headers.",
        data: true,
      },
      data: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        emailVerified: createdUser.emailVerified,
        phone: createdUser.phone,
        phoneVerified: createdUser.phoneVerified,
      },
    });
  } catch (err) {
    res.status(401);
    return next(
      new HttpError("Authentication using google failed! " + err.message, 401)
    );
  }
};

const emailSignup = async (req, res, next) => {
  const { name, email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 12);
  const createdUser = {
    id: "u1",
    name: name,
    email: email,
    emailVerified: false,
    phone: "",
    phoneVerified: false,
    image: "",
    events: [],
    account: {
      connectedVia: "email",
      secret: hashPassword,
    },
  };
  DUMMY_USERS.push(createdUser);
  const token = jwt.sign(
    {
      id: createdUser.id,
      email: createdUser.email,
      phone: createdUser.phone,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );
  res.setHeader("Authorization", "Bearer " + token);
  res.setHeader("Authorization-token-expiration", 1000 * 60 * 60);
  res.json({
    metdata: {
      message:
        "Email authentication successfull! Please find the auth token in the headers.",
      data: true,
    },
    data: {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      emailVerified: createdUser.emailVerified,
      phone: createdUser.phone,
      phoneVerified: createdUser.phoneVerified,
    },
  });
};

const emailLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find((user) => {
    return user.email === email;
  });
  if (!identifiedUser) {
    res.status(400);
    return next(
      new HttpError("Could not find any account with this email", 400)
    );
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(
      password,
      identifiedUser.account.secret
    );
  } catch (err) {
    return next(new HttpError("Server error!", 500));
  }
  if (!isValidPassword) {
    res.status(400);
    return next(
      new HttpError("Please check your credentials and try again!", 400)
    );
  }
  const token = jwt.sign(
    {
      id: identifiedUser.id,
      email: identifiedUser.email,
      phone: identifiedUser.phone,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );
  res.setHeader("Authorization", "Bearer " + token);
  res.setHeader("Authorization-token-expiration", 1000 * 60 * 60);
  res.json({
    metdata: {
      message:
        "Email authentication successfull! Please find the auth token in the headers.",
      data: true,
    },
    data: {
      id: identifiedUser.id,
      name: identifiedUser.name,
      email: identifiedUser.email,
      emailVerified: identifiedUser.emailVerified,
      phone: identifiedUser.phone,
      phoneVerified: identifiedUser.phoneVerified,
    },
  });
};

const getAllUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

exports.facebookAuth = facebookAuth;
exports.googleAuth = googleAuth;
exports.emailSignup = emailSignup;
exports.emailLogin = emailLogin;
exports.getAllUsers = getAllUsers;

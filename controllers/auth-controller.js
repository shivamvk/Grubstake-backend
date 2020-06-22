const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { validationResult } = require("express-validator");

const facebookAuth = async (req, res, next) => {
  let fbid = null;
  let fbname = null;
  let fbemail = null;
  let fbimage = null;
  if (req.user) {
    fbid = req.user.id;
    fbname = req.user.name;
    fbemail = req.user.email;
    fbimage = req.user.image;
  } else {
    return res.json({
      metadata: {
        message: "Auhtentication using facebook failed!",
        data: false,
        error: true,
      },
      data: null,
      error: {
        message: "Auth using fb failed! try again later.",
        code: 400,
      },
    });
  }
  let userDataForResponse;
  const existingUserWithEmail = await User.findOne({ email: fbemail });
  if (!existingUserWithEmail) {
    userDataForResponse = new User({
      name: fbname,
      image: fbimage,
      email: fbemail,
      emailVerified: true,
      phone: null,
      phoneVerified: false,
      events: [],
      account: {
        google: {
          secret: null,
        },
        facebook: {
          secret: null,
        },
        email: {
          secret: null,
        },
      },
    });
    try {
      await userDataForResponse.save();
    } catch (err) {
      return res.json({
        metadata: {
          message: "Auhtentication using fb failed!",
          data: false,
          error: true,
        },
        data: null,
        error: {
          message: "Server error! Please try again later.",
          code: 400,
        },
      });
    }
  } else if (existingUserWithEmail.account.facebook.secret) {
    userDataForResponse = existingUserWithEmail;
  } else if (!existingUserWithEmail.account.facebook.secret) {
    existingUserWithEmail.account.facebook.secret = fbid;
    existingUserWithEmail.emailVerified = true;
    existingUserWithEmail.save();
    userDataForResponse = existingUserWithEmail;
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
  res.json({
    metadata: {
      message: "Facebook authentication successfull!",
      data: true,
    },
    data: {
      token: token,
      tokenExpirationTime: "1h",
      id: userDataForResponse.id,
      name: userDataForResponse.name,
      email: userDataForResponse.email,
      emailVerified: userDataForResponse.emailVerified,
      phone: userDataForResponse.phone,
      phoneVerified: userDataForResponse.phoneVerified,
    },
  });
};

const googleAuth = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      metadata: {
        message: "Auhtentication using google failed!",
        data: false,
        error: true,
      },
      data: null,
      error: {
        message: "Invalid inputs!",
        code: 400,
      },
    });
  }
  const { idToken, phone } = req.body;
  const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);
  let ticket;
  try {
    ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    let userDataForResponse;
    const existingUserWithEmail = await User.findOne({
      email: payload["email"],
    });
    if (!existingUserWithEmail) {
      userDataForResponse = new User({
        name: payload["name"],
        image: payload["picture"],
        email: payload["email"],
        emailVerified: payload["email_verified"],
        phone: phone || null,
        phoneVerified: false,
        events: [],
        account: {
          google: {
            secret: payload["sub"],
          },
          facebook: {
            secret: null,
          },
          email: {
            secret: null,
          },
        },
      });
      try {
        await userDataForResponse.save();
      } catch (err) {
        return res.json({
          metadata: {
            message: "Auhtentication using google failed!",
            data: false,
            error: true,
          },
          data: null,
          error: {
            message: "Google auth failed! Please try again later.",
            code: 400,
          },
        });
      }
    } else if (existingUserWithEmail.account.google.secret) {
      userDataForResponse = existingUserWithEmail;
    } else if (!existingUserWithEmail.account.google.secret) {
      existingUserWithEmail.account.google.secret = payload["sub"];
      existingUserWithEmail.emailVerified = true;
      await existingUserWithEmail.save();
      userDataForResponse = existingUserWithEmail;
    }
    const token = jwt.sign(
      {
        id: userDataForResponse.id,
        email: userDataForResponse.email,
        phone: userDataForResponse.phone,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    res.json({
      metadata: {
        message: "Google authentication successfull!",
        data: true,
      },
      data: {
        token: token,
        tokenExpirationTime: "1h",
        id: userDataForResponse.id,
        name: userDataForResponse.name,
        email: userDataForResponse.email,
        emailVerified: userDataForResponse.emailVerified,
        phone: userDataForResponse.phone,
        phoneVerified: userDataForResponse.phoneVerified,
      },
    });
  } catch (err) {
    return res.json({
      metadata: {
        message: "Auhtentication using google failed!",
        data: false,
        error: true,
      },
      data: null,
      error: {
        message: "Google auth failed! Please try again later.",
        code: 400,
      },
    });
  }
};

const emailSignup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      metadata: {
        message: "Auhtentication failed!",
        data: false,
        error: true,
      },
      data: null,
      error: {
        message: "Invalid inputs!",
        code: 400,
      },
    });
  }
  const { name, email, phone, image, password } = req.body;
  //console.log(email);
  const hashPassword = await bcrypt.hash(password, 12);
  let userDataForResponse;
  const existingUserWithEmail = await User.findOne({ email });
  const existingUserWithPhone = await User.findOne({ phone });
  //console.log(existingUserWithEmail + " " + email);
  if (!existingUserWithEmail && !existingUserWithPhone) {
    userDataForResponse = new User({
      name: name,
      image: image,
      email: email,
      emailVerified: false,
      phone: phone,
      phoneVerified: false,
      events: [],
      account: {
        google: {
          secret: null,
        },
        facebook: {
          secret: null,
        },
        email: {
          secret: hashPassword,
        },
      },
    });
    try {
      await userDataForResponse.save();
    } catch (err) {
      return res.json({
        metadata: {
          message: "Auhtentication failed!",
          data: false,
          error: true,
        },
        data: null,
        error: {
          message: "Server Error! Try again later.",
          code: 400,
        },
      });
    }
  } else {
    return res.json({
      metadata: {
        message: "Auhtentication failed!",
        data: false,
        error: true,
      },
      data: null,
      error: {
        message: "Email or phone already exists",
        code: 400,
      },
    });
  }
  const token = jwt.sign(
    {
      id: userDataForResponse.id,
      email: userDataForResponse.email,
      phone: userDataForResponse.phone,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );
  res.json({
    metadata: {
      message: "Email authentication successfull!",
      data: true,
    },
    data: {
      token: token,
      tokenExpirationTime: "1h",
      id: userDataForResponse.id,
      name: userDataForResponse.name,
      email: userDataForResponse.email,
      emailVerified: userDataForResponse.emailVerified,
      phone: userDataForResponse.phone,
      phoneVerified: userDataForResponse.phoneVerified,
    },
  });
};

const emailLogin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      metadata: {
        message: "Auhtentication failed!",
        data: false,
        error: true,
      },
      data: null,
      error: {
        message: "Invalid inputs!",
        code: 400,
      },
    });
  }
  const { email, password } = req.body;
  const identifiedUser = await User.findOne({ email });
  if (!identifiedUser) {
    return res.json({
      metadata: {
        message: "Auhtentication failed!",
        data: false,
        error: true,
      },
      data: null,
      error: {
        message: "Could not find any account with this email!",
        code: 400,
      },
    });
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(
      password,
      identifiedUser.account.email.secret.toString()
    );
  } catch (err) {
    return res.json({
      metadata: {
        message: "Auhtentication failed!",
        data: false,
        error: true,
      },
      data: null,
      error: {
        message: "Seems like you're connected via google/fb!",
        code: 400,
      },
    });
  }
  if (!isValidPassword) {
    return res.json({
      metadata: {
        message: "Auhtentication failed!",
        data: false,
        error: true,
      },
      data: null,
      error: {
        message: "Please check your credentials and try again!",
        code: 400,
      },
    });
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
  res.json({
    metadata: {
      message:
        "Email authentication successfull! Please find the auth token in the headers.",
      data: true,
    },
    data: {
      token: token,
      tokenExpirationTime: "1h",
      id: identifiedUser.id,
      name: identifiedUser.name,
      email: identifiedUser.email,
      emailVerified: identifiedUser.emailVerified,
      phone: identifiedUser.phone,
      phoneVerified: identifiedUser.phoneVerified,
    },
  });
};

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (e) {
    const error = new HttpError(e.message, 500);
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

exports.facebookAuth = facebookAuth;
exports.googleAuth = googleAuth;
exports.emailSignup = emailSignup;
exports.emailLogin = emailLogin;
exports.getAllUsers = getAllUsers;

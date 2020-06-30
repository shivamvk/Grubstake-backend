const mongoose = require("mongoose");
const User = require("../models/user");

const getCreatedEventsByUserId = async (req, res, next) => {
  const userId = req.userData.id;
  let events;
  try {
    const user = await User.findById(userId).populate("events");
    events = user.events;
  } catch (err) {
    return res.json({
      metadata: {
        message: "Server error! " + err.message,
        data: false,
        error: true,
      },
      data: null,
      error: {
        message: "Server error!",
        code: 400,
      },
    });
  }
  res.json({
    metadata: {
      message: "Events by user id.",
      data: true,
      error: false,
    },
    data: events.map((event) => {
      return event.toObject({ getters: true });
    }),
  });
};

const getUserProfile = async (req, res, next) => {
  const userId = req.userData.id;
  let identifiedUser;
  try {
    console.log(userId);
    identifiedUser = await User.findById(userId, ["-account", "-events"]);
  } catch (err) {
    console.log(err.message);
    return res.json({
      metadata: {
        message: "Server error",
        data: false,
        error: true,
      },
      error: {
        code: 500,
        message: "Server error " + err.message,
      },
    });
  }
  if(!identifiedUser){
    return res.json({
      metadata: {
        message: "User not found for provided token",
        data: false,
        error: true,
      },
      error: {
        code: 500,
        message: "Please login and try again",
      },
    });
  }
  res.json({
    metadata: {
      message: "User profile",
      data: true,
      error: false,
    },
    data: identifiedUser.toObject({ getters: true }),
  });
};

exports.getCreatedEventsByUserId = getCreatedEventsByUserId;
exports.getUserProfile = getUserProfile;

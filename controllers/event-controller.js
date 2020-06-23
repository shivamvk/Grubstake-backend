const Event = require("../models/event");
const mongoose = require("mongoose");
const User = require("../models/user");

const getCreatedEvents = async (req, res, next) => {
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

const createEvent = async (req, res, next) => {
  const { createdBy, type } = req.body;
  if (req.userData.id !== createdBy) {
    return res.json({
      metadata: {
        message: "Unauthorized",
        data: false,
        error: true,
      },
      data: null,
      error: {
        message: "You are not authorized to perform this action!",
        code: 400,
      },
    });
  }
  const createdEvent = new Event({
    creator: createdBy,
    basicDetails: {
      basics: {
        type: type,
      },
    },
  });
  let identifiedUser;
  try {
    identifiedUser = await User.findById(createdBy);
  } catch (err) {
    console.log(err);
  }
  if (!identifiedUser) {
    res.json({
      metadata: {
        message: "User not found for provided createdBy param",
        data: false,
        error: true,
      },
      data: null,
      error: {
        message: "Invalid user id",
        code: 400,
      },
    });
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdEvent.save({ session: sess });
    identifiedUser.events.push(createdEvent);
    await identifiedUser.save();
    await sess.commitTransaction();
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
      message: "Event created successfully!",
      data: true,
      error: false,
    },
    data: createdEvent.populate("creator").toObject({ getters: true }),
  });
};

const upsertBasicDetails = async (req, res, next) => {
  res.json({ okay: "kay" });
};

exports.getCreatedEvents = getCreatedEvents;
exports.createEvent = createEvent;
exports.upsertBasicDetails = upsertBasicDetails;

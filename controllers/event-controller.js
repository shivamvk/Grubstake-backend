const Event = require("../models/event");
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
  const userId = req.userData.userId;
  const { eventId, basicDetails } = req.body;
  let identfiedEvent;
  try {
    identfiedEvent = await Event.findById(eventId);
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
  if (!identfiedEvent) {
    return res.json({
      metadata: {
        message: "Event not found for provided event id",
        data: false,
        error: true,
      },
      data: null,
      error: {
        message: "Event not found",
        code: 400,
      },
    });
  }
  identfiedEvent.basicDetails.basics.title = basicDetails.basics.title;
  identfiedEvent.basicDetails.basics.logo = basicDetails.basics.logo;
  identfiedEvent.basicDetails.basics.orgName = basicDetails.basics.orgName;
  identfiedEvent.basicDetails.date.startDate = basicDetails.date.startDate;
  identfiedEvent.basicDetails.date.endDate = basicDetails.date.endDate;
  identfiedEvent.basicDetails.location.address = basicDetails.location.address;
  identfiedEvent.basicDetails.location.city = basicDetails.location.city;
  identfiedEvent.basicDetails.time.startTime = basicDetails.time.startTime;
  identfiedEvent.basicDetails.time.endTime = basicDetails.time.endTime;
  identfiedEvent.basicDetails.links.facebook = basicDetails.links.facebook;
  identfiedEvent.basicDetails.links.website = basicDetails.links.website;
  identfiedEvent.basicDetails.links.instagram = basicDetails.links.instagram;

  try {
    await identfiedEvent.save();
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
      message: "Basic details upserted successfully",
      data: true,
      error: false,
    },
    data: identfiedEvent.toObject({getters: true})
  });
};

exports.getCreatedEventsByUserId = getCreatedEventsByUserId;
exports.createEvent = createEvent;
exports.upsertBasicDetails = upsertBasicDetails;

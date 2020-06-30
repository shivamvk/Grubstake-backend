const Event = require("../models/event");
const mongoose = require("mongoose");
const User = require("../models/user");

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
    createdOn: new Date().toISOString(),
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
    data: identfiedEvent.toObject({ getters: true }),
  });
};

const upsertAudienceDetails = async (req, res, next) => {
  const { eventId, audienceDetails } = req.body;
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
  identfiedEvent.audienceDetails.expectedFootfall =
    audienceDetails.expectedFootfall;
  identfiedEvent.audienceDetails.audienceTypes = audienceDetails.audienceTypes;
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
      message: "Audience details upserted successfully",
      data: true,
      error: false,
    },
    data: identfiedEvent.toObject({ getters: true }),
  });
};

const upsertPitchDetails = async (req, res, next) => {
  const { eventId, pitchDetails } = req.body;
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
  identfiedEvent.pitchDetails.aboutEvent = pitchDetails.aboutEvent;
  identfiedEvent.pitchDetails.sponsorPitch = pitchDetails.sponsorPitch;
  identfiedEvent.pitchDetails.creatorDescription =
    pitchDetails.creatorDescription;
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
      message: "Pitch details upserted successfully",
      data: true,
      error: false,
    },
    data: identfiedEvent.toObject({ getters: true }),
  });
};

const setEventActivity = async (req, res, next) => {
  const { isActive, eventId } = req.body;
  console.log(
    "setEventActivity:: isActive: " + isActive + " eventId: " + eventId
  );
  if (isActive === undefined || eventId === undefined) {
    return res.json({
      metadata: {
        message: "Invalid inputs",
        data: false,
        error: true,
      },
      error: {
        code: 400,
        message: "Invalid inputs",
      },
    });
  }
  let identifiedEvent;
  try {
    identifiedEvent = await Event.findById(eventId);
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
        message: "Server error",
      },
    });
  }
  if (!identifiedEvent) {
    return res.json({
      metadata: {
        message: "Could not find event with provided id",
        data: false,
        error: true,
      },
      error: {
        code: 500,
        message: "Event does not exist",
      },
    });
  }
  identifiedEvent.isActive = isActive;
  try {
    await identifiedEvent.save();
  } catch (err) {
    return res.json({
      metadata: {
        message: "Server error",
        data: false,
        error: true,
      },
      error: {
        code: 500,
        message: "Server error",
      },
    });
  }
  res.json({
    metadata: {
      message: "Server error",
      data: true,
      error: false,
    },
    data: identifiedEvent.toObject({ getters: true }),
  });
};

exports.createEvent = createEvent;

exports.upsertBasicDetails = upsertBasicDetails;
exports.upsertAudienceDetails = upsertAudienceDetails;
exports.upsertPitchDetails = upsertPitchDetails;
exports.setEventActivity = setEventActivity;

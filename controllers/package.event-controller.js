const Event = require("../models/event");

const getPackageByEventId = async (req, res, next) => {
  const eventId = req.query.eventId;
  const userId = req.userData.id;
  if (!eventId) {
    return res.json({
      metadata: {
        message: "Please send eventId as a query param",
        data: false,
        error: true,
      },
      error: {
        code: 400,
        message: "Couldn't find event id",
      },
    });
  }
  let identifiedEvent;
  try {
    identifiedEvent = await Event.findById(eventId);
  } catch (err) {
    return res.json({
      metadata: {
        message: "Server error!",
        data: false,
        error: true,
      },
      error: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
  if (!identifiedEvent) {
    return res.json({
      metadata: {
        message: "Event not found with provided event id!",
        data: false,
        error: true,
      },
      error: {
        code: 404,
        message: "Could not find event",
      },
    });
  }
  if (identifiedEvent.creator.toString() !== userId) {
    return res.json({
      metadata: {
        message: "Unauthorized! You are'nt allowed to perform this action",
        data: false,
        error: true,
      },
      error: {
        code: 422,
        message: "You are'nt allowed to perform this action",
      },
    });
  }
  res.json({
      metadata: {
          message: "Packages by event id",
          data: true,
      },
      data: identifiedEvent.packages.map(package => {
          return package.toObject({getters: true});
      })
  });
};

const savePackage = async (req, res, next) => {
  const { eventId, sponsorOfferDetails, sponsorRequestDetails } = req.body;
  let identifiedEvent;
  try {
    identifiedEvent = await Event.findById(eventId);
  } catch (err) {
    return res.json({
      metadata: {
        message: "Server error!",
        data: false,
        error: true,
      },
      error: {
        code: 500,
        message: "Internal Server Error",
      },
    });
  }
  if (!identifiedEvent) {
    return res.json({
      metadata: {
        message: "Event not found with provided event id!",
        data: false,
        error: true,
      },
      error: {
        code: 404,
        message: "Could not find event",
      },
    });
  }
  const createdPackage = {
    sponsorOfferDetails: sponsorOfferDetails,
    sponsorRequestDetails: {
      selection: sponsorRequestDetails.selection,
      inCash:
        sponsorRequestDetails.selection !== "ONLY_GOODIES"
          ? sponsorRequestDetails.inCash
          : null,
      inKind:
        sponsorRequestDetails.selection !== "ONLY_CASH"
          ? sponsorRequestDetails.inKind
          : null,
    },
  };
  identifiedEvent.packages.push(createdPackage);
  try {
    await identifiedEvent.save();
  } catch (err) {
    console.log(err);
  }
  res.json({
    metadata: {
      message: "Package added successfully",
      data: true,
      error: false,
    },
    data: identifiedEvent.toObject({ getters: true }),
  });
};

exports.savePackage = savePackage;
exports.getPackageByEventId = getPackageByEventId;

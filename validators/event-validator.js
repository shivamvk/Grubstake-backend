const { body, validationResult } = require("express-validator");

const createEventValidationRules = () => {
  return [body("createdBy").notEmpty(), body("type").notEmpty()];
};

const basicDetailsValidationRules = () => {
  return [
    body("eventId").notEmpty(),
    body("basicDetails.basics.title").notEmpty(),
    body("basicDetails.basics.logo").notEmpty(),
    body("basicDetails.basics.orgName").notEmpty(),
    body("basicDetails.date.startDate").notEmpty(),
    body("basicDetails.location.address").notEmpty(),
    body("basicDetails.location.city").notEmpty(),
    body("basicDetails.time.startTime").notEmpty(),
    body("basicDetails.time.endTime").notEmpty(),
  ];
};

const audienceDetailsValidationRules = () => {
  return [
    body("eventId").notEmpty(),
    body("audienceDetails.expectedFootfall").isNumeric().notEmpty(),
    body("audienceDetails.audienceTypes").isArray().notEmpty(),
  ];
};

const pitchDetailsValidationRules =() => {
  return [
    body("eventId").notEmpty(),
    body("pitchDetails.aboutEvent").notEmpty(),
    body("pitchDetails.sponsorPitch").notEmpty(),
    body("pitchDetails.creatorDescription").notEmpty()
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.json({
      metadata: {
        message: "Validation failed!",
        data: false,
        error: true,
      },
      data: null,
      error: {
        message: "Invalid inputs!",
        code: 400,
      },
      errors: errors,
    });
  }
  next();
};

module.exports = {
  createEventValidationRules,
  basicDetailsValidationRules,
  audienceDetailsValidationRules,
  pitchDetailsValidationRules,
  validate,
};

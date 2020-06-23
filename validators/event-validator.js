const { body, validationResult } = require("express-validator");

const createEventValidationRules = () => {
  return [body("createdBy").notEmpty(), body("type").notEmpty()];
};

const basicDetailsValidationRules = () => {
  return [body("basicDetails.basics.orgName").notEmpty()];
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
    });
  }
  next();
};

module.exports = {
  createEventValidationRules,
  basicDetailsValidationRules,
  validate,
};

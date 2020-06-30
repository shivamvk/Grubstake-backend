const { body } = require("express-validator");

const createPackageValidationRules = () => {
  return [
    body("eventId").notEmpty(),
    body("sponsorRequestDetails.selection").notEmpty(),
    body("sponsorOfferDetails.offers").isArray().notEmpty(),
    body("sponsorOfferDetails.title").notEmpty(),
  ];
};

module.exports = {
  createPackageValidationRules,
};

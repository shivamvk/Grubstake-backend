const router = require("express").Router();
const eventController = require("../controllers/event-controller");
const packageController = require("../controllers/package.event-controller");
const checkAuth = require("../middleware/checkAuth");
const {
  createEventValidationRules,
  basicDetailsValidationRules,
  audienceDetailsValidationRules,
  validate,
} = require("../validators/event-validator");
const { createPackageValidationRules } = require("../validators/package.event-validator");

router.use(checkAuth);

router.get("/createdEvents", eventController.getCreatedEventsByUserId);

router.post(
  "/create",
  createEventValidationRules(),
  validate,
  eventController.createEvent
);

router.post(
  "/setActivity",
  createEventValidationRules(),
  validate,
  eventController.setEventActivity
);

router.post(
  "/basicDetails/upsert",
  basicDetailsValidationRules(),
  validate,
  eventController.upsertBasicDetails
);

router.post(
  "/audienceDetails/upsert",
  audienceDetailsValidationRules(),
  validate,
  eventController.upsertAudienceDetails
);

router.post(
  "/package/save",
  createPackageValidationRules(),
  validate,
  packageController.savePackage
);

router.get(
  "/package/byEventId",
  packageController.getPackageByEventId
)

module.exports = router;

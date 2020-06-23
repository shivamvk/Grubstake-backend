const router = require("express").Router();
const eventController = require("../controllers/event-controller");
const checkAuth = require("../middleware/checkAuth");
const {
  createEventValidationRules,
  basicDetailsValidationRules,
  validate,
} = require("../validators/event-validator");

router.use(checkAuth);

router.get("/createdEvents", eventController.getCreatedEvents);

router.post(
  "/create",
  createEventValidationRules(),
  validate,
  eventController.createEvent
);

router.post(
  "/upsert/basicDetails",
  basicDetailsValidationRules(),
  validate,
  eventController.upsertBasicDetails
);

module.exports = router;

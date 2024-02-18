const router = require("express").Router();
const subscriptionController = require("../../controller/subscription/subscriptionController");
const isAuthenticated = require("../../middleware/isAuthenticated");
router.get(
  "/subscription",
  isAuthenticated,
  subscriptionController.displaySubscriptionPage
);

router.post(
  "/subscription",
  isAuthenticated,
  subscriptionController.subscription
);

module.exports = router;

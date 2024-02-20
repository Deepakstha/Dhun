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

router.get(
  "/artist-subscription/:id",
  subscriptionController.displayArtistSubscription
);
router.post(
  "/artist-subscription",
  subscriptionController.artistPaySubscription
);

router.get(
  "/subscribe-artist",
  isAuthenticated,
  subscriptionController.displayArtistSubscriptionPage
);

router.post(
  "/subscribe-artist",
  isAuthenticated,
  subscriptionController.artistSubscribe
);

module.exports = router;

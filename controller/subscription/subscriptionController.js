const Subscription = require("../../models").subscription;

exports.displaySubscriptionPage = async (req, res) => {
  const token = req.cookies.token;
  const message = req.flash("message");
  res.render("subscription", { token, userData: req?.user, message });
};

exports.subscription = async (req, res) => {
  const subscriptionAmount = 500;
  const userId = req.userId;
  const { amount } = req.body;
  if (amount < subscriptionAmount) {
    req.flash("message", "The amount should be at least 500");
    return res.redirect("/subscription");
  }
  const findSub = await Subscription.findOne({
    where: {
      userId,
    },
  });
  if (findSub) {
    req.flash("message", `You already have Subscription of ${findSub.amount}`);
    return res.redirect("/subscription");
  }
  const sub = await Subscription.create({
    amount,
    userId,
  });
  req.flash("message", "Subscribed");
  return res.redirect("/subscription");
};

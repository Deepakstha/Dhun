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

exports.displayArtistSubscription = async (req, res) => {
  const message = req.flash("message");
  const artistId = req.params.id;
  return res.render("artistpaylogin", { message, artistId });
};

exports.artistPaySubscription = async (req, res) => {
  const subscriptionAmount = 1000;
  const { amount, artistId } = req.body;
  if (amount < subscriptionAmount) {
    req.flash("message", "The amount should be at least 1000");
    return res.redirect(`/artist-subscription/${artistId}`);
  }
  const sub = await Subscription.create({
    amount,
    userId: artistId,
  });
  req.flash("message", "Subscribed");
  return res.redirect("/login");
};

exports.displayArtistSubscriptionPage = (req, res) => {
  const token = req.cookies.token;
  const message = req.flash("message");
  return res.render("subscription-artist", {
    token,
    userData: req?.user,
    message,
  });
};

exports.artistSubscribe = async (req, res) => {
  const subscriptionAmount = 1000;
  const userId = req.userId;
  const { amount } = req.body;
  if (amount < subscriptionAmount) {
    req.flash("message", "The amount should be at least 1000");
    return res.redirect(`/subscribe-artist`);
  }
  const sub = await Subscription.create({
    amount,
    userId,
  });
  req.flash("message", "Subscribed");
  return res.redirect("/upload-song");
};

module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define("subscription", {
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return Subscription;
};

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "listener", "artist"),
      defaultValue: "listener",
      allowNull: false,
    },
    avatar: {
      type: DataTypes.TEXT,
      defaultValue: "/uploads/avatar/avatar.png",
    },
  });
  return User;
};

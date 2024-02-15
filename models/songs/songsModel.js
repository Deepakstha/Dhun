module.exports = (sequelize, DataTypes) => {
  const Songs = sequelize.define("songs", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    audioPath: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });
  return Songs;
};

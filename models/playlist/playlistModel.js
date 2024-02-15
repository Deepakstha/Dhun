module.exports = (sequelize, DataTypes) => {
  const PlayList = sequelize.define("playlist", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return PlayList;
};

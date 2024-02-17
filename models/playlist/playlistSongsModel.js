module.exports = (sequelize, DataTypes) => {
  const PlayListSongs = sequelize.define("playlistSongs", {});
  return PlayListSongs;
};

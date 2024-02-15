const dbConfig = require("../config/dbConfig");

const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  pool: dbConfig.pool,
  logging: false,
  timezone: "+05:45",
});

const dbConnection = () => {
  sequelize
    .authenticate()
    .then(() => {
      console.log("DATABASE CONNECTED!!");
    })
    .catch((err) => {
      console.log("Error" + err);
    });
};
dbConnection();

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./user/userModel")(sequelize, DataTypes);
db.songs = require("./songs/songsModel")(sequelize, DataTypes);
db.playlist = require("./playlist/playlistModel")(sequelize, DataTypes);
db.like = require("./likes/likesModel")(sequelize, DataTypes);

//relation with user and songs
db.user.hasMany(db.songs, { onDelete: "cascade", constraints: true });
db.songs.belongsTo(db.user);

db.user.hasMany(db.playlist, { onDelete: "cascade", constraints: true });
db.playlist.belongsTo(db.user);

db.songs.hasMany(db.playlist, { onDelete: "cascade", constraints: true });
db.playlist.belongsTo(db.songs);

db.songs.hasMany(db.like, {
  as: "Likes",
  onDelete: "cascade",
  constraints: true,
});
db.like.belongsTo(db.songs);
db.user.hasMany(db.like, { foreignKey: { allowNull: false } });

//Sync
db.sequelize.sync({ force: false }).then(() => {
  console.log("yes re-sync done");
});

module.exports = db;

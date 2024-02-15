const {
  MYSQLDATABASE,
  CHECKOMMIT,
  MYSQLHOST,
  MYSQLPASSWORD,
  MYSQLUSER,
  MYSQLPORT,
} = require("./secret");

if (CHECKOMMIT == "dev") {
  console.log("Server is running on Development...");
  module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "",
    DB: "dhun",
    dialect: "mysql",
    port: 3306,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  };
} else {
  console.log("Server is running on Production...");
  module.exports = {
    HOST: MYSQLHOST,
    USER: MYSQLUSER,
    PASSWORD: MYSQLPASSWORD,
    DB: MYSQLDATABASE,
    dialect: "mysql",
    port: MYSQLPORT,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    retry: {
      max: 20,
      match: [/ETIMEDOUT/, /EAI_AGAIN/],
    },
  };
}

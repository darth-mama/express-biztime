/** Database setup for BizTime. */

const { Client } = require("pg");

// Define the URI for the biztime database
const DB_URI = "postgresql:///biztime";
const db = new Client({
  connectionString: DB_URI,
});

// Connect to the database
db.connect()
  .then(() => console.log("Connected to the database"))
  .catch((e) => console.error("Error connecting to the database", e));

// Export the client object
module.exports = db;

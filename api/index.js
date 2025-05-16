const serverless = require("serverless-http");
const app = require("../server.js"); // adjust if your server.js is renamed or moved

module.exports = serverless(app);

const products = require('./products.js');
const user = require('./user.js');

module.exports = function(app) {
	app.use("/api", products);
	app.use("/", user);
};
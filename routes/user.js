const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../db/models/User');
const BC_SECRET = "this\/is\/SoM3\/\/secret";
const MONGO_URL = "mongodb://localhost:27017/ikse";
const JWT_SECRET = 'wellThiSisSomesecretTeXt123';

router.post('/login', function(req, res) {
	const { email, password } = req.body;


	// const user = users.find(u => { return u.email === email && bcrypt.compareSync(password, u.password) });
	User.findOne({ email }, function(err, user) {
		if (err) return req.json({ message: "Something went wrong. Please try again later." });

		if (user) {
			const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET);
			res.json({ token, email, role: user.role });
		} else {
			res.json({ message: "Email or password incorrect" });
		}
	});

});

router.post('/register', function(req, res) {
	const { email, password } = req.body;

	const newUser = new User({ email, password, role: "user" });

	newUser.save(function(err) {
		if (err) return res.json({ error: true, message: err.message });
		return res.json({ error: false, message: "Ok" });
	});
});

module.exports = router;
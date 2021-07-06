const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const ejwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const User = require('./db/models/User');
const Product = require('./db/models/Product');

const BC_SECRET = "this\/is\/SoM3\/\/secret";
const MONGO_URL = "mongodb://localhost:27017/ikse";
mongoose.connect(MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});

// const userSchema = new mongoose.Schema({
// 	email: String,
// 	role: String,
// 	password: String,
// });
// const productSchema = new mongoose.Schema({
// 	title: String,
// 	price: Number,
// 	image: String,
// 	description: String,
// });

// const User = mongoose.model('User', userSchema);
// const Product = mongoose.model('Product', productSchema);

// User.find(function(err, users) {
// 	if (err) return console.error(err);
// 	users[0].password = "ditiseentest";
// 	users[0].save(function(err) {console.error(err);});
// 	console.log(users);
// });

User.findOne({ email: 'admin@test.com' }, function(err, user) {
  if (!user) {
    adminUser = new User({
      email: 'admin@test.com',
      password: 'anadmin',
      role: 'admin'
    });
    adminUser.save();
  }
});



const JWT_SECRET = 'wellThiSisSomesecretTeXt123';

// const users = [
//     {
//         email: 'test@test.com',
//         password: bcrypt.hashSync('password123admin', 10),
//         role: 'admin'
//     }, {
//         email: 'anna@test.com',
//         password: bcrypt.hashSync('password123member', 10),
//         role: 'member'
//     }
// ];

var originsWhitelist = [
  'http://localhost:4200',
   // 'http://www.myproductionurl.com'
];
var corsOptions = {
  origin: function(origin, callback){
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
  },
  credentials:true
};

app.use(cors(corsOptions));


app.use(express.json());

const checkAuth = ejwt({ secret: JWT_SECRET, algorithms: ['HS256'] });

app.get('/protected',
  checkAuth,
  function(req, res) {
    if (req.user.role !== "admin") return res.sendStatus(401);
    res.sendStatus(204);
  });

app.get('/user', checkAuth, function(req, res) {
	res.json(req.user);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const initRoutes = require('./routes')(app);
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
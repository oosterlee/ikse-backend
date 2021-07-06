const express = require('express');
const router = express.Router();
const Product = require('../db/models/Product');

const JWT_SECRET = 'wellThiSisSomesecretTeXt123';

const checkAuth = ejwt({ secret: JWT_SECRET, algorithms: ['HS256'] });

router.get('/products', function(req, res) {

	Product.find(function(err, products) {
		if (err) return res.json({ message: "Some error occured. Please try again later." });

		res.json({ items: products, colrows: [] });
	});
	// res.json({
	// 	items: [
	// 		{ id: 1, title: "P1", image: undefined, price: 14.99, description: "Dit is een test product" },
	// 		{ id: 2, title: "P2", image: undefined, price: 9.99, description: "Dit is nog een test product met een langere beschrijving" },
	// 		{ id: 3, title: "P3", image: undefined, price: 10.99, description: "Dit is nog een test product met een langere beschrijving" },
	// 		{ id: 4, title: "P4", image: undefined, price: 11.99, description: "Dit is nog een test product met een langere beschrijving" },
	// 		{ id: 5, title: "P5", image: undefined, price: 12.99, description: "Dit is nog een test product met een langere beschrijving" },
	// 		{ id: 6, title: "P6", image: undefined, price: 13.99, description: "Dit is nog een test product met een langere beschrijving" },
	// 	],
	// 	colrows: {
	// 		handset: { "1": { cols: 1, rows: 1 } },
	// 		tablet: { "1": { cols: 2, rows: 1 } },
	// 		web: { "1": { cols: 3, rows: 2 }, "2": { cols: 2, rows: 1 } },
	// 	},
	// });
});

router.get('/product/:id', function(req, res) {
	Product.findById(req.params.id).then(product => {
		res.json({ ...product._doc, error: false });
	}).catch(err => {
		res.json({ error: true, message: "Product not found" });
	})
});

router.delete('/product/:id', checkAuth, function(req, res) {
	if (req.user.role !== "admin") return res.sendStatus(401);
	console.log("DELETE", req.params.id);
	Product.findByIdAndDelete(req.params.id).then(product => {
		Product.find(function(err, products) {
			if (err) return res.json({ message: "Some error occured. Please try again later." });

			res.json({ items: products, colrows: [] });
		});
	}).catch(err => {
		Product.find(function(err, products) {
			if (err) return res.json({ message: "Some error occured. Please try again later." });

			res.json({ items: products, colrows: [] });
		});
	});
});

router.post('/product', checkAuth, function(req, res) {
	if (req.user.role !== "admin") return res.sendStatus(401);

	console.log("POST", req.body);
	let uError = true;

	const newProduct = new Product(req.body);
	newProduct.save(function(err) {
		if (err) return res.json({ error: true, message: err.message });
		return res.json({ error: false, message: "Ok" });
	});
});

router.put('/product/:id', checkAuth, function(req, res) {
	if (req.user.role !== "admin") return res.sendStatus(401);
	console.log("PUT", req.body);

	Product.findById(req.params.id).then(product => {
		const { title, image, price, description } = req.body;
		product.title = title;
		product.image = image;
		product.price = price;
		product.description = description;
		product.save(function(err) {
			if (err) return res.json({ error: true, message: err.message });
			return res.json({ error: false, message: "Ok" });
		});
	}).catch(err => {
		return res.json({ error: true, message: "Something unknown went wrong. Please try again at a later time." });
	});
});

module.exports = router;
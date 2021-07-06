var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var ProductSchema = new Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    description: { type: String, required: true },
});

module.exports = mongoose.model("Product", ProductSchema);
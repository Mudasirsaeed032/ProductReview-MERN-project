const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    company: String
})


const Product = mongoose.model('Product', productSchema);
module.exports = Product;
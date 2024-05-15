const mongoose = require('mongoose');

const product = require('../models/products');
const productSeed = require('./productSeed');

mongoose.connect('mongodb://localhost:27017/ProductReview')
    .then(() => {
        console.log("Mongo Connection Open");
    })
    .catch(error => {
        console.log("There has been an error Sire!");
        console.log(error);
    });

const seedDB = async () => {
    await product.deleteMany({});
    for(let i = 0; i < 11; i++){
        const newProduct = new product({
            title: `${productSeed[i].title}`,
            price: `${productSeed[i].price}`,
            description: `${productSeed[i].description}`,
            company: `${productSeed[i].company}`,
            img: `${productSeed[i].img}`
        });
        await newProduct.save()
        .then(data =>{
            console.log(data);
        })
        .catch(error =>{
            console.log(error);
        });
    }

    // Fetch all products after they have been inserted
    const products = await product.find();
    console.log(products);
}

seedDB();
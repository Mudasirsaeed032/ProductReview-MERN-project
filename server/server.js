const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/user');
const Product = require('./models/products');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ProductReview')
  .then(()=>{
    console.log('MongoDB has connected!');
  })
  .catch((err)=>{
    console.log('Error: ', err);
  });
}


const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{
    res.send('Hello World');
})


app.post('/login',async (req,res)=>{
    const { email, password } = req.body;
    await User.findOne({email: email})
    .then((user)=>{
        if(user){
            if(user.password === password){
                res.json("True");
            }else{
                res.json('False password');
            }
        }
        else{
            res.json('There is no user');
        }
    })
})

app.post('/signup', (req, res)=>{
    User.create(req.body)
    .then((user)=>{
        res.json(user);
    })
    .catch((err)=>{
        res.json(err);
    });
})

app.get('/home',async (req,res)=>{
    await Product.find()
    .then((products)=>{
        res.json(products);
    })
    .catch((err)=>{
        res.json(err);
    });
})

app.get('/product/:id',async (req,res)=>{
    const { id } = req.params;
    await Product.findById(id)
    .then((products)=>{
        res.json(products);
    })
    .catch((err)=>{
        res.json(err);
    });
})

app.listen(3000, ()=>{
    console.log("Server is running on port 3000!");
})
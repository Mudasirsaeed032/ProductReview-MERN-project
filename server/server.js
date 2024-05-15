const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const User = require('./models/user');
const Product = require('./models/products');
const Review = require('./models/reviews');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/ProductReview')
        .then(() => {
            console.log('MongoDB has connected!');
        })
        .catch((err) => {
            console.log('Error: ', err);
        });
}


const app = express();
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true
}
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json('Token not found');
    }
    else {
        jwt.verify(token, 'secretkey1234', (err, data) => {
            if (err) {
                return res.json('Invalid token');
            }
            else {
                next();
            }
        });
    }
}

app.get('/', (req, res) => {
    res.send('Hello World');
})


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    await User.findOne({ email: email, })
        .then((user) => {
            if (user) {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (result) {
                        const token = jwt.sign({ email: user.email }, 'secretkey1234', { expiresIn: '1d' });
                        res.cookie('token', token);
                        res.json('True');
                    }
                    else {
                        res.json('False');
                    }

                })
            }
            else {
                res.json('There is no user');
            }
        })
})

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password, 10)
        .then((hash) => {
            User.create({
                name: name,
                email: email,
                password: hash
            })
                .then((user) => {
                    res.json(user);
                })
                .catch((err) => {
                    res.json(err);
                });
        })

})

app.get('/home', verifyUser, async (req, res) => {
    const token = req.cookies.token;
    jwt.verify(token, 'secretkey1234', async (err, data) => {
        if (err) {
            res.json({ message: 'You should log in' });
        }
        else {
            await User.findOne({ email: data.email })
                .then((user) => {
                    if (!user) {
                        res.json({ message: 'User not found' });
                    } else {
                        Product.find()
                            .then((products) => {
                                res.json({ message: 'Success', user, products });
                            })
                            .catch((err) => {
                                res.json(err);
                            });
                    }
                })
                .catch((err) => {
                    res.json(err);
                });
        }
    });
});

app.post('/home', function (req, res) {
    // handle logout here
    // you might want to destroy the user session and then redirect to the login page
    res.send('Logged out');
});

app.get('/product/:id', verifyUser, async (req, res) => {
    const { id } = req.params;
    const token = req.cookies.token;
    jwt.verify(token, 'secretkey1234', async (err, data) => {
        if (err) {
            res.json({ message: 'You should log in' });
        }
        else {
            await User.findOne({ email: data.email })
                .then((user) => {
                    if (!user) {
                        res.json({ message: 'User not found' });
                    } else {
                        Product.findById(id)
                            .then((product) => {
                                res.json({ message: 'Success', user, product });
                            })
                            .catch((err) => {
                                res.json(err);
                            });
                    }
                })
                .catch((err) => {
                    res.json(err);
                });
        }
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000!");
})
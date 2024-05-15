const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const session = require('express-session');
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
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
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

app.use(session({
    secret: 'secretkey1234', // replace with your own secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set to true if you're using https
}));

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

app.post('/product/:id/review', async (req, res) => {
    const { id } = req.params;
    const { title, description, starRatings, user } = req.body;
    await Product.findById(id)
        .then((product) => {
            if (!product) {
                res.json('Product not found');
            }
            else {
                Review.create({
                    title: title,
                    description: description,
                    starRatings: starRatings,
                    user: user,
                    product: product._id
                })
                    .then((review) => {
                        res.json(review);
                    })
                    .catch((err) => {
                        res.json(err);
                    });
            }
        })
});

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
                                Review.find()
                                    .then((reviews) => {
                                        res.json({ message: 'Success', user, products, reviews });
                                    })
                                    .catch((err) => {
                                        res.json(err);
                                    });
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
    // res.clearCookie('token');
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
                                Review.find({ product: id })
                                    .then((reviews) => {
                                        res.json({ message: 'Success', user, product, reviews });
                                    })
                                    .catch((err) => {
                                        res.json(err);
                                    });
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

app.get('/product/:id/review', verifyUser, async (req, res) => {
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

app.get('/profile/:id', verifyUser, async (req, res) => {
    const { id } = req.params;
    const token = req.cookies.token;
    console.log
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
                        User.findById(id)
                            .then((profile) => {
                                // Fetch reviews associated with the user
                                Review.find({ user: id })
                                    .then((reviews) => {
                                        // Fetch products associated with the user
                                        Product.find({ user: id })
                                            .then((products) => {
                                                res.json({ message: 'Success', user, profile, reviews, products });
                                            })
                                            .catch((err) => {
                                                res.json({ message: err });
                                            });
                                    })
                                    .catch((err) => {
                                        res.json(err);
                                    });
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


app.delete('/review/:id', async (req, res) => {
    const { id } = req.params;
    await Review.findByIdAndDelete(id)
        .then((review) => {
            if (!review) {
                res.json({ message: 'Review not found' });
            } else {
                res.json({ message: 'Review deleted successfully' });
            }
        })
        .catch((err) => {
            res.json(err);
        });
});

app.put('/review/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, starRatings } = req.body;

    try {
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.title = title;
        review.description = description;
        review.starRatings = starRatings;

        await review.save();

        res.json({ message: 'Review updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000!");
})
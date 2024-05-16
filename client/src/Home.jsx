import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import './Home.css'
import { Link, useNavigate } from 'react-router-dom'
import { Carousel } from 'react-bootstrap';
import ReactStars from "react-rating-stars-component";


function Home() {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [reviews, setReviews] = useState([]);


    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get('http://localhost:3000/home', { withCredentials: true })
            .then((res) => {
                console.log(res.data);
                if (res.data.user) {
                    setUser(res.data.user);
                }
                if (res.data.products) {
                    setProducts(res.data.products);
                }
                if (res.data.reviews) {
                    setReviews(res.data.reviews); // Assuming you have a state variable called reviews
                }
            })
            .catch((err) => {
                console.log(err);
            })
        setIsLoading(false);
    }, [])
    const handleLogout = () => {
        axios.post('http://localhost:3000/home')
            .then((res) => {
                console.log(res.data);
                setUser(null);
            })
            .catch((err) => {
                console.log(err);
            })
        setIsLoggedIn(false); // Add this line

    }

    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <nav className="navbar navbar-expand-lg sticky-top">
                <a className="navbar-brand" href="#"></a>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <h1 id='hey'>Hey, {user ? <Link id='link' to={`/profile/${user._id}`}>{user.name}</Link> : 'Guest'}</h1>
                </div>
                <div>
                    <ul className="navbar-nav mr-auto">
                        <li className='nav-item'>
                            {isLoggedIn ? (
                                <button onClick={handleLogout}>Logout</button>
                            ) : (
                                <Link to="/login"><button>Login</button></Link>
                            )}
                        </li>
                    </ul>
                </div>
            </nav>
            <Carousel>
                {products.map((product, index) => (
                    <Carousel.Item key={index}>
                        <img
                            className="d-block w-100"
                            src={`http://localhost:5173/src/images/${product.img}.png`} // Assuming your product object has an image property
                            alt={product.title} // Assuming your product object has a name property
                        />
                        <Carousel.Caption>
                            <h1>{product.title}</h1>
                            <p>${product.price}</p>
                            <p id='desc'>{product.description}</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
            <div className="container-fluid">
                <div className="row">
                    {products.map((product, i) => (
                        <div className="col-md-4" key={i}>
                            <div className="card" id="product-card">
                                <div className="content">
                                    <h2>{product.title}</h2>
                                    <p>${product.price}</p>
                                    <Link to={`/product/${product._id}`}>Read Reviews</Link>
                                </div>
                                <img src={`http://localhost:5173/src/images/${product.img}.png`} alt="Product" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="row">
                    <h1 style={{ textAlign: 'center', margin: '50px 0' }}>Latest Reviews</h1>
                    {reviews.slice(-5).reverse().map((review, i) => (
                        <div className="card" style={{ '--i': i }} key={i}>
                            <div className="content" style={{ '--j': i + 1 }}>
                                <h2>Review Title: <b>{review.title}</b></h2>
                                <ReactStars
                                    count={5}
                                    value={review.starRatings}
                                    size={34}
                                    edit={false}
                                    activeColor="#ffd700"
                                />
                                <p>{review.description}</p>
                                <p>Submitted by {review.user}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default Home

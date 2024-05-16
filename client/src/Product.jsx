import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import ReactStars from "react-rating-stars-component";
import './Product.css';

function Product() {
    const [product, setProduct] = useState({});
    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]); // Add this line
    const { id } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:3000/product/${id}`, { withCredentials: true })
            .then((res) => {
                console.log(res.data);
                setProduct(res.data.product);
                sessionStorage.setItem('product', JSON.stringify(res.data.product));
                if (res.data.user) {
                    setUser(res.data.user);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                }
                if (res.data.reviews) {
                    setReviews(res.data.reviews);
                    sessionStorage.setItem('reviews', JSON.stringify(res.data.reviews));
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }, [id])

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedProduct = sessionStorage.getItem('product');
        const storedReviews = sessionStorage.getItem('reviews');
        if (storedUser && storedUser !== "undefined") {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing user data from local storage:', error);
            }
        }
        if (storedProduct && storedProduct !== "undefined") {
            try {
                setProduct(JSON.parse(storedProduct));
            } catch (error) {
                console.error('Error parsing product data from session storage:', error);
            }
        }
        if (storedReviews && storedReviews !== "undefined") {
            try {
                setReviews(JSON.parse(storedReviews));
            } catch (error) {
                console.error('Error parsing reviews data from session storage:', error);
            }
        }
    }, [])

    return (
        <div>

            <div className='container-fluid'>
                <h1>Product reviews for {product.title}</h1>
                <div className="row">
                    <div className="col-md-4">
                        <div className="card" id='product'>
                            <div className="content">
                                <h2>{product.title}</h2>
                                <p>${product.price}</p>
                                <p>{product.description}</p>
                            </div>
                            <img src={`http://localhost:5173/src/images/${product.img}.png`} alt="Product" />
                        </div>
                    </div>
                </div>
                <Link to={`/product/${id}/review`} className="btn btn-primary rounded-3">Review</Link>
                <div id='reviews'>
                    {reviews.map((review, index) => (
                        <div key={index}>
                            <h3>{review.title}</h3>
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
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Product; 
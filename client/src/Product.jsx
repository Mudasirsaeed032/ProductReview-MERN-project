import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function Product() {
    const [product, setProduct] = useState({});
    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]); // Add this line
    const { id } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:3000/product/${id}`, {withCredentials: true})
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
            {product ? (
                <>
                    <div>{product.title}</div>
                    <div>{product.price}</div>
                    <div>{product.description}</div>
                </>
            ) : (
                <div>Loading...</div>
            )}
            <div>{user ? `Welcome, ${user.name}` : 'Welcome, Guest'}</div>
            <Link to={`/product/${id}/review`} className="btn btn-primary rounded-3">Review</Link>
            {reviews.map((review, index) => (
                <div key={index}>
                    <h3>{review.title}</h3>
                    <p>{review.description}</p>
                    <p>Submitted by {review.user}</p>
                    <p>Rating: {review.starRatings}</p>
                </div>
            ))}
        </div>
    )
}

export default Product; 
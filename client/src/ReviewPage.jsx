import React, { useState, useEffect } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

function ReviewPage() {
    const [product, setProduct] = useState({});
    const [user, setUser] = useState({});
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [rating, setRating] = useState(0);
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
            })
            .catch((err) => {
                console.log(err);
            })
    }, [id])

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedProduct = sessionStorage.getItem('product');
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
    }, [])
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!title || !description || !rating) {
            alert('All fields are required!');
            return;
        }
        axios.post(`http://localhost:3000/product/${id}/review`,
            {
                title,
                description,
                starRatings: rating,
                user: user._id,
                product: product._id
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }, { withCredentials: true })
            .then((res) => {
            if (res.status === 200) {
                console.log(res.data);
                alert('Review has been submitted successfully!');
            } else {
                alert('There was an error submitting your review. Please try again.');
            }
        })
            .catch((err) => {
                console.log(err);
                alert('There was an error submitting your review. Please try again.');
            });

    };
    return (
        <div>
            <h1>Welcome to the review page, {user ? user.name : 'Guest'}</h1>
            <h3>What is your review about this product: {product ? product.title : 'some product'} priced at: {`$${product.price}`}</h3>
            <div className='d-flex justify-content-center align-items-center bg-secondary vh-100 vw-100'>
                <div className='bg-white p-3 rounded w-50'>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title</label>
                            <input type="text" className="form-control" id="title"
                                onChange={(data) => {
                                    setTitle(data.target.value);
                                }} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea type="textbox" className="form-control" id="description" aria-describedby="emailHelp"
                                onChange={(data) => {
                                    setDescription(data.target.value);
                                }} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="rating">Example select</label>
                            <select className="form-control" id="rating" value={rating} onChange={(e) => setRating(e.target.value)}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-success rounded-3">Submit Review</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ReviewPage

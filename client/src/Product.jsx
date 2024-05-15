import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Product() {
    const [product, setProduct] = useState({});
    const [user, setUser] = useState(null); // Add this line
    const navigate = useNavigate();
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
        </div>
    )
}

export default Product

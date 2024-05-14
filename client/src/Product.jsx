import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Product() {
    const [product, setProduct] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:3000/product/${id}`)
            .then((res) => {
                console.log(res.data);
                setProduct(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [id])
    return (
        <div>
            <div>{product.title}</div>
            <div>{product.price}</div>
            <div>{product.description}</div>
        </div>
    )
}

export default Product

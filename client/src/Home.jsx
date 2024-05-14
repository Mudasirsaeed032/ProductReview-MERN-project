import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import './Home.css'
import {Link, useNavigate} from 'react-router-dom'

function Home() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        axios.get('http://localhost:3000/home')
            .then((res) => {
                console.log(res.data);
                setProducts(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])
    
    
    return (
        <div className="container-fluid">
            <div className="row">
                {products.map((product, i) => (
                    <div className="col-md-4" key={i}>
                        <div className="card">
                            <div className="content">
                                <h2>{product.title}</h2>
                                <p>${product.price}</p>
                                <Link to={`/product/${product._id}`}>Read Reviews</Link>
                            </div>
                            <img src="http://localhost:5173/src/images/laptop.png" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home

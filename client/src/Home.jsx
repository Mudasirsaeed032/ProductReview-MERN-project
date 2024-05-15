import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import './Home.css'
import { Link, useNavigate } from 'react-router-dom'
// import jwt from 'jsonwebtoken'
import { useJwt } from "react-jwt";


function Home() {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get('http://localhost:3000/home')
            .then((res) => {
                console.log(res.data);
                if (res.data.user) {
                    setUser(res.data.user);
                }
                if (res.data.products) {
                    setProducts(res.data.products);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])
    const handleLogout = () => {
        axios.post('http://localhost:3000/home')
            .then((res) => {
                console.log(res.data);
                setUser(null); // Set user to null
            })
            .catch((err) => {
                console.log(err);
            })
    }


    return (
        <div className="container-fluid">
            <div className="row">
                <h1>Welcome, {user ? user.name : 'Guest'}</h1>
                <button onClick={handleLogout}>Logout</button>
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

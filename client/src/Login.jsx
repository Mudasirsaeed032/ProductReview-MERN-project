import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [name, setName] = useState('');
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;
    const submitForm = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/login',{ email, password, name },{
            headers: {
                'Content-Type': 'application/json',
        }}
        )
            .then((res) => {
                console.log(res);
                if (res.data === 'True') {
                    alert('Logged in successfully!');
                    navigate('/home');
                }
                else {
                    alert('Invalid credentials');
                }

            })
            .catch((err) => {
                console.log(err);
            })
    }
    return (
        <div>
            <div className='d-flex justify-content-center align-items-center bg-secondary vh-100 vw-100'>
                <div className='bg-white p-3 rounded w-50'>
                    <h1>Log In</h1>
                    <form onSubmit={submitForm}>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                            <input type="password" className="form-control" id="exampleInputPassword1"
                                onChange={(data) => {
                                    setPassword(data.target.value);
                                }}
                            />
                        </div>
                        <button type="submit" className="btn btn-success rounded-3">Log In</button>
                    </form>
                    <p>Don't have an account?</p>
                    <Link to="/signup" className="btn btn-primary rounded-3">Register</Link>
                </div>
            </div>
        </div>
    )
}

export default Login

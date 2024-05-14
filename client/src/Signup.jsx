import React,{useState, useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { Link,useNavigate } from 'react-router-dom'
import axios from 'axios'


function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const submitForm = (e) =>{
        e.preventDefault();
        axios.post('http://localhost:3000/signup',{name, email, password})
        .then((res)=>{
            console.log(res.data);
            alert('User has been registered successfully!');
            navigate('/login')
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    return (
        <div>
            <div className='d-flex justify-content-center align-items-center bg-secondary vh-100 vw-100'>
                <div className='bg-white p-3 rounded w-50'>
                    <h1>Register</h1>
                    <form onSubmit={submitForm}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input type="text" className="form-control" id="username"
                            onChange={(data)=>{
                                setName(data.target.value);
                            }} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                            onChange={(data)=>{
                                setEmail(data.target.value);
                            }} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                            <input type="password" className="form-control" id="exampleInputPassword1" 
                                onChange={(data)=>{
                                    setPassword(data.target.value);
                                }}
                            />
                        </div>
                        <button type="submit" className="btn btn-success rounded-3">Register</button>
                    </form>
                    <p>Already have an account?</p>
                    <Link to="/login" className="btn btn-primary rounded-3">Login</Link>
                </div>
            </div>
        </div>
    )
}

export default Signup

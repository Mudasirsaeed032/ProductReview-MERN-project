import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import ReactStars from "react-rating-stars-component";

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3000/profile/${id}`, { withCredentials: true })
      .then((res) => {
        if (res.data.message === 'Success') {
          console.log(res.data);
          if (res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
          if (res.data.reviews) {
            setReviews(res.data.reviews);
          }
        } else {
          console.log(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  function deleteReview(reviewId) {
    axios.delete(`http://localhost:3000/review/${reviewId}`, { withCredentials: true })
      .then((res) => {
        console.log(res.data.message);
        // Remove the deleted review from the state
        setReviews(reviews.filter(review => review._id !== reviewId));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div>
      <h1>Welcome to your profile {user ? user.name : 'a Guest'}</h1>
      <h2 id='rev'>Here are all of your Reviews:</h2>
      {reviews.map((review) => (
        <div className="card" key={review._id}>
          <div className="card-body">
            <ReactStars
              count={5}
              value={review.starRatings}
              size={44}
              edit={false}
              activeColor="#ffd700"
            />
            <h5 className="card-title">{review.title}</h5>
            <p className="card-text">{review.description}</p>
            <Link to={`/edit/${review._id}`} className="btn btn-primary">Edit Review</Link>
            <button onClick={() => deleteReview(review._id)} className="btn btn-danger">Delete Review</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Profile
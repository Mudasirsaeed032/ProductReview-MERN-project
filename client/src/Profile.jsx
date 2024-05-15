import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [reviews, setReviews] = useState([]);
  const [editReviewId, setEditReviewId] = useState(null);
  const [updatedReview, setUpdatedReview] = useState({ title: '', description: '', starRatings: '' });

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

  const handleInputChange = (event) => {
    setUpdatedReview({ ...updatedReview, [event.target.name]: event.target.value });
  };

  const updateReview = (event, reviewId) => {
    event.preventDefault();
    axios.put(`http://localhost:3000/review/${reviewId}`, updatedReview, { withCredentials: true })
      .then((res) => {
        console.log(res.data.message);
        setReviews(reviews.map(review => review._id === reviewId ? updatedReview : review));
        setEditReviewId(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <h1>This is the Profile of {user ? user.name : 'a Guest'}</h1>
      {reviews.map((review) => (
        <div key={review._id}>
          {editReviewId === review._id ? (
            <form onSubmit={(event) => updateReview(event, review._id)}>
              <input type="text" name="title" value={updatedReview.title} onChange={handleInputChange} />
              <input type="text" name="description" value={updatedReview.description} onChange={handleInputChange} />
              <input type="number" name="starRatings" value={updatedReview.starRatings} onChange={handleInputChange} />
              <button type="submit">Submit Changes</button>
            </form>
          ) : (
            <>
              <h3>{review.title}</h3>
              <p>{review.description}</p>
              <p>Rating: {review.starRatings}</p>
              <button onClick={() => { setEditReviewId(review._id); setUpdatedReview(review); }}>Edit Review</button>
            </>
          )}
          <button onClick={() => deleteReview(review._id)}>Delete Review</button>
        </div>
      ))}
    </div>
  )
}

export default Profile
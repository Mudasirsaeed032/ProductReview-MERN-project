import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component';

function EditPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:3000/review/${id}`, { withCredentials: true })
      .then((res) => {
        setTitle(res.data.title);
        setDescription(res.data.description);
        setRating(res.data.starRatings);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.put(`http://localhost:3000/review/${id}`,
      {
        title,
        description,
        starRatings: rating,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          alert('Review has been updated successfully!');
        } else {
          alert('There was an error updating your review. Please try again.');
        }
      })
      .catch((err) => {
        console.log(err);
        alert('There was an error updating your review. Please try again.');
      });
  };
  return (
    <div>
      <div className='d-flex justify-content-center align-items-center vh-100 vw-100'>
        <div className='bg-white p-3 rounded w-50'>
          <h1>Edit a Review</h1>
          <form onSubmit={handleSubmit}>
            <ReactStars
              count={5}
              value={rating}
              onChange={(newRating) => {
                setRating(newRating);
              }}
              size={64}
              activeColor="#ffd700"
            />
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input type="text" className="form-control" id="title" value={title}
                onChange={(data) => {
                  setTitle(data.target.value);
                }} />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea type="textbox" className="form-control" id="description" value={description} aria-describedby="emailHelp"
                onChange={(data) => {
                  setDescription(data.target.value);
                }} />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditPage;
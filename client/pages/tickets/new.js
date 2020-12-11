import React, { useState, useEffect } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const NewTicket = ({ currentUser }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date());
  const [src, setSrc] = useState(null);
  const [description, setDescription] = useState("");
  const owner = currentUser.username;
  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
      image: src,
      location,
      description,
      date,
      owner,
    },
    onSuccess: () => Router.push("/"),
  });

  const imageHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("image", file);
    await axios
      .post("/s3", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setImage(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (image) {
      setSrc(URL.createObjectURL(image));
    }
  }, [image]);

  const onSubmit = (event) => {
    event.preventDefault();
    doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };
  return (
    <div>
      <h1>Create a ticket</h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor=''>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='form-control'
          />
        </div>
        <div className='form-group'>
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            // minDate={moment().toDate()}
            placeholderText='Select a day'
          />
        </div>
        <div className='form-group'>
          <label htmlFor=''>Price</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className='form-control'
          />
        </div>

        <div>
          <img
            src={image ? src : null}
            alt={image ? image.name : null}
            height='300px'
            width='400px'
          />
          <input type='file' onChange={imageHandler} />
        </div>

        <div className='form-group'>
          <label htmlFor=''>Location</label>
          <input
            value={location}
            onBlur={onBlur}
            onChange={(e) => setLocation(e.target.value)}
            className='form-control'
          />
        </div>
        <div className='form-group'>
          <label htmlFor=''>Description</label>
          <input
            value={description}
            onBlur={onBlur}
            onChange={(e) => setDescription(e.target.value)}
            className='form-control'
          />
        </div>
        {errors}
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;

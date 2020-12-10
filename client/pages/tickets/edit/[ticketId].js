import useRequest from "../../../hooks/use-request";
import Router from "next/router";
import { useState, useEffect } from "react";

const TicketUpdate = ({ ticket, currentUser }) => {
  const [title, setTitle] = useState(ticket.title);
  const [price, setPrice] = useState(ticket.price);
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(ticket.location);
  const [date, setDate] = useState(ticket.date);
  const [src, setSrc] = useState("");
  const [description, setDescription] = useState(ticket.description);
  const owner = currentUser.username;

  const { doRequest, errors } = useRequest({
    url: `/api/tickets/${ticket.id}`,
    method: "put",
    body: {
      title,
      price,
      date,
      image: src,
      location,
      description,
      owner,
    },
    onSuccess: () => Router.push("/"),
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
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
      <h1>Edit a ticket</h1>
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
          <label htmlFor=''>Date</label>
          <input
            value={date}
            onBlur={onBlur}
            onChange={(e) => setDate(e.target.value)}
            className='form-control'
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

TicketUpdate.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  console.log("data", data);
  return { ticket: data };
};
export default TicketUpdate;

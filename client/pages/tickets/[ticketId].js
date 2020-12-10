import useRequest from "../../hooks/use-request";
import Router from "next/router";

const TicketShow = ({ ticket, currentUser }) => {
  console.log("EDIT", currentUser);
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });
  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Date: {ticket.date}</h4>
      <h4>Owner: {ticket.owner}</h4>
      <h4>Price: {ticket.price}</h4>
      <img src={ticket.image} alt={ticket.title} height='300px' width='400px' />
      <h4>Location: {ticket.location}</h4>
      <h4>Description: {ticket.description}</h4>
      {errors}
      <button onClick={() => doRequest()} className='btn btn-primary'>
        Purchase
      </button>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};
export default TicketShow;

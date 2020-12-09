const OrderIndex = ({ orders }) => {
  console.log("orders", orders);
  return (
    <>
      <ul>
        {orders.map((order) => {
          return (
            <li key={order.id}>
              {order.ticket.title} - {order.status}
            </li>
          );
        })}
      </ul>
      {orders.length == 0 && <h1>You don't have any orders</h1>}
    </>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");

  return { orders: data };
};

export default OrderIndex;

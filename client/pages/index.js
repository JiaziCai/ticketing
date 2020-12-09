import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.date}</td>
        <td>{ticket.price}</td>
        <td>
          <img
            src={ticket.image}
            alt={ticket.image.name}
            height='300px'
            width='400px'
          />
        </td>
        <td>{ticket.location}</td>
        <td>
          {currentUser !== null && ticket.userId === currentUser.id ? (
            <Link
              href='/tickets/edit/[ticketId]'
              as={`/tickets/edit/${ticket.id}`}
            >
              <a>Edit</a>
            </Link>
          ) : (
            <Link href='/tickets/[ticketId]' as={`/tickets/${ticket.id}`}>
              <a>View</a>
            </Link>
          )}
        </td>
      </tr>
    );
  });
  return (
    <div>
      <h1>Tickets</h1>
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Price</th>
            <th>Image</th>
            <th>Location</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets");
  return { tickets: data };
};

export default LandingPage;

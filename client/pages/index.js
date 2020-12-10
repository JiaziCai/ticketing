import Link from "next/link";
import RecipeReviewCard from "../components/card";

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <div key={ticket.id} className='col-lg-4 col-md-6 col-sm-12 mb-4'>
        <RecipeReviewCard
          key={ticket.id}
          title={ticket.title}
          date={ticket.date}
          price={ticket.price}
          image={ticket.image}
          location={ticket.location}
          description={ticket.description}
          owner={ticket.owner}
          link={
            currentUser !== null && ticket.userId === currentUser.id
              ? "/tickets/edit/[ticketId]"
              : "/tickets/[ticketId]"
          }
          as={
            currentUser !== null && ticket.userId === currentUser.id
              ? `/tickets/edit/${ticket.id}`
              : `/tickets/${ticket.id}`
          }
        />
      </div>
    );
  });
  return (
    <>
      <h1>Tickets</h1>
      <div className='row'>{ticketList}</div>
    </>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets");
  return { tickets: data };
};

export default LandingPage;

import { Publisher, Subjects, TicketCreatedEvent } from "@jcticket/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

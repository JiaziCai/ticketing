import { Subjects } from "./subjects";

export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    location: string;
    image: string;
    date: string;
    description: string;
    owner: string;
    userId: string;
  };
}

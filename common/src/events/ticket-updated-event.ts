import { Subjects } from "./subjects";

export interface TicketUpdatedEvent {
  subject: Subjects.TicketUpdated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    location: string;
    date: string;
    image: string;
    userId: string;
    orderId?: string;
  };
}

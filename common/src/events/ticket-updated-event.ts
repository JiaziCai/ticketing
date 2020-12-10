import { Subjects } from "./subjects";

export interface TicketUpdatedEvent {
  subject: Subjects.TicketUpdated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    location: string;
    description: string;
    owner: string;
    image: string;
    orderId?: string;
    userId: string;
  };
}

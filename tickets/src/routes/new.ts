import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@jcticket/common";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
    body("image").not().isEmpty().withMessage("Image is required"),
    body("location").not().isEmpty().withMessage("Location is required"),
    body("date").not().isEmpty().withMessage("Date is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price, image, location, date } = req.body;

    const ticket = await Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
      image,
      location,
      date,
    });
    await ticket.save();

    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      image: ticket.image,
      location: ticket.location,
      date: ticket.date,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };

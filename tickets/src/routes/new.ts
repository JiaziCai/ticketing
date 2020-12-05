import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@jcticket/common";
import { body } from "express-validator";
import { build } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publish";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .not()
      .isEmpty()
      .withMessage("Price is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: title.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
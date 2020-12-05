import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";

it("marks an order as cancelled", async () => {
  // create a ticket with ticket model
  const ticket = Ticket.build({
    title: "concernt",
    price: 20,
    id: mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();
  // make a request
  const user = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);
  // expectation to make sure

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits a order cancelled event", async () => {
  const ticket = Ticket.build({
    title: "concernt",
    price: 20,
    id: mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();
  // make a request
  const user = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);
  // expectation to make sure

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

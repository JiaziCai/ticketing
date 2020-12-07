import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose = require("mongoose");
import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[];
    }
  }
}

jest.mock("../nats-wrapper");

process.env.STRIPE_KEY = "sk_test_5OD0EXwcvB2N1yAI2Qr3J5zY002VIl5hYb";

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdf";
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connections;

  for (let collection of collections) {
    await collection.dropCollection;
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  //Build JWT payload
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };
  //Create JWT

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  //Build Session Object

  const session = { jwt: token };

  //Turn that to JSON

  const sessionJSON = JSON.stringify(session);

  //Encode to 64

  const base64 = Buffer.from(sessionJSON).toString("base64");

  //return string cookie with encoded data

  return [`express:sess=${base64}`];
};

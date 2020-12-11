import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@jcticket/common";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import { config } from "dotenv/types";
import multer from "multer";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

const upload = multer({ storage });

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
    body("description").not().isEmpty().withMessage("Description is required"),
    body("date").not().isEmpty().withMessage("Date is required"),
  ],
  validateRequest,
  upload.single("image"),
  async (req: Request, res: Response) => {
    const {
      title,
      price,
      image,
      location,
      date,
      description,
      owner,
    } = req.body;

    const imagePath = `/${req.file.path}`;

    console.log(imagePath);

    const ticket = await Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
      image,
      location,
      description,
      date,
      owner,
    });
    await ticket.save();

    console.log(ticket);

    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id!,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      image: ticket.image,
      location: ticket.location,
      description: ticket.description,
      date: ticket.date,
      owner: ticket.owner,
    });

    res.status(201).send(ticket);
  }
);

aws.config.update({
  accessKeyId: "AKIAIAEK3MS3O722VFNA",
  secretAccessKey: "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",
});

const s3 = new aws.S3();
const storageS3 = multerS3({
  s3,
  bucket: "jc-ticket-master",
  acl: "public-read",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key(req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadS3 = multer({ storage: storageS3 });
router.post("/s3", uploadS3.single("image"), (req, res) => {
  res.send(req.file.path);
});

export { router as createTicketRouter };

import env from "dotenv";
env.config();
import express, { Express } from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRoute from "./routes/user";
import authRoute from "./routes/auth";
import eventRoutes from "./routes/event";
import ticketRoute from "./routes/ticket_route"
import paymentRoutes from './routes/paymentRoutes';
import notificationRoutes from "./routes/notification";
import uploadRoutes from "./routes/file-upload"
import pinoHttp from 'pino-http'
import logger from './utils/logger'
import authMiddleware from "./common/auth_middleware";

const initApp = (): Promise<Express> => {
  const promise = new Promise<Express>((resolve) => {
    const db = mongoose.connection;
    db.once("open", () => logger.info("Connected to Database"));
    db.on("error", (error) => logger.error(error));
    const url = process.env.DB_URL;
    mongoose.connect(url!).then(() => {
      const app = express();
      app.use(cors());
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(pinoHttp({ logger }));
      app.use("/user", userRoute);
      app.use("/auth", authRoute);
      app.use("/event",  authMiddleware ,eventRoutes);
      app.use("/ticket", authMiddleware, ticketRoute);
      app.use("/notifications", authMiddleware, notificationRoutes);
      app.use("/upload", authMiddleware, uploadRoutes)
      app.use('/public', express.static('public'));
      app.use('/api/payments', paymentRoutes);
      resolve(app);
    });
  });
  return promise;
};

export default initApp;

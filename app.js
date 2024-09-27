import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./router/userRouter.js";
import historyRouter from "./router/historyRouter.js";

const app = express();
config({ path: "./config/config.env" });

app.use(
  cors({
    origin: ["http://localhost:5174", "http://localhost:5173"],
    methods: ["GET", "POST", "DELETE", "PUT"], // Change 'method' to 'methods'
    credentials: true,
  })
);


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/history", historyRouter);

dbConnection();

app.use(errorMiddleware);
export default app;

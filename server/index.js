import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.route.js";

dotenv.config();

const port = process.env.PORT || 8000;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND,
  }),
);

app.get("/", (req, res) => {
  res.send("E-commerece");
});

app.use('/api/user',userRoutes)

connectDB().then(() => {
  app.listen(port, () => {
    console.log("App is ruuning on port ", port);
  });
});

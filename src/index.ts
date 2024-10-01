import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path";
import shopRouter from "./routes/shop";

dotenv.config();

// Mongoose configuration
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI || "";
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const app: Express = express();
const port = process.env.PORT || 3000;

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.redirect("/shop");
});
app.use("/shop", shopRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

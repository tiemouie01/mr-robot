import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

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

app.get("/", (req: Request, res: Response) => {
  res.send("My Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

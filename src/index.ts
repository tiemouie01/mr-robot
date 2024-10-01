import dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import createHttpError, { HttpError } from "http-errors";
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

// Catch 404 errors and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createHttpError(404));
});

// Error handler
app.use((err: HttpError, req: Request, res: Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

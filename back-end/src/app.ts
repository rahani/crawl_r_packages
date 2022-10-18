import express, { Request, Response, NextFunction } from "express";
import compression from "compression";
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import MongoStore from "connect-mongo";
import { connect } from "mongoose";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";

/**
 * Create Express server
 */
const app = express();

/**
 * Connect to MongoDB
 */
const mongoUrl = MONGODB_URI;

connect(mongoUrl, {})
  .then(() => {
    /**
     * Ready to use.
     */
  })
  .catch((err) => {
    console.log(
      `MongoDB connection error. Please make sure MongoDB is running. ${err}`
    );
    process.exit();
  });

/**
 * Express configuration
 */
app.set("port", process.env.PORT || 3000);

/**
 * Express Middlewares
 */
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
      mongoUrl,
    }),
  })
);
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

/**
 * Primary app routes.
 */
app.get("/", (req, res) => {
  res.send("Hello World!");
});

/**
 * 404 error handlers
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({ error: "Not Found" });
});

/**
 * 500 error handlers
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log("Path: ", req.path);
  console.error("Error: ", err);
  return res.status(500).json({ error: "500 Internal Server Error" });
});

export default app;

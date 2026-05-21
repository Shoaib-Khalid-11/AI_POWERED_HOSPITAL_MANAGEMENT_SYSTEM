import dotenv from "dotenv";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dbConnection from "./database/dbConnection.ts";
import { errorMiddleware } from "./middlewares/errors.ts";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.ts";
import router from "./routers/index.ts";
// Load environment variables from .env file
dotenv.config();
// Initialize Express app
const app: Application = express();
const PORT = process.env.PORT || 5000;

app.all("/api/auth/*splat", toNodeHandler(auth));
// Middleware
app.use(
  cors({
    origin: process.env.FRONT_END || "http://localhost:5173/",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

// Configure Helmet to allow cross-origin resorse sharing
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);

// Parse cookies from requests and attach them to req.cookies
app.use(cookieParser());

//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log requests in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

app.use("/api/v1", router);

// Connect to database
dbConnection();

// Error Middleware
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

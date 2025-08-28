import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import dbConnection from "./dbConfig/index.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import router from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8800;

// ✅ Connect DB
dbConnection();

// ✅ Security
app.use(helmet());

// ✅ CORS (replace with your real frontend domain)
app.use(
  cors({
    origin: "https://social-media-14.onrender.com",
    credentials: true,
  })
);

// ✅ Middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ API Routes
app.use("/api", router);

// ✅ Serve frontend build (if frontend is inside backend repo)
app.use(express.static(path.join(__dirname, "views", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "build", "index.html"));
});

// ✅ Error middleware
app.use(errorMiddleware);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});


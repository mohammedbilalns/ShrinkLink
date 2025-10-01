import express from "express";
import { configDotenv } from "dotenv";
import connectDb from "./src/config/mongodb.config.js";
import shortUrlRouter from "./src/routes/shortUrl.route.js";
import redirectRouter from "./src/routes/redirectRoute.js"
import { errorHandler } from "./src/utils/errorHandler.js";
import morgan from "morgan";
import cors from "cors"
configDotenv();

const app = express();
const PORT = process.env.PORT;

app.use(morgan("tiny"))
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/url", shortUrlRouter);
app.use("/", redirectRouter )

app.use(errorHandler)
app.listen(PORT, () => {
  connectDb();
  console.log("Server is running on port: ", PORT);
});

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const morgan = require("morgan");

const ticketRoutes = require("./routes/ticket.routes");
const limiter = require("./middleware/rateLimit.middleware");
const errorHandler = require("./middleware/error.middleware");

dotenv.config();

const app = express();

app.use(helmet());

app.use(cors());

app.use(
  express.json({
    limit: "10kb",
  }),
);

app.use(morgan("dev"));

app.use(limiter);

app.use("/", ticketRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

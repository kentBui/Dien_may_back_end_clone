const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// mongo connect
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.b2loh.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    }
  )
  .then(() => {
    console.log("DB connect");
  });

// common middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/public", express.static(`${__dirname}/upload`));

// get request time
app.use((req, res, next) => {
  const requestTime = new Date().toISOString();
  req.requestTime = requestTime;
  next();
});

// routers
const usersRoute = require("./routers/users.route");
const categoryRoute = require("./routers/category.route");
const productRoute = require("./routers/product.route");

// handle routers
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);

// handle unhandle router
app.all("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Can't find ${req.originalUrl} on the server`,
  });
});

module.exports = app;

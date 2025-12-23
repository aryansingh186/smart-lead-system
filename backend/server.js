require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const leadRoutes = require("./routes/leadRoutes");
const syncJob = require("./jobs/syncJob");

const app = express();

/* Middleware */
app.use(cors());
app.use(express.json());

/* Database */
connectDB();

/* Routes */
app.use("/api", leadRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Smart Lead API is running " });
});

/* Server */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` App listening at: http://localhost:${PORT}`);
  syncJob.start();
  console.log("Background sync job started");
});

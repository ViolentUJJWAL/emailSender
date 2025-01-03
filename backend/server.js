const express = require("express");
const app = express();
const cors = require("cors");
const colors = require("colors");

require("dotenv").config();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

const sendRoutes = require("./routes/sendRoutes")

app.use("/api", sendRoutes);

app.listen(PORT, () => {
  console.log(`Server running on Port- ${PORT}`.bgBlue.black);
});

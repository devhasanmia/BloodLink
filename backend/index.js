require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;
const router = require("./src/routes/router");

app.use(router);


app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Server is up and running",
  });
});

connectDB(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database Connected Successfully");
    app.listen(PORT, () => {
      console.log(`I am listening on http://localhost:${PORT}`);
    });
  })
  .catch((e) => console.log(e));

// server.js

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cveRoutes = require("./Routes/cveRoutes");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());

app.use(bodyParser.json());
app.use(express.json());
mongoose
  .connect("mongodb://127.0.0.1:27017/cveDatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

app.use("/cves", cveRoutes);
app.get("/", (req, res) => {
  res.redirect("/cves/list");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

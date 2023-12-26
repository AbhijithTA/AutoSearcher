const express = require("express");
const cors = require("cors");

const Auto = require("./models/auto");
const bodyParser = require("body-parser");
const { imageUpload } = require("./multerfile/uploadcode");
const mongoose = require("mongoose");

var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));
app.use(bodyParser.json());

//mongoose connection
mongoose.connect("mongodb://127.0.0.1/autoDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Handle form submission
app.post("/submit", (req, res) => {
  imageUpload(req, res, async (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      try {
        const { autoName, autoPlace, autoType,autoNum } = req.body;
        const imagePath = req.files["image"][0].filename;
        const anotherImagePath = req.files["anotherImage"][0].filename;
        const newAuto = new Auto({
          autoName,
          autoPlace,
          autoType,
          autoNum,
          imagePath,
          anotherImagePath,
        });
        await newAuto.save();
        res.status(201).json({ message: "Auto added successfully" });
        console.log("auto data added");
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  });
});

// Endpoint to handle search requests
app.get("/search", async (req, res) => {
  const searchQuery = req.query.query;

  try {
    const searchResults = await Auto.find({
      autoPlace: { $regex: new RegExp(searchQuery, "i") },
    });

    if (searchResults.length > 0) {
      const resultsWithImages = searchResults.map((result) => ({
        autoName: result.autoName,
        autoPlace: result.autoPlace,
        autoType: result.autoType,
        autoNum: result.autoNum,
        imagePath: result.imagePath,
        anotherImagePath:result.anotherImagePath
      }));

      res.status(200).json(resultsWithImages);
    } else {
      res.status(404).json({ message: "No matching autos found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

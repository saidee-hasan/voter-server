const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURL = "mongodb+srv://voter:1NkQPfIN5AC5C0I8@cluster0.jhu99oz.mongodb.net/voter?retryWrites=true&w=majority";



mongoose.connect(mongoURL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Schema
const voterSchema = new mongoose.Schema({
  id: String,
  name: String,
  voter_no: String,
  father: String,
  mother: String,
  occupation: String,
  dob: String,
  address: String
}, { collection: "voter_no-man-7" });

const Voter = mongoose.model("Voter", voterSchema);

// LIVE SEARCH API
app.get("/voters/search", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: "Query param required" });

  try {
    // Substring match: name বা voter_no এর মধ্যে query যেকোনো জায়গায় থাকলেও খুঁজবে
    const result = await Voter.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { voter_no: { $regex: query, $options: "i" } }
      ]
    }).limit(50); // বেশি ডেটা হলে limit ব্যবহার করা ভালো
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single voter by id
app.get("/voters/:id", async (req, res) => {
  try {
    const voter = await Voter.findOne({ id: req.params.id });
    if (!voter) return res.status(404).json({ message: "Voter not found" });
    res.json(voter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

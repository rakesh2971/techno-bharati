const express = require("express");
const { registerParticipant } = require("../controllers/participantController");
const { uploadHandler } = require("../middlewares/upload");

const router = express.Router();

router.post("/register", uploadHandler, registerParticipant);

module.exports = router;

app.get("/api/participants", async (req, res) => {
  try {
    const participants = await getParticipantsFromDatabase(); // Your logic to fetch participants
    // Send a response with an empty array if no participants are found
    res.status(200).json(participants || []); // Ensure always returning a valid JSON (even empty array)
  } catch (error) {
    console.error("Error fetching participants:", error);
    res.status(500).json({ error: "Failed to fetch participants" });
  }
});

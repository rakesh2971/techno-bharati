const express = require("express");
const cors = require("cors");
const multer = require("multer");
const firebaseAdmin = require("firebase-admin");
const { db } = require("./config/firebase"); // Importing db from firebase.js
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Firebase Admin
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(
    require("./serviceAccountKey.json")
  ),
  databaseURL: process.env.FIREBASE_DB_URL, // Needed for Firestore or Realtime Database
});

// Middleware
app.use(
  cors({
    origin: "http://127.0.0.1:5500", // Updated to allow requests from the frontend
  })
);
app.use(express.json());

// Multer Storage for File Upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// API Route for Registration
app.post(
  "/api/participants",
  upload.single("payment_screenshot"),
  async (req, res) => {
    try {
      const { name, email, event } = req.body;
      const file = req.file;

      if (!name || !email || !event || !file) {
        return res.status(400).json({ error: "All fields are required!" });
      }

      // Save to Firestore
      const userRef = db.collection("participants").doc();
      await userRef.set({
        name,
        email,
        event,
        paymentScreenshot: `Uploaded file size: ${file.size} bytes`,
        createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      });

      res.json({
        success: true,
        message: "Registration successful! Check your email.",
      });
    } catch (error) {
      console.error("🔥 Error in Registration:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
});

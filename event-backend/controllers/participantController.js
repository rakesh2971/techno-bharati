const { db, storage } = require("../config/firebase");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  limit,
} = require("firebase/firestore");

exports.registerParticipant = async (req, res) => {
  try {
    const { name, email, event } = req.body;
    const file = req.file;

    // Validation: Ensure all fields are provided
    if (!name || !email || !event || !file) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid email format" });
    }

    // Check if email already exists in Firestore
    const participantsRef = collection(db, "participants");
    const emailQuery = query(
      participantsRef,
      where("email", "==", email.toLowerCase()),
      limit(1)
    );
    const querySnapshot = await getDocs(emailQuery);

    if (!querySnapshot.empty) {
      return res
        .status(409)
        .json({ success: false, error: "Email already registered" });
    }

    // Upload file to Firebase Storage
    const fileName = `payment_${Date.now()}_${file.originalname.replace(
      /\s+/g,
      "_"
    )}`;
    const storageRef = ref(storage, `payments/${fileName}`);

    await uploadBytes(storageRef, file.buffer, { contentType: file.mimetype });
    const screenshotUrl = await getDownloadURL(storageRef);

    // Save registration data to Firestore
    const docData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      event: event.trim(),
      payment_screenshot: screenshotUrl,
      is_verified: false,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(participantsRef, docData);

    return res.status(201).json({
      success: true,
      message: "Registration successful!",
      participantId: docRef.id,
    });
  } catch (error) {
    console.error("❌ Error registering participant:", error);

    // Handle Firebase Errors
    if (error.code === "permission-denied") {
      return res
        .status(403)
        .json({ success: false, error: "Permission denied" });
    } else if (error.code === "unavailable") {
      return res
        .status(503)
        .json({ success: false, error: "Firestore temporarily unavailable" });
    }

    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

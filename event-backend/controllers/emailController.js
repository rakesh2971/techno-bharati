const nodemailer = require("nodemailer");
require("dotenv").config();

// Validate environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error("⚠️ Email credentials are missing in .env");
}

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends a verification email.
 * @param {string} email - Recipient email.
 * @param {string} subject - Email subject.
 * @param {string} message - Email message body.
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
exports.sendVerificationEmail = async (email, subject, message) => {
  try {
    if (!email || !subject || !message) {
      throw new Error("❌ Missing email parameters.");
    }

    const mailOptions = {
      from: `"Techno Bharati" <${process.env.EMAIL_USER}>`, // Custom sender name
      to: email,
      subject: subject,
      text: message,
      html: `<p>${message}</p>`, // HTML version
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.response);
    return { success: true, message: "Email sent successfully!" };
  } catch (error) {
    console.error("❌ Email sending error:", error.message);

    if (error.code === "EAUTH") {
      console.error("⚠️ Authentication error: Check your email credentials.");
    } else if (error.code === "ENOTFOUND") {
      console.error("⚠️ SMTP server not found.");
    }

    return { success: false, error: error.message };
  }
};

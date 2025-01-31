// test-email.js
const { sendVerificationEmail } = require("./controllers/emailController");

sendVerificationEmail("test@example.com")
  .then(() => console.log("Email sent!"))
  .catch(console.error);

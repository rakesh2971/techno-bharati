document
  .getElementById("registrationForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const event = document.getElementById("event").value.trim();
    const file = document.getElementById("paymentScreenshot").files[0];

    if (!name || !email || !event || !file) {
      showMessage("⚠️ All fields are required!", "red");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("event", event);
    formData.append("payment_screenshot", file);

    try {
      showMessage("⏳ Registering... Please wait.", "blue");

      const response = await fetch("http://127.0.0.1:5000/api/participants", {
        method: "POST",
        body: formData,
      });

      let data;
      try {
        data = await response.json(); // Ensure JSON response before processing
      } catch (jsonError) {
        throw new Error("Invalid JSON response from the server.");
      }

      if (response.ok) {
        showMessage("✅ Registration successful! Check your email.", "green");
        document.getElementById("registrationForm").reset(); // Clear form after success
      } else {
        showMessage(
          data.error || "❌ Registration failed. Please try again.",
          "red"
        );
      }
    } catch (error) {
      showMessage("❌ Network error: " + error.message, "red");
    }
  });

function showMessage(text, color) {
  const msgDiv = document.getElementById("message");
  msgDiv.textContent = text;
  msgDiv.style.color = color;
}

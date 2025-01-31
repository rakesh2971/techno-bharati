<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <style>
        .container { max-width: 600px; margin: auto; text-align: center; }
        .participant { border: 1px solid #ccc; padding: 10px; margin: 10px 0; border-radius: 8px; position: relative; }
        img { border-radius: 5px; margin-top: 5px; width: 200px; }
        button { cursor: pointer; background: green; color: white; padding: 5px 10px; border: none; border-radius: 5px; }
        button:hover { background: darkgreen; }
        button:disabled { background: gray; cursor: not-allowed; }
        .loading { color: gray; font-style: italic; }
        .verified { background-color: #e0ffe0; border-color: green; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Admin Dashboard</h1>
        <div id="participantsList" class="loading">Loading participants...</div>
    </div>

    <script>
        const API_URL = "http://localhost:5000/api/participants"; // Updated to absolute URL

        async function loadParticipants() {
            try {
                document.getElementById("participantsList").innerHTML = `<p class="loading">Fetching participants...</p>`;
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error("Failed to fetch participants");

                const participants = await response.json();
                const participantsList = document.getElementById("participantsList");

                participantsList.innerHTML = participants.length
                    ? participants
                        .map((p) => `
                            <div class="participant" id="participant-${p.id}">
                                <h3>${p.name}</h3>
                                <p>Email: ${p.email}</p>
                                <img src="${p.payment_screenshot || 'placeholder.jpg'}" alt="Payment Screenshot" onerror="this.src='placeholder.jpg'">
                                <br>
                                <button id="btn-${p.id}" onclick="verifyParticipant('${p.id}')" >Verify</button>
                            </div>
                        `).join("")
                    : "<p>No unverified participants</p>";
            } catch (error) {
                console.error("❌ Error loading participants:", error);
                document.getElementById("participantsList").innerHTML = `<p style="color: red;">Error loading participants.</p>`;
            }
        }

        async function verifyParticipant(participantId) {
            const button = document.getElementById(`btn-${participantId}`);
            button.disabled = true;
            button.innerText = "Verifying...";

            try {
                const response = await fetch(`${API_URL}/verify/${participantId}`, {
                    method: "PUT",
                });

                if (!response.ok) throw new Error("Verification failed");

                document.getElementById(`participant-${participantId}`).classList.add("verified");
                button.innerText = "Verified";
                alert("✅ Participant verified successfully!");
            } catch (error) {
                console.error("❌ Verification failed:", error);
                alert("Verification failed. Try again.");
                button.disabled = false;
                button.innerText = "Verify";
            }
        }

        loadParticipants();
    </script>
</body>
</html>

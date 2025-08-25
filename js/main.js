// tells_frontend/js/main.js
const API_BASE = "https://tells-frontend.onrender.com"; // Adjust if deployed elsewhere

// ========== GAME PROGRESS ==========

function saveProgress(sceneId) {
  fetch(`${API_BASE}/progress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ scene: sceneId })
  });
}

async function loadProgress() {
  const res = await fetch(`${API_BASE}/progress`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  if (data.scene) {
    goToScene(data.scene); // 🎮 Replace with your game loader
  }
}

// Check if user has save (used on game load)
async function checkIfUserHasSave() {
  const res = await fetch(`${API_BASE}/progress`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  if (data.scene !== null) {
    console.log("User has a save on this device.");
    // Optionally show resume prompt
  }
}
function showWelcomeMessage() {
  const token = localStorage.getItem("jwt_token");
  if (!token) return;

  const payload = JSON.parse(atob(token.split('.')[1]));
  const username = payload.sub || payload.username;

  const welcomeDiv = document.getElementById("userWelcome");
  if (welcomeDiv && username) {
    welcomeDiv.innerHTML = `
      <div style="text-align: right; padding: 10px;">
        Welcome, <a href="profile.html?user=${encodeURIComponent(username)}"><strong>@${username}</strong></a>
      </div>
    `;
  }
}
document.addEventListener("DOMContentLoaded", showWelcomeMessage);
  
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("jwt_token");
  const welcomeEl = document.getElementById("welcomeMsg");
  const registerBtn = document.getElementById("registerBtn");

  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const username = payload.sub || payload.username || "User";
    
    // Show welcome message
    if (welcomeEl) {
      welcomeEl.innerHTML = `<a href="/profile.html" class="welcome-link">Welcome, @${username}</a>`;
    }

    // Hide login/register if user is logged in
    if (loginBtn) loginBtn.style.display = "none";
    if (registerBtn) registerBtn.style.display = "none";
  } else {
    // Hide welcome if no token
    if (welcomeEl) welcomeEl.innerHTML = "";
  }
});

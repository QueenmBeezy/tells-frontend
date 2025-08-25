const API_BASE = "http://localhost:5000/api"; // Or your deployed domain

async function checkIfUserHasSave() {
  const token = localStorage.getItem("jwt_token");
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE}/progress`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (data.scene !== null && typeof Engine !== "undefined") {
      console.log("Loading saved scene:", data.scene);
      Engine.play(data.scene);  // Jump to saved scene in SugarCube
    }
  } catch (error) {
    console.error("Failed to load progress:", error);
  }
}
Config.saves.onSave = async function () {
  const token = localStorage.getItem("jwt_token");
  if (!token) return;

  try {
    const scene = SugarCube.State.active.title;

    await fetch("http://localhost:5000/api/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ scene })
    });

    console.log("Progress synced to backend:", scene);
  } catch (err) {
    console.error("Failed to sync progress:", err);
  }
};

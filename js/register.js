const API_BASE = "https://tells-frontend.onrender.com"; 
const registerForm = document.getElementById("registerForm");
if (registerForm) {
registerForm.addEventListener("submit", async (e) => {
e.preventDefault();
const username = document.getElementById("username").value;
const password = document.getElementById("password").value;


const res = await fetch(`${API_BASE}/register`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ username, password })
});


const data = await res.json();
alert(data.message || data.error);


if (data.message) {
window.location.href = "login.html";
}
});
}


// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
loginForm.addEventListener("submit", async (e) => {
e.preventDefault();
const username = document.getElementById("loginUsername").value;
const password = document.getElementById("loginPassword").value;


const res = await fetch(`${API_BASE}/login`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ username, password })
});


const data = await res.json();
if (data.token) {
localStorage.setItem("jwt_token", data.token);
localStorage.setItem("user_id", data.user_id);
alert("Login successful!");
window.location.href = "index.html";
} else {
alert(data.error || "Login failed.");
}
});
}


// LOGOUT
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
logoutBtn.addEventListener("click", () => {
localStorage.removeItem("jwt_token");
localStorage.removeItem("user_id");
alert("Logged out!");
window.location.href = "index.html";
});
}


// WELCOME MESSAGE
window.addEventListener("DOMContentLoaded", async () => {
const token = localStorage.getItem("jwt_token");


const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const logoutBtn = document.getElementById("logoutBtn");
const welcomeUser = document.getElementById("welcome-user");


if (token) {
if (loginBtn) loginBtn.style.display = "none";
if (registerBtn) registerBtn.style.display = "none";
if (logoutBtn) logoutBtn.style.display = "inline-block";


try {
const res = await fetch(`${API_BASE}/profile`, {
headers: {
Authorization: `Bearer ${token}`
}
});
const data = await res.json();


if (welcomeUser && data.username) {
welcomeUser.innerHTML = `<a href="profile.html?id=${data.id}">@${data.username}</a>`;
}
} catch (err) {
console.error("Error loading profile:", err);
}
} else {
if (loginBtn) loginBtn.style.display = "inline-block";
if (registerBtn) registerBtn.style.display = "inline-block";
if (logoutBtn) logoutBtn.style.display = "none";
if (welcomeUser) welcomeUser.innerHTML = "";
}
});
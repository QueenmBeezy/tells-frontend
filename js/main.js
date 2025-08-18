// tells_frontend/js/main.js

const API_BASE = "http://localhost:5000/api"; // Adjust this if deployed elsewhere

// REGISTER
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
      alert("Login successful!");
      window.location.href = "posts.html";
    } else {
      alert(data.error);
    }
  });
}

// Check logged-in user
const currentUserId = localStorage.getItem("user_id"); // You must store this on login

// Add Edit/Delete buttons for user's posts
function renderPost(post) {
  const div = document.createElement("div");
  div.innerHTML = `
    <h3>${post.title}</h3>
    <p>${post.content}</p>
    <small>By User: ${post.user_id}</small>
    ${post.user_id == currentUserId ? `
      <br>
      <button onclick="editPost(${post.id}, '${post.title}', \`${post.content}\`)">Edit</button>
      <button onclick="deletePost(${post.id})">Delete</button>
    ` : ""}
    <hr>
  `;
  postsContainer.appendChild(div);
}

// Replacing get posts loop:
posts.forEach(post => renderPost(post));

// Delete post
async function deletePost(postId) {
  const confirmDelete = confirm("Are you sure you want to delete this post?");
  if (!confirmDelete) return;

  const res = await fetch(`${API_BASE}/posts/${postId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await res.json();
  alert(data.message || data.error);
  window.location.reload();
}

// Edit post
function editPost(postId, oldTitle, oldContent) {
  const newTitle = prompt("Update Title:", oldTitle);
  const newContent = prompt("Update Content:", oldContent);

  if (newTitle && newContent) {
    fetch(`${API_BASE}/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ title: newTitle, content: newContent })
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      window.location.reload();
    });
  }
}

const token = localStorage.getItem("jwt_token");

fetch("/api/posts", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`  // 🔐 sent automatically
  },
  body: JSON.stringify({ title, content })
});

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("jwt_token");
    alert("Logged out!");
    window.location.href = "index.html";
  });
}

// SAVE PROGRESS
function saveGameProgress(currentPassageId) {
  const token = localStorage.getItem("jwt_token");

  fetch("http://localhost:5000/api/save-progress", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ progress: currentPassageId })
  })
  .then(res => res.json())
  .then(data => console.log(data.message))
  .catch(err => console.error(err));
}

// LOAD PROGRESS
function loadGameProgress(callback) {
  const token = localStorage.getItem("jwt_token");

  fetch("http://localhost:5000/api/load-progress", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(data => {
    if (data.progress) {
      callback(data.progress);  // This would be the ID of the passage to jump to
    }
  })
  .catch(err => console.error(err));
}

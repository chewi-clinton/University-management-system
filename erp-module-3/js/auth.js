async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("data/users.json");
  const users = await res.json();

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    document.getElementById("error").innerText = "Invalid credentials";
    return;
  }

  localStorage.setItem("user", JSON.stringify(user));
  window.location.href = "dashboard.html";
}

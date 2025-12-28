const user = JSON.parse(localStorage.getItem("user"));
const content = document.getElementById("content");

if (!user) location.href = "index.html";

if (user.role === "Student") {
  content.innerHTML = `
    <div class="card">
      <h3>Student Dashboard</h3>
      <p>Profile</p>
      <p>Fees</p>
      <p>Attendance</p>
      <p>Results</p>
      <p>Materials</p>
      <p>Live Classes</p>
      <p>Bus Details</p>
      <p>Digital ID Card</p>
    </div>
  `;
} else {
  content.innerHTML = `
    <div class="card">
      <h3>Staff Dashboard</h3>
      <a href="hr/hr.html">HR Management</a>
    </div>
  `;
}

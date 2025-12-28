/**
 * HR MODULE LOGIC
 * FR-28: Staff profiles, leave, performance, attendance
 */

let staffData = [];

/* Load staff data from JSON */
async function loadStaff() {
  try {
    const response = await fetch("staff.json");
    staffData = await response.json();
    renderStaffTable();
  } catch (error) {
    console.error("Failed to load staff data:", error);
  }
}

/* Render staff records into table */
function renderStaffTable() {
  const tableBody = document.getElementById("staffTable");
  tableBody.innerHTML = "";

  staffData.forEach(staff => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${staff.name}</td>
      <td>${staff.role}</td>
      <td>${staff.attendance}</td>
      <td>${staff.leave}</td>
      <td>${staff.performance}</td>
    `;

    tableBody.appendChild(row);
  });
}

/* Add new staff (frontend simulation) */
function addStaff() {
  const nameInput = document.getElementById("name");
  const roleInput = document.getElementById("role");

  const name = nameInput.value.trim();
  const role = roleInput.value.trim();

  if (!name || !role) {
    alert("Please enter staff name and role.");
    return;
  }

  const newStaff = {
    id: staffData.length + 1,
    name: name,
    role: role,
    attendance: "0%",
    leave: "Pending",
    performance: "Not Rated"
  };

  staffData.push(newStaff);
  renderStaffTable();

  nameInput.value = "";
  roleInput.value = "";
}

/* Initialize HR module */
loadStaff();

const API_URL = "http://localhost:3000/task";

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const priorityFilter = document.getElementById("priorityFilter");
const darkModeBtn = document.getElementById("darkModeBtn");
const totalTask = document.getElementById("totalTask");
const remainingTask = document.getElementById("remainingTask");
const doneTask = document.getElementById("doneTask");
let allTask = [];

async function getTask() {
  const response = await fetch(API_URL);
  allTask = await response.json();
  renderTask();
}

function renderTask() {
  const searchValue = searchInput.value.toLowerCase();
  const statusValue = statusFilter.value;
  const priorityValue = priorityFilter.value;

  const total = allTask.length;
  const remaining = allTask.filter((task) => task.status === "pending").length;
  const done = allTask.filter((task) => task.status === "done").length;

  totalTask.textContent = total;
  remainingTask.textContent = remaining;
  doneTask.textContent = done;

  const filteredTasks = allTask.filter((task) => {
    const matchSearch = task.title.toLowerCase().includes(searchValue);
    const matchStatus = statusValue === "all" || task.status === statusValue;
    const matchPriority = priorityValue === "all" || task.priority === priorityValue;

    return matchSearch && matchStatus && matchPriority;
  });

  taskList.innerHTML = "";

filteredTasks.forEach((task) => {
  taskList.innerHTML += `
    <div class="task-card">
      <h3>${task.title}</h3>
      <p>${task.description || "Tidak ada deskripsi"}</p>
      <p>Estimasi waktu: ${task.duration || 0} jam</p>
      <span class="badge ${task.priority.toLowerCase()}">${task.priority}</span>
      <span class="badge">${task.status}</span>

      <div class="actions">
        <button onclick="toggleDone('${task._id}', '${task.status}')">
          ${task.status === "done" ? "Pending" : "Done"}
        </button>

        <button onclick="deleteTask('${task._id}')">
          Delete
        </button>
      </div>
    </div>
  `;
});
}

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const priority = document.getElementById("priority").value;
  const duration = document.getElementsById("duration").value;

  const response= await fetch("http://localhost:3000/task",{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
      priority,
      duration: Number(duration),
      status: "pending",
    }),
  });

  const result = await response.json();
  console.log(result)
  
  taskForm.reset();
  getTask();
});

async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  getTask();
}

async function toggleDone(id, currentStatus) {
  const newStatus = currentStatus === "done" ? "pending" : "done";

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: newStatus,
    }),
  });

  getTasks();
}

async function editTask(id, oldTitle, oldDescription, oldPriority) {
  const title = prompt("Edit title:", oldTitle);
  const description = prompt("Edit description:", oldDescription);
  const priority = prompt("Edit priority: Low / Medium / High", oldPriority);

  if (!title) return;

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
      priority,
    }),
  });

  getTasks();
}

searchInput.addEventListener("input", renderTask);
statusFilter.addEventListener("change", renderTask);
priorityFilter.addEventListener("change", renderTask);

darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

getTask();
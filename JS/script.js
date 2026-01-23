let todos = JSON.parse(localStorage.getItem("todos")) || [];
let filter = "all";

const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const addBtn = document.getElementById("addBtn");
const error = document.getElementById("error");
const todoList = document.getElementById("todoList");
const empty = document.getElementById("empty");
const clearAll = document.getElementById("clearAll");

function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function showError(msg) {
  error.textContent = msg;
  error.classList.remove("hidden");
}

function clearError() {
  error.textContent = "";
  error.classList.add("hidden");
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function addTodo() {
  const task = taskInput.value.trim();
  const date = dateInput.value;

  if (!task) return showError("Please enter a task!");
  if (task.length < 3) return showError("Task must be at least 3 characters!");
  if (!date) return showError("Please select a date!");

  todos.push({ id: Date.now(), task, date, done: false });
  save();

  taskInput.value = "";
  dateInput.value = "";
  clearError();
  render();
}

function render() {
  let filtered = todos;
  if (filter === "done") filtered = todos.filter((t) => t.done);
  if (filter === "pending") filtered = todos.filter((t) => !t.done);

  todoList.innerHTML = "";

  if (filtered.length === 0) {
    todoList.appendChild(empty);
    return;
  }

  filtered.forEach((todo) => {
    const row = document.createElement("div");
    row.className = "todo-item grid grid-cols-12 gap-4 items-center";

    row.innerHTML = `
      <div class="col-span-5 flex items-center gap-3">
        <input type="checkbox" ${todo.done ? "checked" : ""} data-action="toggle" data-id="${todo.id}">
        <span class="task-text ${todo.done ? "task-done" : ""}">${todo.task}</span>
      </div>
      <div class="col-span-3 text-gray-600">${formatDate(todo.date)}</div>
      <div class="col-span-2">
        <span class="badge ${todo.done ? "badge-done" : "badge-pending"}">
          ${todo.done ? "✓ Done" : "⏳ Pending"}
        </span>
      </div>
      <div class="col-span-2 text-center">
        <button class="delete-btn" data-action="delete" data-id="${todo.id}">Delete</button>
      </div>
    `;

    todoList.appendChild(row);
  });
}

// Events
addBtn.addEventListener("click", addTodo);

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTodo();
});

clearAll.addEventListener("click", () => {
  if (todos.length === 0) return;
  if (!confirm("Delete all tasks?")) return;
  todos = [];
  save();
  render();
});

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    filter = btn.dataset.filter;
    render();
  });
});

todoList.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;

  const id = Number(el.dataset.id);
  const action = el.dataset.action;

  if (action === "delete") {
    todos = todos.filter((t) => t.id !== id);
    save();
    render();
  }

  if (action === "toggle") {
    const t = todos.find((x) => x.id === id);
    if (!t) return;
    t.done = !t.done;
    save();
    render();
  }
});

render();

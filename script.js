document.addEventListener("DOMContentLoaded", () => {

  const taskForm = document.getElementById("task-form");
  const openBtn = document.getElementById("open-task-form-btn");
  const cancelBtn = document.getElementById("cancel-btn");
  const overlay = document.getElementById("form-overlay");
  const tasksContainer = document.getElementById("tasks-container");
  const taskCounter = document.getElementById("task-counter");

  const titleInput = document.getElementById("title-input");
  const dateInput = document.getElementById("date-input");
  const descriptionInput = document.getElementById("description-input");

  const filterAllBtn = document.getElementById("filter-all-btn");
  const filterCompletedBtn = document.getElementById("filter-completed-btn");
  const filterPendingBtn = document.getElementById("filter-pending-btn");

  const formTitle = document.getElementById("form-title");
  const submitBtn = document.getElementById("submit-btn");

  let tasks = JSON.parse(localStorage.getItem("data")) || [];
  let currentFilter = "all";
  let editingTaskId = null; // 🔥 clave para editar correctamente

  const save = () => {
    localStorage.setItem("data", JSON.stringify(tasks));
  };

  const updateCounter = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    if (!total) {
      taskCounter.innerText = "";
      return;
    }

    taskCounter.innerText =
      `${total} total • ${completed} completed • ${pending} pending`;
  };

  const render = () => {

    tasksContainer.innerHTML = "";

    let filtered = tasks;

    if (currentFilter === "completed") {
      filtered = tasks.filter(t => t.completed);
    }

    if (currentFilter === "pending") {
      filtered = tasks.filter(t => !t.completed);
    }

    if (!filtered.length) {
      tasksContainer.innerHTML = `
        <div class="empty-state">
          <h3>No tasks found</h3>
        </div>
      `;
      updateCounter();
      return;
    }

    filtered.forEach(task => {
      const div = document.createElement("div");
      div.className = `task ${task.completed ? "completed" : ""}`;
      div.dataset.id = task.id;

      div.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""}>
        <p><strong>${task.title}</strong></p>
        <p>${task.date || ""}</p>
        <p>${task.description || ""}</p>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      `;

      tasksContainer.appendChild(div);
    });

    updateCounter();
  };

  /* ================= ADD / UPDATE ================= */

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!titleInput.value.trim()) return;

    if (editingTaskId) {
      // 🔥 UPDATE
      const task = tasks.find(t => t.id === editingTaskId);
      task.title = titleInput.value;
      task.date = dateInput.value;
      task.description = descriptionInput.value;
    } else {
      // 🔥 ADD
      const newTask = {
        id: Date.now().toString(),
        title: titleInput.value,
        date: dateInput.value,
        description: descriptionInput.value,
        completed: false
      };
      tasks.unshift(newTask);
    }

    save();
    render();
    resetForm();
  });

  /* ================= DELETE / EDIT ================= */

  tasksContainer.addEventListener("click", (e) => {

    const taskEl = e.target.closest(".task");
    if (!taskEl) return;

    const id = taskEl.dataset.id;

    if (e.target.classList.contains("delete-btn")) {
      tasks = tasks.filter(t => t.id !== id);
      save();
      render();
    }

    if (e.target.classList.contains("edit-btn")) {
      const task = tasks.find(t => t.id === id);

      titleInput.value = task.title;
      dateInput.value = task.date;
      descriptionInput.value = task.description;

      editingTaskId = id; // 🔥 guardamos ID

      formTitle.innerText = "Update Task";
      submitBtn.innerText = "Update";

      overlay.classList.remove("hidden");
    }
  });

  /* ================= CHECKBOX ================= */

  tasksContainer.addEventListener("change", (e) => {

    if (!e.target.classList.contains("task-checkbox")) return;

    const id = e.target.closest(".task").dataset.id;
    const task = tasks.find(t => t.id === id);

    task.completed = e.target.checked;

    e.target.closest(".task")
      .classList.toggle("completed", task.completed);

    save();
    updateCounter();
  });

  /* ================= FILTERS ================= */

  filterAllBtn.addEventListener("click", () => {
    currentFilter = "all";
    setActiveFilter(filterAllBtn);
    render();
  });

  filterCompletedBtn.addEventListener("click", () => {
    currentFilter = "completed";
    setActiveFilter(filterCompletedBtn);
    render();
  });

  filterPendingBtn.addEventListener("click", () => {
    currentFilter = "pending";
    setActiveFilter(filterPendingBtn);
    render();
  });

  const setActiveFilter = (btn) => {
    document.querySelectorAll(".controls button")
      .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  };

  /* ================= MODAL ================= */

  openBtn.addEventListener("click", () => {
    overlay.classList.remove("hidden");
  });

  cancelBtn.addEventListener("click", () => {
    resetForm();
  });

  function resetForm() {
    taskForm.reset();
    editingTaskId = null;
    formTitle.innerText = "Add Task";
    submitBtn.innerText = "Add Task";
    overlay.classList.add("hidden");
  }

  render();
});
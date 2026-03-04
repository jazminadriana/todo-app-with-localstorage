document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     ELEMENTS
  ========================= */

  const taskForm = document.getElementById("task-form");
  const openBtn = document.getElementById("open-task-form-btn");
  const closeBtn = document.getElementById("close-task-form-btn");
  const overlay = document.getElementById("form-overlay");
  const tasksContainer = document.getElementById("tasks-container");
  const taskCounter = document.getElementById("task-counter");

  const titleInput = document.getElementById("title-input");
  const dateInput = document.getElementById("date-input");
  const descriptionInput = document.getElementById("description-input");

  const filterAllBtn = document.getElementById("filter-all-btn");
  const filterCompletedBtn = document.getElementById("filter-completed-btn");
  const filterPendingBtn = document.getElementById("filter-pending-btn");

  /* =========================
     STATE
  ========================= */

  let tasks = JSON.parse(localStorage.getItem("data")) || [];
  let currentFilter = "all";

  /* =========================
     STORAGE
  ========================= */

  const save = () => {
    localStorage.setItem("data", JSON.stringify(tasks));
  };

  /* =========================
     COUNTER
  ========================= */

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

  /* =========================
     RENDER
  ========================= */

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
        <input type="checkbox" ${task.completed ? "checked" : ""}/>
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

  /* =========================
     FILTER UI
  ========================= */

  const setActiveFilter = (btn) => {
    document.querySelectorAll(".controls button")
      .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  };

  /* =========================
     ADD TASK
  ========================= */

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!titleInput.value.trim()) return;

    const newTask = {
      id: Date.now().toString(), // ✅ string ID
      title: titleInput.value,
      date: dateInput.value,
      description: descriptionInput.value,
      completed: false
    };

    tasks.unshift(newTask);

    save();
    render();

    taskForm.reset();
    overlay.classList.add("hidden");
  });

  /* =========================
     CLICK EVENTS (DELETE / EDIT)
  ========================= */

 tasksContainer.addEventListener("change", (e) => {
  if (e.target.type === "checkbox") {

    const taskEl = e.target.closest(".task");
    if (!taskEl) return;

    const id = taskEl.dataset.id;
    const task = tasks.find(t => t.id === id);

    if (!task) return;

    task.completed = e.target.checked;

    // 🔥 Actualizamos solo la UI necesaria
    taskEl.classList.toggle("completed", task.completed);

    save();
  }
});

  /* =========================
     CHECKBOX TOGGLE
  ========================= */

  tasksContainer.addEventListener("change", (e) => {
    if (e.target.type === "checkbox") {

      const taskEl = e.target.closest(".task");
      if (!taskEl) return;

      const id = taskEl.dataset.id;
      const task = tasks.find(t => t.id === id);

      if (!task) return; // defensive check

      task.completed = e.target.checked;

      save();
      render();
    }
  });

  /* =========================
     FILTER BUTTONS
  ========================= */

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

  /* =========================
     MODAL
  ========================= */

  openBtn.addEventListener("click", () => {
    overlay.classList.remove("hidden");
  });

  closeBtn.addEventListener("click", () => {
    overlay.classList.add("hidden");
  });

  /* =========================
     INITIAL LOAD
  ========================= */

  render();
});
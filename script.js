document.addEventListener("DOMContentLoaded", () => {

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

  let tasks = JSON.parse(localStorage.getItem("data")) || [];
  let currentFilter = "all";

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

  const setActiveFilter = (btn) => {
    document.querySelectorAll(".controls button")
      .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  };

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newTask = {
      id: Date.now(),
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

  tasksContainer.addEventListener("click", (e) => {
    const taskEl = e.target.closest(".task");
    if (!taskEl) return;

    const id = Number(taskEl.dataset.id);
    const task = tasks.find(t => t.id === id);

    if (e.target.classList.contains("delete-btn")) {
      tasks = tasks.filter(t => t.id !== id);
    }

    if (e.target.classList.contains("edit-btn")) {
      titleInput.value = task.title;
      dateInput.value = task.date;
      descriptionInput.value = task.description;
      tasks = tasks.filter(t => t.id !== id);
      overlay.classList.remove("hidden");
    }

    save();
    render();
  });

  tasksContainer.addEventListener("change", (e) => {
    if (e.target.type === "checkbox") {
      const id = Number(e.target.closest(".task").dataset.id);
      const task = tasks.find(t => t.id === id);
      task.completed = e.target.checked;
      save();
      render();
    }
  });

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

  openBtn.addEventListener("click", () => {
    overlay.classList.remove("hidden");
  });

  closeBtn.addEventListener("click", () => {
    overlay.classList.add("hidden");
  });

  render();
});
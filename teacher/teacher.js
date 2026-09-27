const STORAGE_KEY = "lingocity_teacher_tasks";

const addTaskButton = document.getElementById("add-task-button");
const modal = document.getElementById("task-modal");
const closeModalButton = document.getElementById("close-modal");
const cancelButton = document.getElementById("cancel-button");
const taskForm = document.getElementById("task-form");
const tasksList = document.getElementById("tasks-list");
const tasksCount = document.getElementById("tasks-count");

let editingTaskId = null;


/* =========================
   LOAD TASKS
========================= */

function getTasks() {
    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (!savedTasks) {
        return [];
    }

    try {
        return JSON.parse(savedTasks);
    } catch {
        return [];
    }
}


/* =========================
   SAVE TASKS
========================= */

function saveTasks(tasks) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
    );
}


/* =========================
   OPEN MODAL
========================= */

function openModal() {
    modal.classList.add("active");
}


/* =========================
   CLOSE MODAL
========================= */

function closeModal() {
    modal.classList.remove("active");

    taskForm.reset();

    document.getElementById("task-xp").value = 100;

    editingTaskId = null;
}


/* =========================
   DISPLAY TASKS
========================= */

function renderTasks() {
    const tasks = getTasks();

    tasksCount.textContent = tasks.length;

    if (tasks.length === 0) {

        tasksList.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    📚
                </div>

                <h3>
                    Поки немає завдань
                </h3>

                <p>
                    Створіть перше завдання для своїх учнів.
                </p>

            </div>
        `;

        return;
    }


    tasksList.innerHTML = "";


    tasks.forEach(task => {

        const taskCard = document.createElement("div");

        taskCard.className = "task-card";


        const typeIcon =
            task.type === "test"
                ? "📝"
                : "📋";


        const deadline = task.deadline
            ? new Date(task.deadline + "T00:00:00")
                .toLocaleDateString("uk-UA")
            : "Без дедлайну";


        taskCard.innerHTML = `

            <div class="task-info">

                <div class="task-subject">
                    ${typeIcon} ${escapeHTML(task.subject)}
                </div>

                <div class="task-title">
                    ${escapeHTML(task.title)}
                </div>

                <div class="task-description">
                    ${escapeHTML(
                        task.description || "Без опису"
                    )}
                </div>

                <div class="task-meta">

                    <span>
                        👩‍🎓 ${escapeHTML(task.className)}
                    </span>

                    <span>
                        📅 ${deadline}
                    </span>

                    <span>
                        ⚡ ${task.xp} XP
                    </span>

                </div>

            </div>


            <div class="task-actions">

                <button
                    class="edit-button"
                    type="button"
                    data-edit="${task.id}"
                >
                    Редагувати
                </button>

                <button
                    class="delete-button"
                    type="button"
                    data-delete="${task.id}"
                >
                    Видалити
                </button>

            </div>

        `;


        tasksList.appendChild(taskCard);

    });


    addTaskListeners();
}


/* =========================
   CREATE TASK
========================= */

function createTask(event) {

    event.preventDefault();


    const title =
        document.getElementById("task-title").value.trim();


    const subject =
        document.getElementById("task-subject").value;


    const type =
        document.getElementById("task-type").value;


    const description =
        document.getElementById("task-description").value.trim();


    const classValue =
        document.getElementById("task-class").value;


    const xp =
        Number(
            document.getElementById("task-xp").value
        );


    const deadline =
        document.getElementById("task-deadline").value;


    const tasks = getTasks();


    const className =
        `${classValue} клас`;


    /* =========================
       EDIT EXISTING TASK
    ========================= */

    if (editingTaskId !== null) {

        const taskIndex =
            tasks.findIndex(
                task => task.id === editingTaskId
            );


        if (taskIndex !== -1) {

            tasks[taskIndex] = {

                ...tasks[taskIndex],

                title,
                subject,
                type,
                description,
                className,
                xp,
                deadline

            };

        }

    }

    /* =========================
       CREATE NEW TASK
    ========================= */

    else {

        const newTask = {

            id: Date.now(),

            title,

            subject,

            type,

            description,

            className,

            xp,

            deadline,

            createdAt:
                new Date().toISOString(),

            completedBy: []

        };


        tasks.unshift(newTask);

    }


    saveTasks(tasks);

    renderTasks();

    closeModal();

}


/* =========================
   EDIT TASK
========================= */

function editTask(id) {

    const tasks = getTasks();

    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) {
        return;
    }


    document.getElementById("task-title").value =
        task.title;


    document.getElementById("task-subject").value =
        task.subject;


    document.getElementById("task-type").value =
        task.type;


    document.getElementById("task-description").value =
        task.description;


    document.getElementById("task-class").value =
        task.className.replace(" клас", "");


    document.getElementById("task-xp").value =
        task.xp;


    document.getElementById("task-deadline").value =
        task.deadline;


    editingTaskId = id;

    openModal();

}


/* =========================
   DELETE TASK
========================= */

function deleteTask(id) {

    const tasks = getTasks();


    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) {
        return;
    }


    const confirmed =
        confirm(
            `Видалити завдання «${task.title}»?`
        );


    if (!confirmed) {
        return;
    }


    const updatedTasks =
        tasks.filter(
            task => task.id !== id
        );


    saveTasks(updatedTasks);

    renderTasks();

}


/* =========================
   BUTTON LISTENERS
========================= */

function addTaskListeners() {

    const editButtons =
        document.querySelectorAll(
            "[data-edit]"
        );


    editButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const id =
                    Number(
                        button.dataset.edit
                    );

                editTask(id);

            }
        );

    });


    const deleteButtons =
        document.querySelectorAll(
            "[data-delete]"
        );


    deleteButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const id =
                    Number(
                        button.dataset.delete
                    );

                deleteTask(id);

            }
        );

    });

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}


/* =========================
   EVENTS
========================= */

addTaskButton.addEventListener(
    "click",
    openModal
);


closeModalButton.addEventListener(
    "click",
    closeModal
);


cancelButton.addEventListener(
    "click",
    closeModal
);


taskForm.addEventListener(
    "submit",
    createTask
);


/* Закрытие по клику вне окна */

modal.addEventListener(
    "click",
    event => {

        if (event.target === modal) {
            closeModal();
        }

    }
);


/* Закрытие через Escape */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            modal.classList.contains("active")
        ) {

            closeModal();

        }

    }
);


/* =========================
   INITIAL LOAD
========================= */

renderTasks();
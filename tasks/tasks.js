const STORAGE_KEY = "lingocity_teacher_tasks";

const tasksList = document.getElementById("tasks-list");
const emptyState = document.getElementById("empty-state");

const filterButtons = document.querySelectorAll(".filter-button");

let currentFilter = "all";


/* =========================
   GET TASKS
========================= */

function getTasks() {

    const savedTasks =
        localStorage.getItem(STORAGE_KEY);

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
   GET STUDENT PROGRESS
========================= */

function updateStudentStats() {

    if (
        typeof getProgress !== "function"
    ) {
        return;
    }

    const progress = getProgress();

    document.getElementById(
        "player-level"
    ).textContent = progress.level;

    document.getElementById(
        "player-coins"
    ).textContent = progress.coins;

    document.getElementById(
        "player-xp"
    ).textContent = progress.xp;
}


/* =========================
   CHECK COMPLETED
========================= */

function isTaskCompleted(taskId) {

    const completed =
        JSON.parse(
            localStorage.getItem(
                "lingocity_completed_tasks"
            ) || "[]"
        );

    return completed.includes(taskId);
}


/* =========================
   SAVE COMPLETED TASK
========================= */

function markTaskCompleted(taskId) {

    const completed =
        JSON.parse(
            localStorage.getItem(
                "lingocity_completed_tasks"
            ) || "[]"
        );

    if (!completed.includes(taskId)) {

        completed.push(taskId);

        localStorage.setItem(
            "lingocity_completed_tasks",
            JSON.stringify(completed)
        );

    }
}


/* =========================
   START TASK
========================= */

function startTask(task) {

    if (isTaskCompleted(task.id)) {
        return;
    }


    /*
        Пока это демонстрационная версия.

        При нажатии ученик получает
        награду за выполнение задания.
    */

    if (
        typeof addXP === "function"
    ) {
        addXP(Number(task.xp) || 0);
    }


    markTaskCompleted(task.id);

    updateStudentStats();

    renderTasks();

    alert(
        `Завдання «${task.title}» виконано! 🎉\n\n+${task.xp} XP`
    );
}


/* =========================
   FORMAT DATE
========================= */

function formatDate(dateString) {

    if (!dateString) {
        return "Без дедлайну";
    }

    const date =
        new Date(
            dateString + "T00:00:00"
        );

    return date.toLocaleDateString(
        "uk-UA"
    );
}


/* =========================
   RENDER TASKS
========================= */

function renderTasks() {

    const allTasks = getTasks();


    const filteredTasks =
        currentFilter === "all"
            ? allTasks
            : allTasks.filter(
                task =>
                    task.type === currentFilter
            );


    tasksList.innerHTML = "";


    if (filteredTasks.length === 0) {

        emptyState.classList.add(
            "visible"
        );

        return;
    }


    emptyState.classList.remove(
        "visible"
    );


    filteredTasks.forEach(task => {

        const completed =
            isTaskCompleted(task.id);


        const card =
            document.createElement("article");


        card.className =
            "task-card" +
            (completed
                ? " completed"
                : "");


        const icon =
            task.type === "test"
                ? "📝"
                : "📋";


        const typeName =
            task.type === "test"
                ? "Тест"
                : "Завдання";


        card.innerHTML = `

            <div class="task-icon">
                ${icon}
            </div>


            <div class="task-info">

                <div class="task-subject">
                    ${escapeHTML(task.subject)}
                </div>


                <div class="task-title">

                    ${escapeHTML(task.title)}

                    ${
                        completed
                            ? `
                                <span class="completed-label">
                                    ✓ Виконано
                                </span>
                            `
                            : ""
                    }

                </div>


                <div class="task-description">

                    ${
                        escapeHTML(
                            task.description ||
                            "Без опису"
                        )
                    }

                </div>


                <div class="task-meta">

                    <span>
                        ${typeName}
                    </span>

                    <span>
                        👩‍🎓 ${escapeHTML(task.className)}
                    </span>

                    <span>
                        📅 ${formatDate(task.deadline)}
                    </span>

                    <span>
                        ⚡ ${task.xp} XP
                    </span>

                </div>

            </div>


            <button
                class="start-button"
                type="button"
                data-task-id="${task.id}"
                ${completed ? "disabled" : ""}
            >

                ${
                    completed
                        ? "✓ Виконано"
                        : "Почати"
                }

            </button>

        `;


        tasksList.appendChild(card);

    });


    addTaskButtons();
}


/* =========================
   BUTTONS
========================= */

function addTaskButtons() {

    const buttons =
        document.querySelectorAll(
            "[data-task-id]"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const taskId =
                    Number(
                        button.dataset.taskId
                    );


                const task =
                    getTasks().find(
                        item =>
                            item.id === taskId
                    );


                if (task) {
                    startTask(task);
                }

            }
        );

    });

}


/* =========================
   FILTERS
========================= */

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach(
                item =>
                    item.classList.remove(
                        "active"
                    )
            );


            button.classList.add(
                "active"
            );


            currentFilter =
                button.dataset.filter;


            renderTasks();

        }
    );

});


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================
   INITIALIZATION
========================= */

updateStudentStats();

renderTasks();
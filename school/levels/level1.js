/* =========================================
   LingoCity — LEVEL 1
========================================= */


/* =========================================
   ВОПРОСЫ
========================================= */

const questions = [

    {
        question: "Як англійською буде «Привіт»?",

        hint: "Базове привітання",

        answers: [
            "Hello",
            "Goodbye",
            "Thanks",
            "Sorry"
        ],

        correct: "Hello"
    },

    {
        question: "Що означає слово «Thank you»?",

        hint: "Подумай, коли хтось тобі допоміг",

        answers: [
            "Привіт",
            "Дякую",
            "До побачення",
            "Будь ласка"
        ],

        correct: "Дякую"
    },

    {
        question: "Як сказати «До побачення»?",

        hint: "Це слово ми говоримо, коли прощаємося",

        answers: [
            "Hello",
            "Please",
            "Goodbye",
            "Welcome"
        ],

        correct: "Goodbye"
    },

    {
        question: "Що означає слово «Please»?",

        hint: "Використовуємо, коли чемно щось просимо",

        answers: [
            "Будь ласка",
            "Дякую",
            "Вибач",
            "Привіт"
        ],

        correct: "Будь ласка"
    },

    {
        question: "Як англійською буде «Так»?",

        hint: "Протилежність слова «No»",

        answers: [
            "Maybe",
            "Yes",
            "Hello",
            "Thanks"
        ],

        correct: "Yes"
    }

];


/* =========================================
   ПРОГРЕСС
========================================= */

let progress = getProgress();


/* =========================================
   ТЕКУЩИЙ СОСТОЯНИЕ
========================================= */

let currentQuestion = 0;

let correctAnswers = 0;

let answered = false;


/* =========================================
   DOM
========================================= */

const questionNumberElement =
    document.getElementById(
        "question-number"
    );

const progressFill =
    document.getElementById(
        "progress-fill"
    );

const questionElement =
    document.getElementById(
        "question"
    );

const hintElement =
    document.getElementById(
        "hint"
    );

const answersElement =
    document.getElementById(
        "answers"
    );

const feedbackElement =
    document.getElementById(
        "feedback"
    );

const nextButton =
    document.getElementById(
        "next-button"
    );

const xpElement =
    document.getElementById(
        "xp"
    );

const coinsElement =
    document.getElementById(
        "coins"
    );

const heartsElement =
    document.getElementById(
        "hearts"
    );

const resultScreen =
    document.getElementById(
        "result-screen"
    );

const finalXpElement =
    document.getElementById(
        "final-xp"
    );

const finalCoinsElement =
    document.getElementById(
        "final-coins"
    );

const finalCorrectElement =
    document.getElementById(
        "final-correct"
    );


/* =========================================
   ОБНОВЛЕНИЕ СТАТИСТИКИ
========================================= */

function updateStats() {

    progress = getProgress();

    if (xpElement) {

        xpElement.textContent =
            progress.xp;

    }

    if (coinsElement) {

        coinsElement.textContent =
            progress.coins;

    }

    if (heartsElement) {

        heartsElement.textContent =
            progress.hearts;

    }

}


/* =========================================
   ПОКАЗАТЬ ВОПРОС
========================================= */

function showQuestion() {

    answered = false;

    const question =
        questions[currentQuestion];


    /* Номер вопроса */

    questionNumberElement.textContent =
        `Питання ${currentQuestion + 1} з ${questions.length}`;


    /* Прогресс */

    const percent =
        (
            (currentQuestion + 1) /
            questions.length
        ) * 100;

    progressFill.style.width =
        `${percent}%`;


    /* Вопрос */

    questionElement.textContent =
        question.question;


    /* Подсказка */

    hintElement.textContent =
        question.hint;


    /* Очистить ответы */

    answersElement.innerHTML = "";


    /* Скрыть feedback */

    feedbackElement.classList.remove(
        "show"
    );

    feedbackElement.textContent = "";


    /* Кнопка Next */

    nextButton.disabled = true;


    /* Создаём ответы */

    question.answers.forEach(
        answer => {

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "answer-button";

            button.textContent =
                answer;

            button.addEventListener(
                "click",
                () => {

                    checkAnswer(
                        button,
                        answer
                    );

                }
            );

            answersElement.appendChild(
                button
            );

        }
    );

}


/* =========================================
   ПРОВЕРКА ОТВЕТА
========================================= */

function checkAnswer(
    button,
    answer
) {

    if (answered) {
        return;
    }

    answered = true;


    const question =
        questions[currentQuestion];


    const buttons =
        document.querySelectorAll(
            ".answer-button"
        );


    /* =====================================
       ПРАВИЛЬНО
    ===================================== */

    if (
        answer === question.correct
    ) {

        button.classList.add(
            "correct"
        );


        /* Все остальные блокируем */

        buttons.forEach(
            btn => {

                btn.disabled = true;

            }
        );


        /* +20 XP */

        progress.xp += 20;


        /* +10 монет */

        progress.coins += 10;


        /* Статистика */

        progress.totalCorrect += 1;

        progress.totalQuestions += 1;


        /* Сохраняем */

        saveProgress(progress);


        /* Счётчик */

        correctAnswers++;


        /* Feedback */

        feedbackElement.textContent =
            "🎉 Правильно! +20 XP +10 🪙";

        feedbackElement.classList.add(
            "show"
        );


        nextButton.disabled = false;


        updateStats();

    }


    /* =====================================
       НЕПРАВИЛЬНО
    ===================================== */

    else {

        button.classList.add(
            "wrong"
        );


        /* Показываем правильный ответ */

        buttons.forEach(
            btn => {

                btn.disabled = true;


                if (
                    btn.textContent ===
                    question.correct
                ) {

                    btn.classList.add(
                        "correct"
                    );

                }

            }
        );


        /* Минус одно сердце */

        progress.hearts--;


        /* Чтобы сердца не ушли ниже 0 */

        if (progress.hearts < 0) {

            progress.hearts = 0;

        }


        /* Статистика */

        progress.totalQuestions += 1;


        /* Сохраняем */

        saveProgress(progress);


        /* Feedback */

        feedbackElement.textContent =
            `❌ Неправильно. Правильна відповідь: ${question.correct}`;

        feedbackElement.classList.add(
            "show"
        );


        nextButton.disabled = false;


        updateStats();


        /* =================================
           ЕСЛИ СЕРДЦА ЗАКОНЧИЛИСЬ
        ================================= */

        if (progress.hearts === 0) {

            feedbackElement.textContent =
                "💔 Серця закінчилися! Але ти можеш продовжити цей рівень.";

        }

    }

}


/* =========================================
   СЛЕДУЮЩИЙ ВОПРОС
========================================= */

nextButton.addEventListener(
    "click",
    () => {

        currentQuestion++;


        if (
            currentQuestion <
            questions.length
        ) {

            showQuestion();

        }

        else {

            finishLevel();

        }

    }
);


/* =========================================
   ЗАВЕРШЕНИЕ УРОВНЯ
========================================= */

function finishLevel() {

    const XP_REWARD = 100;

    const COIN_REWARD = 50;


    /* Обновляем прогресс */

    progress = getProgress();


    /* Проверяем, проходился ли уровень */

    const alreadyCompleted =
        progress.completedLevels.includes(
            1
        );


    /* =====================================
       ЕСЛИ УРОВЕНЬ ЕЩЁ НЕ ПРОЙДЕН
    ===================================== */

    if (!alreadyCompleted) {

        progress.completedLevels.push(
            1
        );


        /* Награда */

        progress.xp += XP_REWARD;

        progress.coins += COIN_REWARD;


        /* Открываем уровень 2 */

        if (
            progress.level <= 1
        ) {

            progress.level = 2;

        }

    }


    /* =====================================
       ВОССТАНОВЛЕНИЕ СЕРДЕЦ
    ===================================== */

    progress.hearts = 5;


    /* =====================================
       СОХРАНЯЕМ
    ===================================== */

    saveProgress(progress);


    /* =====================================
       ОБНОВЛЯЕМ ЭКРАН
    ===================================== */

    updateStats();


    if (finalXpElement) {

        finalXpElement.textContent =
            alreadyCompleted
                ? "0"
                : `+${XP_REWARD}`;

    }


    if (finalCoinsElement) {

        finalCoinsElement.textContent =
            alreadyCompleted
                ? "0"
                : `+${COIN_REWARD}`;

    }


    if (finalCorrectElement) {

        finalCorrectElement.textContent =
            `${correctAnswers}/${questions.length}`;

    }


    /* Показываем результат */

    resultScreen.classList.add(
        "show"
    );

}


/* =========================================
   ПЕРЕЗАПУСК
========================================= */

function restartGame() {

    currentQuestion = 0;

    correctAnswers = 0;

    progress = getProgress();

    showQuestion();

}


/* =========================================
   СТАРТ
========================================= */

updateStats();

showQuestion();
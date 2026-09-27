const questions = [

    {
        question: "Як англійською буде «один»?",
        hint: "Це перше число",
        answers: [
            "One",
            "Two",
            "Three",
            "Four"
        ],
        correct: "One"
    },

    {
        question: "Як англійською буде «два»?",
        hint: "Після One йде це число",
        answers: [
            "Three",
            "Two",
            "Five",
            "One"
        ],
        correct: "Two"
    },

    {
        question: "Що означає слово «Three»?",
        hint: "Це число між Two та Four",
        answers: [
            "Два",
            "Три",
            "Чотири",
            "П'ять"
        ],
        correct: "Три"
    },

    {
        question: "Як англійською буде «чотири»?",
        hint: "Після Three",
        answers: [
            "Five",
            "Four",
            "Two",
            "Six"
        ],
        correct: "Four"
    },

    {
        question: "Що означає слово «Five»?",
        hint: "Після Four",
        answers: [
            "Три",
            "Чотири",
            "П'ять",
            "Шість"
        ],
        correct: "П'ять"
    }

];


let currentQuestion = 0;
let correctAnswers = 0;
let answered = false;


/* =========================================
   ЭЛЕМЕНТЫ
========================================= */

const questionNumberElement =
    document.getElementById("question-number");

const progressPercentElement =
    document.getElementById("progress-percent");

const progressFillElement =
    document.getElementById("progress-fill");

const questionElement =
    document.getElementById("question");

const hintElement =
    document.getElementById("hint");

const answersElement =
    document.getElementById("answers");

const feedbackElement =
    document.getElementById("feedback");

const nextButton =
    document.getElementById("next-button");

const resultScreen =
    document.getElementById("result-screen");

const finalXpElement =
    document.getElementById("final-xp");

const finalCoinsElement =
    document.getElementById("final-coins");

const finalCorrectElement =
    document.getElementById("final-correct");


/* =========================================
   ПОКАЗАТЬ ВОПРОС
========================================= */

function showQuestion() {

    const question = questions[currentQuestion];

    answered = false;


    questionNumberElement.textContent =
        `Питання ${currentQuestion + 1} з ${questions.length}`;


    const percent =
        Math.round(
            ((currentQuestion + 1) / questions.length) * 100
        );


    progressPercentElement.textContent =
        `${percent}%`;


    progressFillElement.style.width =
        `${percent}%`;


    questionElement.textContent =
        question.question;


    hintElement.textContent =
        question.hint;


    feedbackElement.textContent =
        "";


    nextButton.disabled =
        true;


    answersElement.innerHTML =
        "";


    question.answers.forEach(answer => {

        const button =
            document.createElement("button");


        button.type =
            "button";


        button.className =
            "answer-button";


        button.dataset.answer =
            answer;


        button.textContent =
            answer;


        button.addEventListener(
            "click",
            () => checkAnswer(button, answer)
        );


        answersElement.appendChild(button);

    });

}


/* =========================================
   ПРОВЕРКА ОТВЕТА
========================================= */

function checkAnswer(button, answer) {

    if (answered) {
        return;
    }


    answered = true;


    const question =
        questions[currentQuestion];


    const buttons =
        answersElement.querySelectorAll(
            ".answer-button"
        );


    buttons.forEach(btn => {
        btn.disabled = true;
    });


    if (answer === question.correct) {

        button.classList.add("correct");

        feedbackElement.textContent =
            "✅ Правильно!";

        correctAnswers++;

    } else {

        button.classList.add("wrong");


        buttons.forEach(btn => {

            if (
                btn.dataset.answer ===
                question.correct
            ) {
                btn.classList.add("correct");
            }

        });


        feedbackElement.textContent =
            `❌ Правильна відповідь: ${question.correct}`;

    }


    nextButton.disabled =
        false;

}


/* =========================================
   КНОПКА ДАЛЬШЕ
========================================= */

nextButton.addEventListener(
    "click",
    () => {

        if (!answered) {
            return;
        }


        currentQuestion++;


        if (
            currentQuestion <
            questions.length
        ) {

            showQuestion();

        } else {

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

    let progress =
        getProgress();


    const alreadyCompleted =
        progress.completedLevels.includes(2);


    /*
       Засчитываем статистику только
       при первом прохождении уровня.
    */

    if (!alreadyCompleted) {

        progress.totalCorrect +=
            correctAnswers;

        progress.totalQuestions +=
            questions.length;


        progress =
            completeLevel(
                2,
                XP_REWARD,
                COIN_REWARD
            );

    }


    /*
       После завершения восстанавливаем
       5 жизней.
    */

    progress.hearts = 5;

    saveProgress(progress);


    finalXpElement.textContent =
        `+${XP_REWARD}`;


    finalCoinsElement.textContent =
        `+${COIN_REWARD}`;


    finalCorrectElement.textContent =
        `${correctAnswers}/${questions.length}`;


    resultScreen.classList.add("show");

}


/* =========================================
   ПОВТОРНОЕ ПРОХОЖДЕНИЕ
========================================= */

function restartGame() {

    currentQuestion = 0;

    correctAnswers = 0;

    resultScreen.classList.remove("show");

    showQuestion();

}


/* =========================================
   ЗАПУСК
========================================= */

showQuestion();
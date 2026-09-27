/* =====================================================
   LINGOCITY PROGRESS SYSTEM
===================================================== */

const TOTAL_LEVELS = 30;


/* =====================================================
   GET PROGRESS
===================================================== */

function getProgress() {

    const saved =
        localStorage.getItem(
            "lingocity_progress"
        );


    if (saved) {

        return JSON.parse(saved);

    }


    const progress = {

        level: 1,

        xp: 0,

        coins: 500,

        hearts: 5,

        completedLevels: [],

        achievements: [],

        totalCorrect: 0,

        totalQuestions: 0

    };


    saveProgress(progress);


    return progress;

}


/* =====================================================
   SAVE PROGRESS
===================================================== */

function saveProgress(progress) {

    localStorage.setItem(
        "lingocity_progress",
        JSON.stringify(progress)
    );

}


/* =====================================================
   ADD XP
===================================================== */

function addXP(amount) {

    const progress =
        getProgress();

    progress.xp += amount;

    saveProgress(progress);

    return progress;

}


/* =====================================================
   ADD COINS
===================================================== */

function addCoins(amount) {

    const progress =
        getProgress();

    progress.coins += amount;

    saveProgress(progress);

    return progress;

}


/* =====================================================
   COMPLETE LEVEL
===================================================== */

function completeLevel(
    levelNumber,
    xpReward = 100,
    coinReward = 50
) {

    const progress =
        getProgress();


    /*
       Не выдаём награду
       второй раз.
    */

    if (
        progress.completedLevels.includes(
            levelNumber
        )
    ) {

        return progress;

    }


    /*
       Записываем уровень
    */

    progress.completedLevels.push(
        levelNumber
    );


    /*
       Добавляем XP
    */

    progress.xp +=
        xpReward;


    /*
       Добавляем монеты
    */

    progress.coins +=
        coinReward;


    /*
       Открываем следующий уровень
    */

    if (
        levelNumber < TOTAL_LEVELS &&
        progress.level <= levelNumber
    ) {

        progress.level =
            levelNumber + 1;

    }


    saveProgress(progress);


    return progress;

}


/* =====================================================
   IS LEVEL UNLOCKED
===================================================== */

function isLevelUnlocked(
    levelNumber
) {

    const progress =
        getProgress();

    return (
        levelNumber <=
        progress.level
    );

}


/* =====================================================
   IS LEVEL COMPLETED
===================================================== */

function isLevelCompleted(
    levelNumber
) {

    const progress =
        getProgress();

    return progress.completedLevels.includes(
        levelNumber
    );

}


/* =====================================================
   PROGRESS PERCENT
===================================================== */

function getProgressPercent() {

    const progress =
        getProgress();


    return Math.round(

        (
            progress.completedLevels.length /
            TOTAL_LEVELS
        ) * 100

    );

}


/* =====================================================
   ACHIEVEMENT
===================================================== */

function unlockAchievement(
    achievement
) {

    const progress =
        getProgress();


    if (
        !progress.achievements.includes(
            achievement
        )
    ) {

        progress.achievements.push(
            achievement
        );


        saveProgress(
            progress
        );


        return true;

    }


    return false;

}
/* =========================================
   RATIO POTION - LEVEL 1
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const questionElement =
    document.getElementById("question");

const scoreElement =
    document.getElementById("score");

const finalScoreElement =
    document.getElementById("finalScore");

const currentValueElement =
    document.getElementById("currentValue");

const unitElement =
    document.getElementById("unit");

const liquidElement =
    document.getElementById("liquid");

const bottleElement =
    document.querySelector(".bottle");

const messageElement =
    document.getElementById("message");

const checkButton =
    document.getElementById("checkButton");

const resetButton =
    document.getElementById("resetButton");

const againButton =
    document.getElementById("againButton");

const continueButton =
    document.getElementById("continueButton");

const completeOverlay =
    document.getElementById("completeOverlay");

const homeButton =
    document.getElementById("homeButton");

const backButton =
    document.getElementById("backButton");

const addButtons =
    document.querySelectorAll(".add-button");


/* =========================================
   BOTTLE CAPACITY
   ขวดจุ 100 mL
========================================= */

const bottleCapacity = 100;


/* =========================================
   GAME VARIABLES
========================================= */

let score = 0;

let questionNumber = 0;

const totalQuestions = 5;

let currentValue = 0;

let correctAnswer = 0;

let currentQuestion = null;


/* =========================================
   START GAME
========================================= */

createGame();


/* =========================================
   CREATE GAME
========================================= */

function createGame() {

    score = 0;

    questionNumber = 0;

    currentValue = 0;

    scoreElement.textContent = score;

    completeOverlay.classList.add("hidden");

    nextQuestion();
}


/* =========================================
   NEXT QUESTION
========================================= */

function nextQuestion() {

    if (questionNumber >= totalQuestions) {

        levelComplete();

        return;
    }


    questionNumber++;

    currentValue = 0;

    clearMessage();

    enableAddButtons();


    /* สร้างโจทย์ใหม่ */

    currentQuestion =
        generateQuestion();


    correctAnswer =
        currentQuestion.answer;


    questionElement.textContent =
        currentQuestion.question;


    unitElement.textContent =
        currentQuestion.unit;


    updatePotion();
}


/* =========================================
   RANDOM QUESTION
=========================================

   Type 1:
   x% of number = ?

   Type 2:
   number is x% of what number?

   Type 3:
   number is what percent of number?
========================================= */

function generateQuestion() {

    const type =
        Math.floor(Math.random() * 3) + 1;


    /* =====================================
       TYPE 1
       หาร้อยละของจำนวน
    ===================================== */

    if (type === 1) {

        const percentages = [
            10,
            15,
            20,
            25,
            30,
            35,
            40,
            50,
            60,
            75
        ];

        const numbers = [
            40,
            50,
            60,
            80,
            100,
            120,
            150,
            200
        ];


        const percent =
            randomItem(percentages);

        const number =
            randomItem(numbers);


        const answer =
            (percent / 100) * number;


        return {

            question:
                `${percent}% of ${number} = ?`,

            answer:
                answer,

            unit:
                "mL"

        };
    }


    /* =====================================
       TYPE 2
       หาจำนวนทั้งหมด
    ===================================== */

    if (type === 2) {

        const percentages = [
            10,
            20,
            25,
            30,
            40,
            50,
            60,
            75
        ];

        const totals = [
            40,
            50,
            60,
            80,
            100
        ];


        const percent =
            randomItem(percentages);

        const total =
            randomItem(totals);


        const part =
            (percent / 100) * total;


        return {

            question:
                `${formatNumber(part)} is ${percent}% of what number?`,

            answer:
                total,

            unit:
                "mL"

        };
    }


    /* =====================================
       TYPE 3
       หาเป็นกี่เปอร์เซ็นต์
    ===================================== */

    const percentages = [
        10,
        20,
        25,
        30,
        40,
        50,
        60,
        75
    ];

    const totals = [
        40,
        50,
        60,
        80,
        100
    ];


    const percent =
        randomItem(percentages);

    const total =
        randomItem(totals);


    const part =
        (percent / 100) * total;


    return {

        question:
            `${formatNumber(part)} is what percent of ${total}?`,

        answer:
            percent,

        unit:
            "%"

    };
}


/* =========================================
   RANDOM ITEM
========================================= */

function randomItem(array) {

    return array[
        Math.floor(
            Math.random() * array.length
        )
    ];
}


/* =========================================
   FORMAT NUMBER
========================================= */

function formatNumber(number) {

    if (Number.isInteger(number)) {

        return number;
    }

    return Number(
        number.toFixed(2)
    );
}


/* =========================================
   ADD POTION
========================================= */

addButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const value =
                Number(
                    button.dataset.value
                );


            /*
                ป้องกันไม่ให้เกิน
                ความจุขวด 100 mL
            */

            if (
                currentValue + value
                <= bottleCapacity
            ) {

                currentValue += value;

                updatePotion();

            } else {

                showMessage(
                    "The bottle is full!",
                    "wrong"
                );

                shakeBottle();
            }

        }
    );

});


/* =========================================
   UPDATE POTION
========================================= */

function updatePotion() {

    /*
        แสดงค่าปริมาตรที่เติม
    */

    currentValueElement.textContent =
        formatNumber(currentValue);


    /*
        ระดับน้ำคำนวณจาก
        ปริมาตร / ความจุขวด

        0 mL   = 0%
        25 mL  = 25%
        50 mL  = 50%
        75 mL  = 75%
        100 mL = 100%
    */

    let fillPercent =
        (currentValue / bottleCapacity) * 100;


    /*
        จำกัดระดับน้ำ
        ให้อยู่ระหว่าง 0 - 100%
    */

    fillPercent =
        Math.max(
            0,
            Math.min(
                100,
                fillPercent
            )
        );


    /*
        เปลี่ยนความสูงของน้ำยา
    */

    liquidElement.style.height =
        `${fillPercent}%`;
}


/* =========================================
   CHECK ANSWER
========================================= */

checkButton.addEventListener(
    "click",
    checkAnswer
);


function checkAnswer() {

    if (currentValue === correctAnswer) {

        /* =========================
           CORRECT
        ========================= */

        score++;

        scoreElement.textContent =
            score;


        showMessage(
            "✨ CORRECT!",
            "correct"
        );


        disableAddButtons();


        setTimeout(
            () => {

                nextQuestion();

            },
            900
        );


    } else {

        /* =========================
           WRONG
        ========================= */

        const difference =
            correctAnswer - currentValue;


        if (currentValue < correctAnswer) {

            showMessage(
                `Not quite! You need ${formatNumber(difference)} more.`,
                "wrong"
            );

        } else {

            showMessage(
                `Too much! Remove ${formatNumber(Math.abs(difference))}.`,
                "wrong"
            );

        }


        shakeBottle();
    }

}


/* =========================================
   RESET CURRENT QUESTION
========================================= */

resetButton.addEventListener(
    "click",
    resetPotion
);


function resetPotion() {

    currentValue = 0;

    updatePotion();

    clearMessage();

    enableAddButtons();
}


/* =========================================
   SHAKE BOTTLE
========================================= */

function shakeBottle() {

    bottleElement.classList.remove(
        "wrong"
    );


    /*
        บังคับให้ browser
        เล่น animation ใหม่
    */

    void bottleElement.offsetWidth;


    bottleElement.classList.add(
        "wrong"
    );


    setTimeout(
        () => {

            bottleElement.classList.remove(
                "wrong"
            );

        },
        400
    );
}


/* =========================================
   MESSAGE
========================================= */

function showMessage(
    text,
    type
) {

    messageElement.textContent =
        text;

    messageElement.className =
        "message " + type;
}


function clearMessage() {

    messageElement.textContent =
        "";

    messageElement.className =
        "message";
}


/* =========================================
   ENABLE / DISABLE BUTTONS
========================================= */

function disableAddButtons() {

    addButtons.forEach(
        button => {

            button.disabled = true;

        }
    );

    checkButton.disabled = true;
}


function enableAddButtons() {

    addButtons.forEach(
        button => {

            button.disabled = false;

        }
    );

    checkButton.disabled = false;
}


/* =========================================
   LEVEL COMPLETE
========================================= */

function levelComplete() {

    finalScoreElement.textContent =
        score;


    completeOverlay.classList.remove(
        "hidden"
    );
}


/* =========================================
   PLAY AGAIN
========================================= */

againButton.addEventListener(
    "click",
    playAgain
);


function playAgain() {

    completeOverlay.classList.add(
        "hidden"
    );

    createGame();
}


/* =========================================
   NEXT LEVEL
========================================= */

continueButton.addEventListener(
    "click",
    goNextLevel
);


function goNextLevel() {

    window.location.href =
        "Ratio2.html";
}


/* =========================================
   HOME
========================================= */

homeButton.addEventListener(
    "click",
    goHome
);


function goHome() {

    window.location.href =
        "index.html";
}


/* =========================================
   BACK
========================================= */

backButton.addEventListener(
    "click",
    goBack
);


function goBack() {

    window.history.back();
}
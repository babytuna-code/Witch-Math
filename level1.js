
/* =========================================
   RATIO WITCH
   LEVEL 1
   MATCH THE RATIO
========================================= */


/* =========================================
   GAME DATA
========================================= */

const ratioPairs = [

    {
        id: 1,
        question: "2 : 3",
        answer: "4 : 6"
    },

    {
        id: 2,
        question: "3 : 5",
        answer: "6 : 10"
    },

    {
        id: 3,
        question: "1 : 2",
        answer: "3 : 6"
    },

    {
        id: 4,
        question: "2 : 5",
        answer: "6 : 15"
    },

    {
        id: 5,
        question: "4 : 7",
        answer: "8 : 14"
    }

];


/* =========================================
   VARIABLES
========================================= */

const leftColumn =
    document.getElementById("leftColumn");

const rightColumn =
    document.getElementById("rightColumn");

const board =
    document.getElementById("matchingBoard");

const svg =
    document.getElementById("connectionLayer");

const scoreElement =
    document.getElementById("score");

const messageElement =
    document.getElementById("message");

const resetButton =
    document.getElementById("resetButton");

const nextButton =
    document.getElementById("nextButton");

const completeOverlay =
    document.getElementById("completeOverlay");

const finalScore =
    document.getElementById("finalScore");

const continueButton =
    document.getElementById("continueButton");

const againButton =
    document.getElementById("againButton");

let score = 0;

let connections = [];

let currentDrag = null;

let isDragging = false;


/* =========================================
   SHUFFLE
========================================= */

function shuffle(array) {

    const newArray = [...array];

    for (
        let i = newArray.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            newArray[i],
            newArray[j]
        ] =
        [
            newArray[j],
            newArray[i]
        ];
    }

    return newArray;
}


/* =========================================
   CREATE GAME
========================================= */

function createGame() {

    leftColumn.innerHTML = "";

    rightColumn.innerHTML = "";

    svg.innerHTML = "";

    score = 0;

    connections = [];

    currentDrag = null;

    isDragging = false;

    updateScore();

    completeOverlay.classList.add("hidden");

    nextButton.classList.add("hidden");

    messageElement.textContent =
        "Drag each ratio to its matching answer!";


    /* ------------------------------
       LEFT
    ------------------------------ */

    const leftItems =
        shuffle(ratioPairs);


    leftItems.forEach(pair => {

        const card =
            createCard(
                pair,
                "left"
            );

        leftColumn.appendChild(card);

    });


    /* ------------------------------
       RIGHT
    ------------------------------ */

    const rightItems =
        shuffle(ratioPairs);


    rightItems.forEach(pair => {

        const card =
            createCard(
                pair,
                "right"
            );

        rightColumn.appendChild(card);

    });


    /* ------------------------------
       DRAW AFTER LAYOUT
    ------------------------------ */

    requestAnimationFrame(() => {

        drawAllConnections();

    });

}


/* =========================================
   CREATE CARD
========================================= */

function createCard(pair, side) {

    const card =
        document.createElement("div");

    card.classList.add("ratio-card");

    card.dataset.id = pair.id;

    card.dataset.side = side;

    card.dataset.value =
        side === "left"
            ? pair.question
            : pair.answer;


    card.textContent =
        side === "left"
            ? pair.question
            : pair.answer;


    /* Connector */

    const connector =
        document.createElement("div");

    connector.classList.add("connector");

    card.appendChild(connector);


    /* Pointer Events */

    card.addEventListener(
        "pointerdown",
        startDrag
    );


    card.addEventListener(
        "pointermove",
        dragMove
    );


    card.addEventListener(
        "pointerup",
        endDrag
    );


    card.addEventListener(
        "pointercancel",
        cancelDrag
    );


    return card;
}


/* =========================================
   START DRAG
========================================= */

function startDrag(event) {

    event.preventDefault();


    const card =
        event.currentTarget;


    /* ห้ามลากการ์ดที่เชื่อมแล้ว */

    if (
        card.classList.contains(
            "connected"
        )
    ) {

        return;
    }


    /*
       ต้องเริ่มลากจากฝั่งซ้าย
    */

    if (
        card.dataset.side !== "left"
    ) {

        return;
    }


    isDragging = true;


    currentDrag = {

        card: card,

        id: card.dataset.id,

        pointerId: event.pointerId

    };


    card.classList.add("selected");


    /*
       สร้างเส้นชั่วคราว
    */

    createTemporaryLine(card);


    try {

        card.setPointerCapture(
            event.pointerId
        );

    } catch (error) {

        // บาง browser อาจไม่รองรับ
    }


    updateTemporaryLine(event);


    messageElement.textContent =
        "Now drag to the matching ratio!";
}


/* =========================================
   DRAG MOVE
========================================= */

function dragMove(event) {

    if (!isDragging) {
        return;
    }


    if (!currentDrag) {
        return;
    }


    if (
        event.pointerId !==
        currentDrag.pointerId
    ) {

        return;
    }


    event.preventDefault();


    updateTemporaryLine(event);
}


/* =========================================
   END DRAG
========================================= */

function endDrag(event) {

    if (!isDragging) {
        return;
    }


    if (!currentDrag) {
        return;
    }


    if (
        event.pointerId !==
        currentDrag.pointerId
    ) {

        return;
    }


    event.preventDefault();


    const target =
        document
            .elementFromPoint(
                event.clientX,
                event.clientY
            );


    const targetCard =
        target
            ? target.closest(
                ".ratio-card"
            )
            : null;


    const sourceCard =
        currentDrag.card;


    /* ------------------------------
       ตรวจคำตอบ
    ------------------------------ */

    if (
        targetCard &&
        targetCard !== sourceCard &&
        targetCard.dataset.side === "right"
    ) {

        checkMatch(
            sourceCard,
            targetCard
        );

    } else {

        wrongConnection(
            sourceCard
        );

    }


    cleanupDrag();
}


/* =========================================
   CANCEL DRAG
========================================= */

function cancelDrag() {

    if (!isDragging) {
        return;
    }


    if (currentDrag) {

        wrongConnection(
            currentDrag.card
        );

    }


    cleanupDrag();
}


/* =========================================
   CHECK MATCH
========================================= */

function checkMatch(
    leftCard,
    rightCard
) {

    const leftId =
        leftCard.dataset.id;

    const rightId =
        rightCard.dataset.id;


    /* ------------------------------
       ถูก
    ------------------------------ */

    if (leftId === rightId) {

        leftCard.classList.remove(
            "selected"
        );

        leftCard.classList.add(
            "connected"
        );


        rightCard.classList.add(
            "connected"
        );


        /*
           บันทึก connection
        */

        connections.push({

            left: leftCard,

            right: rightCard,

            id: leftId

        });


        score++;

        updateScore();


        messageElement.textContent =
            "✨ Correct! Great job!";


        drawAllConnections();


        /*
           ตรวจว่าครบทุกคู่หรือยัง
        */

        if (
            connections.length ===
            ratioPairs.length
        ) {

            setTimeout(
                levelComplete,
                500
            );

        }

    } else {

        wrongConnection(
            leftCard,
            rightCard
        );

    }

}


/* =========================================
   WRONG ANSWER
========================================= */

function wrongConnection(
    leftCard,
    rightCard = null
) {

    leftCard.classList.remove(
        "selected"
    );


    leftCard.classList.add(
        "wrong"
    );


    if (rightCard) {

        rightCard.classList.add(
            "wrong"
        );

    }


    messageElement.textContent =
        "❌ Not quite! Try again.";


    setTimeout(() => {

        leftCard.classList.remove(
            "wrong"
        );


        if (rightCard) {

            rightCard.classList.remove(
                "wrong"
            );

        }

    }, 500);
}


/* =========================================
   TEMPORARY LINE
========================================= */

function createTemporaryLine(
    card
) {

    removeTemporaryLine();


    const line =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );


    line.setAttribute(
        "class",
        "connection-line temporary-line"
    );


    svg.appendChild(line);
}


/* =========================================
   UPDATE TEMPORARY LINE
========================================= */

function updateTemporaryLine(
    event
) {

    const line =
        svg.querySelector(
            ".temporary-line"
        );


    if (!line) {
        return;
    }


    const start =
        getConnectorPosition(
            currentDrag.card,
            "right"
        );


    const end =
        getBoardPosition(
            event.clientX,
            event.clientY
        );


    const path =
        createCurve(
            start.x,
            start.y,
            end.x,
            end.y
        );


    line.setAttribute(
        "d",
        path
    );
}


/* =========================================
   REMOVE TEMPORARY LINE
========================================= */

function removeTemporaryLine() {

    const line =
        svg.querySelector(
            ".temporary-line"
        );


    if (line) {

        line.remove();

    }
}


/* =========================================
   CLEANUP
========================================= */

function cleanupDrag() {

    removeTemporaryLine();


    if (currentDrag) {

        currentDrag.card.classList.remove(
            "selected"
        );

    }


    isDragging = false;

    currentDrag = null;
}


/* =========================================
   DRAW ALL CONNECTIONS
========================================= */

function drawAllConnections() {

    svg.innerHTML = "";


    connections.forEach(connection => {

        const start =
            getConnectorPosition(
                connection.left,
                "right"
            );


        const end =
            getConnectorPosition(
                connection.right,
                "left"
            );


        const line =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
            );


        line.setAttribute(
            "class",
            "connection-line correct"
        );


        line.setAttribute(
            "d",
            createCurve(
                start.x,
                start.y,
                end.x,
                end.y
            )
        );


        svg.appendChild(line);

    });

}


/* =========================================
   GET CONNECTOR POSITION
========================================= */

function getConnectorPosition(
    card,
    side
) {

    const connector =
        card.querySelector(
            ".connector"
        );


    const connectorRect =
        connector.getBoundingClientRect();


    const boardRect =
        board.getBoundingClientRect();


    let x;


    if (side === "right") {

        x =
            connectorRect.right -
            boardRect.left;

    } else {

        x =
            connectorRect.left -
            boardRect.left;

    }


    const y =
        connectorRect.top +
        connectorRect.height / 2 -
        boardRect.top;


    return {
        x: x,
        y: y
    };
}


/* =========================================
   GET POINTER POSITION
========================================= */

function getBoardPosition(
    clientX,
    clientY
) {

    const boardRect =
        board.getBoundingClientRect();


    return {

        x:
            clientX -
            boardRect.left,

        y:
            clientY -
            boardRect.top

    };

}


/* =========================================
   CREATE CURVED LINE
========================================= */

function createCurve(
    x1,
    y1,
    x2,
    y2
) {

    const distance =
        Math.abs(x2 - x1);


    const curve =
        Math.max(
            50,
            distance * 0.45
        );


    return `
        M ${x1} ${y1}

        C
        ${x1 + curve} ${y1},
        ${x2 - curve} ${y2},
        ${x2} ${y2}
    `;
}


/* =========================================
   UPDATE SCORE
========================================= */

function updateScore() {

    scoreElement.textContent =
        score;
}


/* =========================================
   LEVEL COMPLETE
========================================= */

function levelComplete() {

    finalScore.textContent =
        score;


    completeOverlay.classList.remove(
        "hidden"
    );


    messageElement.textContent =
        "🎉 All ratios matched!";
}


/* =========================================
   RESET
========================================= */

resetButton.addEventListener(
    "click",
    createGame
);


/* =========================================
   NEXT LEVEL
========================================= */

nextButton.addEventListener(
    "click",
    goNextLevel
);


continueButton.addEventListener(
    "click",
    goNextLevel
);

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


function goNextLevel() {

    window.location.href =
        "level2.html";
}


/* =========================================
   BACK
========================================= */

function goBack() {

    window.history.back();

}


/* =========================================
   HOME
========================================= */

function goHome() {

    window.location.href =
        "index.html";

}


/* =========================================
   RESPONSIVE REDRAW
========================================= */

window.addEventListener(
    "resize",
    () => {

        requestAnimationFrame(
            drawAllConnections
        );

    }
);


/* =========================================
   START GAME
========================================= */

createGame();

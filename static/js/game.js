const canvas = document.getElementById('canvas');
const canvasContext = canvas.getContext('2d');
const pacmanFrames = document.getElementById('animations');
const ghostFrames = document.getElementById('ghosts');

// Audio
const gameOverSound = new Audio('/static/audio/8d82b5_Pacman_Dies_Sound_Effect.mp3');
const finishSound = new Audio('/static/audio/8d82b5_Pacman_Opening_Song_Sound_Effect.mp3');
const eatSound = new Audio('/static/audio/8d82b5_Pacman_Eating_Cherry_Sound_Effect.mp3');
const chomp = new Audio('/static/audio/Voicy_Waka_Waka_PacMan_eating_sound_cut.mp3');
const collectCoinSound = new Audio('/static/audio/collect-coin.mp3');
const ghostSound = new Audio('/static/audio/Voicy_Ghost_Siren_sound_cut.mp3');
const catchSound = new Audio('/static/audio/a-sudden-appearance-143034.mp3');

let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
}

let fps = 30;
let oneBlockSize = 20;
let wallColor = "#342DCA";
let wallSpaceWidth = oneBlockSize / 1.5;
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
let wallInnerColor = "black";
let foodColor = "#FEB897";
let score = 0;
let ghosts = [];
let ghostCount = 4;
let lives = 3;
let foodCount = 0;
let clicked = false;
let opening = true;
let over = false;
let openingFinished = false;

const directionRight = 4;
const directionUp = 3;
const directionLeft = 2;
const directionBottom = 1;

let ghostLocations = [{
        x: 0,
        y: 0
    },
    {
        x: 176,
        y: 0
    },
    {
        x: 0,
        y: 121
    },
    {
        x: 176,
        y: 121
    },
];

let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
        if (map[i][j] == 2) {
            foodCount += 1;
        }
    }
}

let randomTargetsForGhosts = [{
        x: 1 * oneBlockSize,
        y: 1 * oneBlockSize
    },
    {
        x: 1 * oneBlockSize,
        y: (map.length - 2) * oneBlockSize
    },
    {
        x: (map[0].length - 2) * oneBlockSize,
        y: oneBlockSize
    },
    {
        x: (map[1].length - 2) * oneBlockSize,
        y: (map.length - 2) * oneBlockSize
    }
];

let startGame = () => {
    createNewPacman();
    createGhosts();
    gameLoop();
}

let gameLoop = () => {
    draw();
    if (!clicked) {
        drawStart();
    } else {
        if (opening) {
            finishSound.play();
            finishSound.addEventListener("ended", () => {
                openingFinished = true;
            });
            opening = false;
        }
        update();
    }
}

let update = () => {
    pacman.moveProcess();
    if (openingFinished) {
        ghostSound.play();
    }
    pacman.eat();

    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].moveProcess();
    }

    if (pacman.checkGhostCollision()) {
        catchSound.play();
        // console.log("hit");
        restartGame();
    }

    if (score >= foodCount) {
        drawWin();
        over = true;
        clearInterval(gameInterval);
        finishSound.play();
    }
}

let restartGame = () => {
    createNewPacman();
    createGhosts();
    lives -= 1;

    if (lives == 0) {
        gameOver();
    }
}

let gameOver = () => {
    over = true;
    drawGameOver();
    clearInterval(gameInterval);
    ghostSound.pause();
    chomp.pause();
    gameOverSound.play();
}

let drawStart = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Click to Start!", 56, 240);
}

let drawGameOver = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Game Over!", 112, 240);
}

let drawWin = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("AWESOME ALL DONE!", 44, 240);
}

let drawLives = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Lives: ", 220, oneBlockSize * (map.length + 1) + 20);

    for (let i = 0; i < lives; i++) {
        canvasContext.drawImage(
            pacmanFrames,
            2 * oneBlockSize,
            0,
            oneBlockSize,
            oneBlockSize,
            350 + i * oneBlockSize,
            oneBlockSize * map.length + 20,
            oneBlockSize,
            oneBlockSize
        );
    }
}

let drawFoods = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 2) {
                createRect(
                    j * oneBlockSize + oneBlockSize / 3,
                    i * oneBlockSize + oneBlockSize / 3,
                    oneBlockSize / 3,
                    oneBlockSize / 3,
                    foodColor
                );
            }
        }
    }
}

let drawScore = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText(
        "Score " + score,
        0,
        oneBlockSize * (map.length + 1) + 20
    );
}

let drawGhosts = () => {
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].draw();
    }
}

let draw = () => {
    createRect(0, 0, canvas.width, canvas.height, "black");
    drawWalls();
    drawFoods();
    pacman.draw();
    drawScore();
    drawGhosts();
    drawLives();
}

let gameInterval = setInterval(gameLoop, 1000 / fps);

let drawWalls = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 1) {
                createRect(
                    j * oneBlockSize,
                    i * oneBlockSize,
                    oneBlockSize,
                    oneBlockSize,
                    wallColor
                );

                if (j > 0 && map[i][j - 1] == 1) {
                    createRect(
                        j * oneBlockSize,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                if (j < map[0].length - 1 && map[i][j + 1] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    )
                }

                if (i > 0 && map[i - 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }

                if (i < map.length - 1 && map[i + 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    )
                }
            }
        }
    }
}

let createNewPacman = () => {
    pacman = new Pacman(
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize / 5
    );
}

let createGhosts = () => {
    ghosts = [];

    for (let i = 0; i < ghostCount; i++) {
        let newGhost = new Ghost(
            9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            oneBlockSize,
            oneBlockSize,
            pacman.speed / 2,
            ghostLocations[i % 4].x,
            ghostLocations[i % 4].y,
            126,
            116,
            8 + i
        );

        ghosts.push(newGhost);
    }
}

drawStart();
startGame();
// clearInterval(gameInterval);
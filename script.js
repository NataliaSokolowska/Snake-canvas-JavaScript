const canvas = document.getElementById('snake');
const ctx = canvas.getContext('2d');

canvas.width = 608;
canvas.height = 608;

const cw = canvas.width;
const ch = canvas.height;

const box = 32;

let appleImg = new Image();
appleImg.src = 'https://cdn.pixabay.com/photo/2012/04/18/00/30/apple-36282_1280.png';

const dead = new Audio();
const eat = new Audio();
const endMusic = new Audio();
dead.src = 'http://www.flashkit.com/imagesvr_ce/flashkit/soundfx/Cartoon/Bounces/Jump-DJ_SnowF-7574/Jump-DJ_SnowF-7574_hifi.mp3';
eat.src = 'http://www.flashkit.com/imagesvr_ce/flashkit/soundfx/Cartoon/Drinking/Slurp-Julian-8156/Slurp-Julian-8156_hifi.mp3';
endMusic.src = 'http://www.flashkit.com/imagesvr_ce/flashkit/loops/Ethnic/Noasis-Thomas_C-10450/Noasis-Thomas_C-10450_hifi.mp3';

let snake = [];

snake[0] = {
    x: 9 * box,
    y: 10 * box
}

let food = {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box
}

let direction;
const scoreSpan = document.getElementById('scoreSpan');
let score = 0;

let gamePaused = false;
let gameInProgress = false;

let gameInterval = window.setInterval(function () {});

function draw() {

    drawGround();

    ctx.drawImage(appleImg, food.x, food.y, box, box);

    drawSnake();

    //old Head Snake position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    //direction head snake during key movie
    if (direction == "left") snakeX -= box;
    if (direction == "up") snakeY -= box;
    if (direction == "right") snakeX += box;
    if (direction == "down") snakeY += box;

    //direction head snake during eat apple

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        scoreSpan.textContent = score;
        eat.play();
        food = {
            x: Math.floor(Math.random() * 19) * box,
            y: Math.floor(Math.random() * 19) * box
        }
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    }
    if (snakeX < 0 || snakeX > 19 * box || snakeY < 0 || snakeY > 19 * box || collision(newHead, snake)) {
        dead.play();
        endGame();
    }

    snake.unshift(newHead);
}

function drawGround() {
    ctx.beginPath();

    ctx.fillStyle = '#eeeff1';
    ctx.fillRect(0, 0, cw, ch);
    for (let x = 0; x <= cw; x += box) {
        ctx.moveTo(0.5 + x, 0);
        ctx.lineTo(0.5 + x, cw);
    }
    for (let x = 0; x <= cw; x += box) {
        ctx.moveTo(0, 0.5 + x);
        ctx.lineTo(cw, 0.5 + x);
    }
    ctx.strokeStyle = '#FFFFFE';
    ctx.stroke();
    ctx.closePath();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#84b71c";
    ctx.strokeRect(0, 0, cw, ch);
}

function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "#84b71c" : 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';;
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function showGameOverBtn() {
    gameOverMenu = document.getElementById('gameOverMenu');
    againBtn = document.getElementById('againBtn');

    gameOverMenu.className = 'active';
    againBtn.addEventListener('click', welcomeGame);
}

function setTitle(text) {
    let title = document.getElementById('title');
    title.innerHTML = text;
}

function resetScore() {
    score = 0;
    scoreSpan.textContent = score;
}

function togglePause() {
    if (gamePaused) {
        resumeGame();
    } else {
        ctx.fillStyle = '#5b627e';
        ctx.fillRect(0, 0, cw, ch);
        ctx.fillStyle = "#84b71c";
        ctx.font = "40px Georgia";
        ctx.fillText("Click P to return to the game", cw / 2 - 250, ch / 2);
        pauseGame();
    }
}

function resumeGame() {
    if (gamePaused) {
        gamePaused = false;
        initGame();
    }
}

function pauseGame() {
    if (!gamePaused) {
        gamePaused = true;
        clearInterval(gameInterval);
    }
}

function initGame() {
    gamePaused = false;
    gameInterval = window.setInterval(function () {
        draw();
    }, 200);
}

function welcomeGame() {
    drawGround();
    setTitle('Snake Game');
    ctx.fillStyle = "#84b71c";
    ctx.font = "40px Georgia";
    ctx.fillText("Click Enter to Start the game.", cw / 2 - 250, ch / 3);
    ctx.fillStyle = "#84b71c";
    ctx.font = "30px Georgia";
    ctx.fillText("Up - Arrows up", cw / 2 - 140, ch / 2);
    ctx.fillStyle = "#84b71c";
    ctx.font = "30px Georgia";
    ctx.fillText("Down - Arrows down", cw / 2 - 140, ch / 2 + 80);
    ctx.fillStyle = "#84b71c";
    ctx.font = "30px Georgia";
    ctx.fillText("Right - Arrows right", cw / 2 - 140, ch / 2 + 160);
    ctx.fillStyle = "#84b71c";
    ctx.font = "30px Georgia";
    ctx.fillText("Left - Arrows left", cw / 2 - 140, ch / 2 + 240);
    //gameOverMenu = document.getElementById('gameOverMenu');
    againBtn = document.getElementById('againBtn');

    gameOverMenu.className = 'game-over';

    //reset snake
    snake[0] = {
        x: 9 * box,
        y: 10 * box
    }
    snake.length = 1;
}

function endGame() {
    setTitle('Game Over');
    resetScore();
    drawGround();
    ctx.fillStyle = ctx.fillStyle = "rgba(91, 98, 126, 0.9)";
    ctx.fillRect(0, 0, cw, ch);
    ctx.fillStyle = "#84b71c";
    ctx.font = "40px Georgia";
    ctx.fillText("End game", cw / 2 - 80, ch / 2 - 100);
    endMusic.play();
    showGameOverBtn();
    againBtn.textContent = 'Try again';
    clearInterval(gameInterval);
}

document.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
        case 13:
            initGame();
            console.log('click enter');
            break;
        case 37:
            if (direction != "right")
                direction = "left"
            console.log('left');
            break;
        case 38:
            if (direction != "down")
                direction = "up"
            console.log('up');
            break;
        case 39:
            if (direction != "left")
                direction = "right"
            console.log('right');
            break;
        case 40:
            if (direction != "up")
                direction = "down"
            console.log('down');
            break;
        case 80:
            togglePause();
            break;
    }
});

welcomeGame();
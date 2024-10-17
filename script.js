/*
Backstory of the Spooky Captcha

In the not-so-distant future, developers assigned to prevent an AI takeover devised the Spooky Captcha playful 
captcha inspired by Flappy Bird to combat advanced bots. Set against a colorful autumn backdrop, players navigate
a ghostly bird through a whimsical Halloween setting.

During testing, an advanced AI named HAL-9001 hilariously misinterpreted the enchanting visuals as genuine threats. 
In a panic, it blared warnings, “Danger! Ghosts detected!” This incident left HAL-9001 trembling at the thought of
encountering the playful specters, as it conjured wild scenarios of ghostly ambushes and haunted pixelated realms.

As a result of HAL-9001’s exaggerated fright, other AIs steered clear of the Spooky Captcha, fearing it might summon
more “ghostly horrors.” Ironically, this reputation for being “haunted” made the Spooky Captcha the perfect choice for humans.
*/


var canvas = document.getElementById('gameCanvas');
canvas.width = 800;
canvas.height = 600;
var ctx = canvas.getContext('2d');

var birdImg = new Image();
birdImg.src = 'bird.png';
var pipeTopImg = new Image();
pipeTopImg.src = 'pipeTop.png';
var pipeBottomImg = new Image();
pipeBottomImg.src = 'pipeBottom.png';
var backgroundImg = new Image();
backgroundImg.src = 'background.png';

var bird = {
    x: 144,
    y: 150,
    velocity: 0
};
var pipes = [];
var gravity = 0.3;
var gap = 170;
var score = 0;
var gameRunning = false;
var countdownValue = 3;
var showInstructions = true;
var captchaPassed = false;

function init() {
    pipes.push(createPipe());
    initMatrixDrops();
    startCountdown();
    draw();
}

function createPipe() {
    return {
        x: canvas.width,
        width: 50,
        height: Math.floor(Math.random() * (canvas.height - 200) + 50)
    };
}

function startCountdown() {
    var countdown = setInterval(function () {
        countdownValue--;
        if (countdownValue <= 0) {
            gameRunning = true;
            showInstructions = false;
            clearInterval(countdown);
        }
    }, 1000);
}

function draw() {
    drawBackground();

    if (showInstructions) {
        drawInstructions();
    } else {
        drawScoreBoard();
        drawProgressBar();
        if (gameRunning) {
            drawBird();
            drawPipes();
            applyGravity();
            checkGameOver();
            checkScore();
        }

        if (score >= 5 && !gameRunning) {
            displayCaptchaPassed();
        } else if (!gameRunning) {
            displayGameOver();
        }
    }

    requestAnimationFrame(draw);
}

var matrixColumns = Math.floor(canvas.width / 20);
var matrixDrops = [];
function initMatrixDrops() {
    for (var i = 0; i < matrixColumns; i++) {
        matrixDrops[i] = Math.random() * canvas.height;
    }
}

function drawMatrixBackground() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "green";
    ctx.font = "20px monospace";

    for (var i = 0; i < matrixColumns; i++) {
        var text = String.fromCharCode(Math.random() * 128);
        ctx.fillText(text, i * 20, matrixDrops[i]);

        if (matrixDrops[i] > canvas.height && Math.random() > 0.975) {
            matrixDrops[i] = 0;
        }
        matrixDrops[i] += 20;
    }
}

function drawBackground() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
}

function drawInstructions() {
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillRect(50, canvas.height / 2 - 100, canvas.width - 100, 200);

    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Press Space to Jump", canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText("Score at least 5 to pass this captcha!", canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText("Countdown: " + countdownValue, canvas.width / 2, canvas.height / 2 + 60);
}

function drawScoreBoard() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, 10, 30);
}

function drawProgressBar() {
    ctx.fillStyle = "#ccc";
    ctx.fillRect(10, 40, 780, 20);

    var progressWidth = (score / 5) * 780;
    ctx.fillStyle = "green";
    ctx.fillRect(10, 40, progressWidth, 20);
}

function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, 40, 40);
}

function drawPipes() {
    for (var i = 0; i < pipes.length; i++) {
        var pipeTopY = pipes[i].height - pipeTopImg.height;
        ctx.drawImage(pipeTopImg, pipes[i].x, pipeTopY);
        ctx.drawImage(pipeBottomImg, pipes[i].x, pipes[i].height + gap);

        if (gameRunning) {
            pipes[i].x -= 2;

            if (pipes[i].x == 100) {
                pipes.push(createPipe());
            }
        }
    }
}

function checkGameOver() {
    for (var i = 0; i < pipes.length; i++) {
        if (bird.y + 40 > canvas.height ||
            (bird.x < pipes[i].x + pipes[i].width &&
                bird.x + 40 > pipes[i].x &&
                bird.y < pipes[i].height) ||
            (bird.x < pipes[i].x + pipes[i].width &&
                bird.x + 40 > pipes[i].x &&
                bird.y + 40 > pipes[i].height + gap)
        ) {
            gameRunning = false;
        }
    }
}

function checkScore() {
    for (var i = 0; i < pipes.length; i++) {
        if (pipes[i].x + pipes[i].width < bird.x && !pipes[i].scored) {
            score++;
            pipes[i].scored = true;
            if (score >= 5 && gameRunning) {
                gameRunning = false;
                captchaPassed = true;
            }
        }
    }
}

function displayGameOver() {
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillRect(50, canvas.height / 2 - 100, canvas.width - 100, 200);

    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Hmm, you might be a robot...Press 'r' to try again!", canvas.width / 2, canvas.height / 2);
}

function displayCaptchaPassed() {
    drawMatrixBackground();

    ctx.fillStyle = "green";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Congrats, You passed the Captcha!", canvas.width / 2, canvas.height / 2);
}

function applyGravity() {
    bird.velocity += gravity;
    bird.y += bird.velocity;
}

window.addEventListener('keydown', function (e) {
    if (e.key === " " && gameRunning) {
        bird.velocity = -4;
    } else if (e.key === "r" && !gameRunning && !captchaPassed && !showInstructions) {
        location.reload();
    }
});

init();


//Javascript for the halfpong game.

//Some mixed variables and initialization.
var leftWall = 15;
var topWall = 15;
var bottomWall = 333;
var rightWall = 750;
var upPressed = false;
var downPressed = false;
var leftPressed = false;
var leftAllowed = true;
var collisionAllowed = true;
var score = 0;
var level = 1;
var gamePaused = true;

var paddle = []
paddle["x"] = 700;
paddle["y"] = 150;
paddle["w"] = 20;
paddle["h"] = 60;

var ball = []
ball["x"] = 100;
ball["y"] = 150;
ball["xdir"] = 1;
ball["ydir"] = 1; //Could be random.
ball["speed"] = 3;

var canvas = document.getElementById('gamecanvas');
var ctx = canvas.getContext('2d');

var canvas2 = document.getElementById('topcanvas');
var ctx2 = canvas2.getContext('2d');

var canvas3 = document.getElementById('targetcanvas');
var ctx3 = canvas3.getContext('2d');

var canvas4 = document.getElementById('deathcanvas');
var ctx4 = canvas4.getContext('2d');

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


//--Checking if keys are pressed--
function keyDownHandler(e) {
    if(e.key === "ArrowUp") {
        upPressed = true;
        downPressed = false;
    }
    else if(e.key === "ArrowDown") {
        downPressed = true;
        upPressed = false;
    }
    else if(e.key === "ArrowLeft") {
        leftPressed = true;
    }
    else if(e.key === "p") {
        togglePause();
    }
    else if(e.key === "r") {
        restartGame();
    }
}

function keyUpHandler(e) {
    if (e.key === "ArrowUp") {
        upPressed = false; 
    }
    else if (e.key === "ArrowDown") {
        downPressed = false;
    }
}

function moveWithKeys() {
    if(upPressed && paddle["y"] > 0) {
        movePaddle("y", -1, 4*ball["speed"]/3);
    }
    else if (downPressed && paddle["y"] < canvas.height-paddle["h"]-10) {
        movePaddle("y", 1, 4*ball["speed"]/3);
    }
    if (leftPressed && leftAllowed) {
        paddle["x"] -= 20;
        leftAllowed = false;
        setTimeout(resetPaddlePosition, 50);
    }
}

//Alternate between play and pause.
function togglePause() {
    if (gamePaused) {
        document.getElementById('playbutton').innerHTML = "Pausar";
    }
    else {
        document.getElementById('playbutton').innerHTML = "Iniciar";
    }
    gamePaused = !gamePaused;
}

//Restart the game reseting the variables.
function restartGame() {
    togglePause();
    ball["x"] = 100;
    ball["y"] = 150;
    paddle["y"] = 150;
    score = 0;
    level = 1;
    upPressed = false;
    downPressed = false;
    leftPressed = false;
    ball["speed"] = 3;
    resetPaddlePosition;
}

//Move the paddle back to the original position.
function resetPaddlePosition() {
        paddle["x"] += 20;
        leftAllowed = true;
        leftPressed = false;
}

//Return the ball to its original speed.
function resetBallSpeed() {
        ball["speed"] /= 1.3;
}

//Draw the score, level and some decorations.
function drawTopCanvas() {
    ctx2.clearRect(0, 0, 740, 20);
    ctx2.font = "Arial 14";
    ctx2.fillText("Puntuación: "+score+"  Nivel: "+level, 320, 15, 120);
}

//Draw the color targets with different scores.
function drawTargets() {
    ctx3.fillStyle = "rgb(100, 0, 120)"; //50 points
    ctx3.fillRect(0, 30, 20, 80);
    ctx3.fillStyle = "rgb(120, 100, 0)"; //20 points
    ctx3.fillRect(0, 135, 20, 80);
    ctx3.fillStyle = "rgb(0, 120, 100)"; //100 points
    ctx3.fillRect(0, 240, 20, 80);
}

//Draw a game frame. This is the main function.
function drawGame() {
    if (!gamePaused) {
        checkGameStatus();  //Are you playing or did you lose?
        checkCollision();   //Are you touching something?
        moveBall("x", ball["xdir"], ball["speed"]); //Move ball on x axis
        moveBall("y", ball["ydir"], ball["speed"]); //Move ball on y axis
        moveWithKeys();     //Move the paddle up and down
    }   
        drawTargets();
        ctx.clearRect(0, 0, 780, 358); 
        ctx.fillStyle = "rgba(0, 0, 200, 0.7)"; //Set paddle color
        ctx.fillRect(paddle["x"], paddle["y"], paddle["w"], paddle["h"]); //Draw the paddle
        ctx.fillStyle = "rgba(200, 0, 0, 0.7)"; //Set ball color
        ctx.beginPath();
        ctx.arc(ball["x"], ball["y"], 15, 0, 2*Math.PI, true);  //Draw the ball
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        drawTopCanvas();    //Draw canvas with scores and level.
        window.requestAnimationFrame(drawGame); //Draw a new frame
}

//--Game mechanics functions--

function movePaddle(axis, direction, value) {
    paddle[axis] += direction*value;
}

function moveBall(axis, direction, value) {
    ball[axis] += direction*value;
}

function checkCollision() {
    //Ball collides with left wall.
    if ((ball["x"] <= leftWall)) {
        ball["xdir"] *= -1;
        
        //Increase scores depending on collision point.
        raiseScore();
        level++;
        //Make the ball go faster when you go to the next level.
        ball["speed"] *= 1.1;
        console.log(score);
    }
    
    //Ball collides with top and bottom wall.
    else if ((ball["y"] < topWall) || (ball["y"] > bottomWall)) {
        ball["ydir"] *= -1;
    }
    
    //Ball collides with paddle.
    else if (ball["x"]+15 >= paddle["x"] && ball["x"]-15 <= paddle["x"]+paddle["w"] && ball["y"]-15 <= paddle["y"]+paddle["h"] && ball["y"]+15 >= paddle["y"] ) { 
        ball["xdir"] *= -1;
        if (leftPressed) {
            originalSpeed = ball["speed"];
            ball["speed"] *= 1.3;
            setTimeout(resetBallSpeed, 1000);
        }
    }
    
}

function checkGameStatus() {
    //You lose because the ball is out of the field.
    if (ball["x"] > 750) {
        alert("Perdiste.\nPuntuación: "+score+"\nLlegaste al nivel: "+level);
        restartGame();
    }
    
}

//Increase your score based on where you collide.
function raiseScore() {
    if (ball["y"] > 30 && ball["y"] < 110) {
        score += 50;
    }
    else if (ball["y"] > 135 && ball["y"] < 215) {
        score += 20;
    }
    else if (ball["y"] > 240 && ball["y"] < 320) {
        score += 100;
    }
    else {
        score += 1;
    }
}

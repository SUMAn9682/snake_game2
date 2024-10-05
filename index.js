let direction = {x: 0, y: 0};
const foodSound = new Audio('music_food.mp3');
const gameOverSound = new Audio('music_gameover.mp3');
const moveSound = new Audio('music_move.mp3');
const musicSound = new Audio('music_music.mp3');
musicSound.play();  // Play the music only once at the start

let speed = 7;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{x: 13, y: 15}];  // Initial snake

let food = {x: 18, y: 15};  // Initial food position
let inputDir = {x: 0, y: 0};  // Snake's movement direction

// High Score initialization
let highscoreval = localStorage.getItem("HighScoreBox");  // Fetch highscore from localStorage
if (highscoreval === null) {
    highscoreval = 0;
    localStorage.setItem("HighScoreBox", JSON.stringify(highscoreval));  // Set initial high score
} else {
    highscoreval = JSON.parse(highscoreval);
}

// Display the high score on the screen
document.getElementById('HighScoreBox').innerHTML = "HighScore: " + highscoreval;

// Game loop function
function main(cTime) {
    window.requestAnimationFrame(main);
    if ((cTime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = cTime;
    gameEngine();
}

function isCollide(snakeArr) {
    // If the snake hits itself
    for (let i = 1; i < snakeArr.length; i++) {
        if (snakeArr[i].x === snakeArr[0].x && snakeArr[i].y === snakeArr[0].y) {
            return true;
        }
    }
    // If the snake hits the wall (dynamically based on the board's grid size)
    const gridSizeX = 40;  // Adjust based on actual grid size
    const gridSizeY = 30;
    if (snakeArr[0].x >= gridSizeX || snakeArr[0].x <= 0 || snakeArr[0].y >= gridSizeY || snakeArr[0].y <= 0) {
        return true;
    }
    return false;
}

function gameEngine() {
    // Collision detection
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = {x: 0, y: 0};
        alert("Game over. Press any key to play again!");

        // Check if current score is greater than highscore and update it
        if (score > highscoreval) {
            highscoreval = score;
            localStorage.setItem("HighScoreBox", JSON.stringify(highscoreval));  // Update high score in localStorage
            document.getElementById('HighScoreBox').innerHTML = "HighScore: " + highscoreval;  // Update high score display
        }

        // Reset game variables
        snakeArr = [{x: 13, y: 15}];  // Reset the snake
        musicSound.play();
        score = 0;  // Reset score
        document.getElementById('scoreBox').innerHTML = "Score: " + score;  // Reset score display
        return;  // Exit the game engine to stop execution
    }

    // If the snake eats the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;  // Increment score
        document.getElementById('scoreBox').innerHTML = "Score: " + score;  // Update score display

        // Add new segment to the snake at the front (growth)
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y});
        
        let a = 2;
        let b = 30;
        // Generate new random position for food, ensuring it's not on the snake
        let newFoodPosition;
        do {
            newFoodPosition = {
                x: Math.round(a + (b - a) * Math.random()),
                y: Math.round(a + (b - a) * Math.random())
            };
        } while (snakeArr.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
        food = newFoodPosition;
    }

    // Move the snake's body
    for (let i = snakeArr.length - 1; i > 0; i--) {
        snakeArr[i] = { ...snakeArr[i - 1] };  // Move each segment to the position of the previous one
    }

    // Move the snake's head
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Clear the board
    const board = document.getElementById('board');
    board.innerHTML = "";

    // Display the snake
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snakeBody');  // Use 'snakeBody' class as per CSS
        }
        board.appendChild(snakeElement);
    });

    // Display the food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');  // Add a class for the food element
    board.appendChild(foodElement);
}

// Initialize game loop
window.requestAnimationFrame(main);

// Add event listener for keyboard input
window.addEventListener('keydown', e => {
    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y !== 1) {  // Prevent snake from reversing
                inputDir.x = 0;
                inputDir.y = -1;
                moveSound.play();
            }
            break;

        case "ArrowDown":
            if (inputDir.y !== -1) {
                inputDir.x = 0;
                inputDir.y = 1;
                moveSound.play();
            }
            break;

        case "ArrowLeft":
            if (inputDir.x !== 1) {
                inputDir.x = -1;
                inputDir.y = 0;
                moveSound.play();
            }
            break;

        case "ArrowRight":
            if (inputDir.x !== -1) {
                inputDir.x = 1;
                inputDir.y = 0;
                moveSound.play();
            }
            break;

        default:
            break;
    }
});

// Add event listeners for mobile buttons
document.getElementById('upButton').addEventListener('click', () => {
    if (inputDir.y !== 1) {
        inputDir.x = 0;
        inputDir.y = -1;
        moveSound.play();
    }
});

document.getElementById('downButton').addEventListener('click', () => {
    if (inputDir.y !== -1) {
        inputDir.x = 0;
        inputDir.y = 1;
        moveSound.play();
    }
});

document.getElementById('leftButton').addEventListener('click', () => {
    if (inputDir.x !== 1) {
        inputDir.x = -1;
        inputDir.y = 0;
        moveSound.play();
    }
});

document.getElementById('rightButton').addEventListener('click', () => {
    if (inputDir.x !== -1) {
        inputDir.x = 1;
        inputDir.y = 0;
        moveSound.play();
    }
});

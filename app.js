const canvas = document.getElementById('canvas');
const pen = canvas.getContext('2d');
pen.fillStyle = 'black';

const CANVAS_HEIGHT = 650;
const CANVAS_WIDTH = 1200;

let speedLevel = 'medium';
let id;
let snake;
let food;
let isGameRunning = false;

class Snake {
    constructor(init_len=5) {
        this.init_len = init_len;
        this.direction = 'right';
        this.cells = [];
        this.cellSize = 67;
    }

    createSnake() {
        for (let i = 0; i < this.init_len; i++){
            this.cells.push({ x: i, y: 0 });
        }
    }

    drawSnake() {
        for (let i = 0; i < this.cells.length; i++) {
            const cell = this.cells[i];
            pen.fillStyle = i === this.cells.length - 1 ? 'red' : 'black';
            pen.fillRect(cell.x * this.cellSize, cell.y * this.cellSize, this.cellSize - 2, this.cellSize - 2);
        }
    }

    getNextCellCoordinate() {
        const headX = this.cells[this.cells.length - 1].x;
        const headY = this.cells[this.cells.length - 1].y;

        let nextX;
        let nextY;

        switch (this.direction) {
            case 'left':
                nextX = headX - 1;
                nextY = headY;
                break;
            case 'up':
                nextX = headX;
                nextY = headY - 1;
                break;
            case 'down':
                nextX = headX;
                nextY = headY + 1;
                break;
            default:
                nextX = headX + 1;
                nextY = headY;
        }

        return { x: nextX, y: nextY };
    }

    updateSnake(collision) {
        const nextCellCoordinates = this.getNextCellCoordinate();
        // removes first cell from the cells array
        if (!collision) {
            this.cells.shift();
        }
        // add new cell after the current head
        this.cells.push(nextCellCoordinates);
    }

    getSnakeHead() {
        const headX = this.cells[this.cells.length - 1].x;
        const headY = this.cells[this.cells.length - 1].y;

        return { x: headX, y: headY };
    }
}

class Food {
    constructor() {      
        this.foodSize = 67;
        this.x = 0;
        this.y = 0;
    }

    getRandomFood() {
        this.x = Math.floor(Math.random() * (CANVAS_WIDTH - this.foodSize)/this.foodSize);
        this.y = Math.floor(Math.random() * (CANVAS_HEIGHT - this.foodSize)/this.foodSize);
    }

    drawFood() {
        pen.fillStyle = 'black';
        pen.fillRect(this.x * this.foodSize, this.y * this.foodSize, this.foodSize, this.foodSize);
    }
}

function changeSpeed(newSpeed) {
    speedLevel = newSpeed;
    if (isGameRunning) {
        clearInterval(id);
        id = setInterval(gameLoop, getInterval());
    }
}

function getInterval() {
    switch (speedLevel) {
        case 'slow':
            return 250;
        case 'medium':
            return 150;
        case 'fast':
            return 100;
        default:
            return 150;
    }
}

function init() {
    snake = new Snake();
    snake.createSnake();
    food = new Food();
    food.getRandomFood();

    function keyPressed(event) {
        switch (event.key) {
            case 'ArrowDown':
                snake.direction = 'down';
                break;
            case 'ArrowUp':
                snake.direction = 'up';
                break;
            case 'ArrowLeft':
                snake.direction = 'left';
                break;
            default:
                snake.direction = 'right';
        }
    }

    document.addEventListener('keydown', keyPressed);
}

function draw() {
    pen.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    food.drawFood();
    snake.drawSnake();
    const nextCellCoordinates = snake.getNextCellCoordinate();
    if (nextCellCoordinates.x * snake.cellSize - snake.cellSize >= CANVAS_WIDTH || nextCellCoordinates.y * snake.cellSize < 0 || nextCellCoordinates.y * snake.cellSize >= CANVAS_HEIGHT) {
        pen.font = 'bold 48px serif';
        pen.fillStyle = 'red';
        pen.fillText('Game Over', 100, 100);
        clearInterval(id);
        isGameRunning = false;
    }
}

function update() {
    const snakeHead = snake.getSnakeHead();
    let collision = false;
    if (snakeHead.x === food.x && snakeHead.y === food.y) {
        collision = true;
        food.getRandomFood();
    }
    snake.updateSnake(collision);
}

function gameLoop() {
    update();
    draw();
}

function startGame() {
    init();
    isGameRunning = true;
    id = setInterval(gameLoop, getInterval());
}

function pauseGame() {
    clearInterval(id);
    isGameRunning = false;
}

function resumeGame() {
    if (!isGameRunning) {
        id = setInterval(gameLoop, getInterval());
        isGameRunning = true;
    }
}

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('pauseButton').addEventListener('click', pauseGame);
document.getElementById('resumeButton').addEventListener('click', resumeGame);

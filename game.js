const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let gameInterval;
let player;
let platforms;
let currentLevel = 1;

class Player {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = 5;
        this.jumpForce = 15;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isGrounded = false;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Gravity
        if (!this.isGrounded) {
            this.velocityY += 0.5;
        }

        // Prevent player from going out of bounds
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
        if (this.y + this.height > canvas.height) this.y = canvas.height - this.height;
    }

    jump() {
        console.log('here')
        if (true) {
            console.log('Now here')
            this.velocityY = -this.jumpForce;
            this.isGrounded = false;
        }
    }
}

class Platform {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function createLevel(level) {
    if (level === 1) {
        return [
            new Platform(0, 580, 800, 20, 'green'),
            new Platform(100, 450, 200, 20, 'green'),
            new Platform(400, 350, 200, 20, 'green'),
        ];
    } else if (level === 2) {
        return [
            new Platform(0, 580, 800, 20, 'green'),
            new Platform(50, 450, 150, 20, 'green'),
            new Platform(300, 300, 250, 20, 'green'),
            new Platform(600, 200, 150, 20, 'green'),
        ];
    }
}

function startGame() {
    player = new Player(50, 550, 30, 30, 'blue');
    platforms = createLevel(currentLevel);
    gameInterval = setInterval(updateGame, 20);
}

function selectLevel(level) {
    clearInterval(gameInterval);
    currentLevel = level;
    startGame();
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.update();
    player.draw();

    platforms.forEach(platform => {
        platform.draw();

        // Check for collision with platforms
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y < platform.y + platform.height &&
            player.y + player.height > platform.y) {
            player.isGrounded = true;
            player.velocityY = 0;
            player.y = platform.y - player.height;
        }
    });

    player.isGrounded = player.y + player.height >= canvas.height;
}

document.addEventListener('keydown', (e) => {
    console.log(e)
    if (e.code === 'ArrowLeft') {
        player.velocityX = -player.speed;
    } else if (e.code === 'ArrowRight') {
        player.velocityX = player.speed;
    } else if (e.code === 'Space') {
        player.jump();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        player.velocityX = 0;
    }
});

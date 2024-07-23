const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let gameInterval;
let player;
let platforms;
let score;
let scoreInterval;
let platformGenerationInterval;

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

        // Check if player is grounded
        this.isGrounded = false;
        for (let platform of platforms) {
            if (this.x < platform.x + platform.width &&
                this.x + this.width > platform.x &&
                this.y + this.height > platform.y &&
                this.y + this.height < platform.y + platform.height) {
                this.isGrounded = true;
                this.velocityY = 0;
                this.y = platform.y - this.height;
                break;
            }
        }
    }

    jump() {
        if (this.isGrounded) {
            this.velocityY = -this.jumpForce;
            this.isGrounded = false;
        }
    }
}

class Platform {
    constructor(x, y, width, height, color, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.removePlatform();
        }
    }

    removePlatform() {
        const index = platforms.indexOf(this);
        if (index > -1) {
            platforms.splice(index, 1);
        }
    }
}

function generatePlatform() {
    const width = Math.random() * 200 + 100; // Random width between 100 and 300
    const x = Math.random() * (canvas.width - width); // Random x position within canvas
    const platform = new Platform(x, 0, width, 20, 'green', 1);
    platforms.push(platform);
}

function startGame() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';
    score = 0;
    document.getElementById('score').innerText = 'Score: 0';
    player = new Player(50, 550, 30, 30, 'blue');
    platforms = [new Platform(0, 580, 800, 20, 'green', 0)];
    gameInterval = setInterval(updateGame, 20);
    scoreInterval = setInterval(updateScore, 1000);
    platformGenerationInterval = setInterval(generatePlatform, 3000); // Generate a new platform every 3 seconds
}

function updateScore() {
    score++;
    document.getElementById('score').innerText = 'Score: ' + score;
}

function gameOver() {
    clearInterval(gameInterval);
    clearInterval(scoreInterval);
    clearInterval(platformGenerationInterval);
    document.getElementById('gameOver').style.display = 'block';
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.update();
    player.draw();

    platforms.forEach(platform => {
        platform.update();
        platform.draw();
    });

    // Check if player has fallen off the screen
    if (player.y + player.height >= canvas.height) {
        gameOver();
    }
}

document.addEventListener('keydown', (e) => {
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

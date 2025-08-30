const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let block = { x: 80, y: 200, size: 30, velocity: 0, gravity: 0.5, lift: -8 };
let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

// Controls
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    block.velocity = block.lift;
    if (gameOver) restartGame();
  }
});

document.addEventListener("click", () => {
  block.velocity = block.lift;
  if (gameOver) restartGame();
});

function restartGame() {
  block.y = 200;
  block.velocity = 0;
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
}

function drawBlock() {
  ctx.fillStyle = "#0ff";
  ctx.fillRect(block.x, block.y, block.size, block.size);
  ctx.shadowBlur = 20;
  ctx.shadowColor = "#0ff";
}

function drawPipes() {
  ctx.fillStyle = "#f0f";
  pipes.forEach(p => {
    ctx.fillRect(p.x, 0, p.width, p.top);
    ctx.fillRect(p.x, canvas.height - p.bottom, p.width, p.bottom);
  });
}

function update() {
  if (gameOver) return;

  // Apply physics to block
  block.velocity += block.gravity;
  block.y += block.velocity;

  // Check for out-of-bounds
  if (block.y + block.size > canvas.height || block.y < 0) {
    gameOver = true;
  }

  // Generate new pipes
  if (frame % 90 === 0) {
    const gap = 150;
    const top = Math.random() * (canvas.height - gap - 100) + 50;
    pipes.push({
      x: canvas.width,
      width: 50,
      top: top,
      bottom: canvas.height - top - gap,
      passed: false
    });
  }

  // Move pipes
  pipes.forEach(pipe => {
    pipe.x -= 2;
  });

  // Collision detection and scoring
  for (const pipe of pipes) {
    if (
      block.x < pipe.x + pipe.width &&
      block.x + block.size > pipe.x &&
      (block.y < pipe.top || block.y + block.size > canvas.height - pipe.bottom)
    ) {
      gameOver = true;
    }

    if (!pipe.passed && pipe.x + pipe.width < block.x) {
      pipe.passed = true;
      score++;
    }
  }

  // Remove off-screen pipes
  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

  frame++;
}

function drawScore() {
  ctx.fillStyle = "#0ff";
  ctx.font = "24px monospace";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function drawGameOver() {
  ctx.fillStyle = "#f00";
  ctx.font = "36px monospace";
  ctx.fillText("GAME OVER", canvas.width / 2 - 100, canvas.height / 2);
  ctx.font = "18px monospace";
  ctx.fillText("Press Space or Click to Restart", canvas.width / 2 - 140, canvas.height / 2 + 40);
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBlock();
  drawPipes();
  drawScore();
  update();

  if (gameOver) drawGameOver();

  requestAnimationFrame(loop);
}

// Start the game loop
loop();

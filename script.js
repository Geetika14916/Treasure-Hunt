const gridsize = 5;
let treasureLocation = { x: 0, y: 0 };
let attemptsLeft = 10;
let isGameOver = false;

// INITIALIZE GAME
function InitializeGame() {
  const gridContainer = document.getElementById("grid-container");
  const feedbackElement = document.getElementById("feedback");
  const attemptsElement = document.getElementById("attempts");
  const replayButton = document.getElementById("replay-button");

  gridContainer.innerHTML = ""; // Clear the grid
  feedbackElement.innerHTML = ""; // Clear feedback
  replayButton.style.display = "none"; // Hide the replay button
  attemptsLeft = 10;
  isGameOver = false;
  attemptsElement.innerText = attemptsLeft;

  treasureLocation.x = Math.floor(Math.random() * gridsize);
  treasureLocation.y = Math.floor(Math.random() * gridsize);

  // Create Grid
  for (let row = 0; row < gridsize; row++) {
    for (let col = 0; col < gridsize; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", handleCellClick);
      gridContainer.appendChild(cell);
    }
  }
}

// HANDLE CLICK
function handleCellClick(e) {
  if (isGameOver) return;

  const cell = e.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  if (cell.classList.contains("open")) return;
  cell.classList.add("open");
  attemptsLeft--;
  document.getElementById("attempts").innerText = attemptsLeft;

  if (row === treasureLocation.x && col === treasureLocation.y) {
    const treasureImg = document.createElement("img");
    treasureImg.src = "treasure.jfif";
    treasureImg.alt = "Treasure";
    treasureImg.style.width = "100%";
    treasureImg.style.height = "100%";
    cell.appendChild(treasureImg);
    displayFeedback("You have found the Treasure! You win!", "green");
    gameOver(true);
    return;
  }

  // Near and far feedback
  const distance = getDistance(
    row,
    col,
    treasureLocation.x,
    treasureLocation.y
  );
  let feedbackMessage = "";
  if (distance < 1) {
    feedbackMessage = "You're at the Treasure!";
  } else if (distance < 2) {
    feedbackMessage = "Very Close!";
  } else if (distance < 3) {
    feedbackMessage = "Near!";
  } else {
    feedbackMessage = "Far!";
  }

  displayFeedback(feedbackMessage, "red");

  // If no attempts left, game over
  if (attemptsLeft === 0) {
    displayFeedback("Game Over! You lost.", "red");
    gameOver(false);
  }
}

// Calculate Euclidean distance between two points
function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Display feedback to the user
function displayFeedback(message, color) {
  const feedbackElement = document.getElementById("feedback");
  feedbackElement.innerHTML = message;
  feedbackElement.style.color = color;
}

// End the game
function gameOver(won) {
  if (!won) {
    const cell = document.querySelector(
      `[data-row="${treasureLocation.x}"][data-col="${treasureLocation.y}"]`
    );
    const treasureImg = document.createElement("img");
    treasureImg.src = "treasure.jfif";
    treasureImg.alt = "Treasure";
    treasureImg.style.width = "100%";
    treasureImg.style.height = "100%";
    cell.appendChild(treasureImg);
  }
  isGameOver = true;
  const replayButton = document.getElementById("replay-button");
  replayButton.style.display = "block"; // Show the replay button
  replayButton.removeEventListener("click", InitializeGame); // Clean up
  replayButton.addEventListener("click", InitializeGame); // Add fresh listener
}

// Initialize the game on page load
window.onload = InitializeGame;

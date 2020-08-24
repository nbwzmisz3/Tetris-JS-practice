document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".game-grid");
  let squares = Array.from(document.querySelectorAll(".game-grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startButton = document.querySelector("#start-button");
  const width = 10;
  let nextRandom = 0;
  let timerSetting;
  let score = 0;
  const brickColors = ["blue", "green", "red", "grey", "yellow"];

  // drawing bricks on the grid in all rotations
  const brickL = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];
  const brickZ = [
    [width * 2, width * 2 + 1, width + 1, width + 2],
    [0, width, width + 1, width * 2 + 1],
    [width * 2, width * 2 + 1, width + 1, width + 2],
    [0, width, width + 1, width * 2 + 1],
  ];
  const brickT = [
    [width, 1, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width + 1, width, width * 2 + 1],
  ];
  const brickSquare = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];
  const brickLong = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const bricksAll = [brickL, brickZ, brickT, brickSquare, brickLong];

  let currentPosition = 4;
  let currentRotation = 0;

  let random = Math.floor(Math.random() * bricksAll.length);
  let current = bricksAll[random][currentRotation];

  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("brick-draw");
      squares[currentPosition + index].style.backgroundColor =
        brickColors[random];
    });
  }
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("brick-draw");
      squares[currentPosition + index].style.backgroundColor = "";
    });
  }

  //assigning functions to keycodes
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 39) {
      moveRigth();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 40) {
      if (timerSetting) {
        moveDown();
      }
    }
  }
  document.addEventListener("keydown", control);

  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    brickPositionLock();
  }
  //bottom position function
  function brickPositionLock() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );
      //start new brick
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * bricksAll.length);
      current = bricksAll[random][currentRotation];
      currentPosition = 4;
      draw();
      displayNextBrick();
      addScore();
      gameOver();
    }
  }

  // functions for moving the bricks and keeping them in grid
  function moveLeft() {
    undraw();
    const brickAtLeftBorder = current.some(
      (index) => (currentPosition + index) % width === 0
    );
    if (!brickAtLeftBorder) currentPosition -= 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  function moveRigth() {
    undraw();
    const brickAtRigthBorder = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );
    if (!brickAtRigthBorder) currentPosition += 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      currentRotation = 0;
    }
    current = bricksAll[random][currentRotation];
    draw();
  }

  //displaying bricks in mini grid
  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  let displayIndex = 0;

  //array of bricks in first rotation
  const nextBrickComing = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    [
      displayWidth * 2,
      displayWidth * 2 + 1,
      displayWidth + 1,
      displayWidth + 2,
    ],
    [displayWidth, 1, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
  ];

  function displayNextBrick() {
    displaySquares.forEach((square) => {
      square.classList.remove("brick-draw");
      square.style.backgroundColor = "";
    });
    nextBrickComing[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("brick-draw");
      displaySquares[displayIndex + index].style.backgroundColor =
        brickColors[nextRandom];
    });
  }

  // start-pause button
  startButton.addEventListener("click", () => {
    if (timerSetting) {
      clearInterval(timerSetting);
      timerSetting = null;
    } else {
      draw();
      timerSetting = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random() * bricksAll.length);
      displayNextBrick();
    }
  });

  // score display and row-full managment
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];
      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("brick-draw");
          squares[index].style.backgroundColor = "";
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  //game over
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      scoreDisplay.innerHTML = ` Game Over!!! Your end score is ${score}!!!`;
      clearInterval(timerSetting);
      document.removeEventListener("keydown", control);
      startButton.innerHTML = "Reset and New Game";
      startButton.addEventListener("click", gameReset);
    }
  }

  //reset
  function gameReset() {
    location.reload();
  }
});

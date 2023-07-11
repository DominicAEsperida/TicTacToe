let playerText = document.getElementById('playerText');
let restartBtn = document.getElementById('restartBtn');
let startBtn = document.getElementById('startBtn');
let boxes = Array.from(document.getElementsByClassName('box'));

let winnerIndicator = getComputedStyle(document.body).getPropertyValue('--winning-blocks');

const O_TEXT = "O";
const X_TEXT = "X";
let currentPlayer = X_TEXT;
let spaces = Array(9).fill(null);
let isTimerRunning = false; // Flag to track if the timer is running or not
let timer;
let circle1 = document.querySelector('.circle1');

const startGame = () => {
    boxes.forEach(box => box.addEventListener('click', boxClicked));
};

function boxClicked(e) {
    if (!isTimerRunning) {
        return; // If the timer has not started, do not allow clicking on the board
    }
    
    if (playerHasWon() || isBoardFull()) {
        return; // If the game is already over, do not process the click event
    }
    
    const id = e.target.id;

    if (!spaces[id]) {
        spaces[id] = currentPlayer;
        e.target.innerText = currentPlayer;

        if (playerHasWon()) {
            playerText.innerHTML = `${currentPlayer} has won!`;
            let winning_blocks = playerHasWon();

            winning_blocks.map(box => boxes[box].style.backgroundColor = winnerIndicator);
            stopTimer(); // Stop the timer since the game is over
            return;
        }
        
        if (isBoardFull()) {
            playerText.innerHTML = 'Game Over! It\'s a tie.';
            circle1.classList.add('stop-animation');
            stopTimer();
            return;
        }

        currentPlayer = currentPlayer == X_TEXT ? O_TEXT : X_TEXT;
        startTimer(); // Start the timer for the next player
    }
}

const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function playerHasWon() {
    for (const condition of winningCombos) {
        let [a, b, c] = condition;

        if (spaces[a] && (spaces[a] == spaces[b] && spaces[a] == spaces[c])) {
            circle1.classList.add('stop-animation');

            return [a, b, c];
        }
    }
    return false;
}

function isBoardFull() {
    return spaces.every(space => space !== null);
}

restartBtn.addEventListener('click', restart);

function restart() {
    spaces.fill(null);

    boxes.forEach(box => {
        box.innerText = '';
        box.style.backgroundColor = '';
    });

    playerText.innerHTML = 'Tic Tac Toe';
    
    isTimerRunning = false; // Stop the timer
    clearInterval(timer); // Clear the timer
    startBtn.style.display = ''; // Show the start button
    restartBtn.style.display = 'none'; // Hide the restart button
    circle1.classList.remove('stop-animation');
    circle1.style.display = "none";
}

startBtn.addEventListener('click', start);

function start() {
    startTimer(); // Start the timer for the first player
    isTimerRunning = true; // Set the timer flag to true
    startBtn.style.display = 'none'; // Hide the start button
    restartBtn.style.display = ''; // Show the restart button
    circle1.classList.add('expand-animation');
    circle1.style.display = "block";
}

function startTimer() {
    stopTimer(); // Stop any existing timer
    let secondsLeft = 6; // Change the initial time to 6 seconds
    timer = setInterval(() => {
        secondsLeft--;
        if (secondsLeft === 0) {
            clearInterval(timer);
            playerText.innerHTML = 'Time is up!'; // Display a message when the timer reaches 0
            isTimerRunning = false; // Stop the timer
            circle1.classList.add('stop-animation');
        } else {
            playerText.innerHTML = `Time left: ${secondsLeft} seconds`; // Display the remaining time
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer); // Clear the timer
}

startGame();

restartBtn.style.display = 'none'; // Hide the restart button initially
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameover = false;

function initGame() {
    const boardContainer = document.getElementById('game-board');
    boardContainer.innerHTML = ''; // Clear the board
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('button');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', () => handlePlayerMove(i));
        boardContainer.appendChild(cell);
    }
    updateStatusMessage('Your turn (X)');
}

function handlePlayerMove(cellIndex) {
    if (!gameover && board[cellIndex] === '') {
        board[cellIndex] = currentPlayer;
        renderBoard();
        checkForWin();
        if (!gameover) {
            currentPlayer = 'O'; // Computer's turn
            handleComputerMove();
        }
    }
}

function handleComputerMove() {
    let emptyCells = [];
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            emptyCells.push(i);
        }
    }
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const computerMove = emptyCells[randomIndex];
    board[computerMove] = currentPlayer;
    renderBoard();
    checkForWin();
    currentPlayer = 'X'; // Switch back to player's turn
    updateStatusMessage('Your turn (X)');
}

function checkForWin() {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameover = true;
            if (board[a] === 'X') {
                updateStatusMessage('You win!');
            } else {
                updateStatusMessage('Computer wins!');
            }
            highlightWinningCells(combo);
            return;
        }
    }
    if (!board.includes('')) {
        gameover = true;
        updateStatusMessage('It\'s a draw!');
    }
}

function updateStatusMessage(message) {
    document.getElementById('status-message').textContent = message;
}

function renderBoard() {
    const cells = document.querySelectorAll('#game-board button');
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
    });
}

function highlightWinningCells(cells) {
    cells.forEach(cellIndex => {
        const cell = document.querySelector(`#game-board button[data-index="${cellIndex}"]`);
        cell.classList.add('highlight');
    });
}


function resetGame() {
    currentPlayer = 'X';
    board = ['', '', '', '', '', '', '', '', ''];
    gameover = false;
    document.querySelectorAll('#game-board button').forEach(cell => {
        cell.style.background = 'none';
    });
    initGame();
}

initGame();

const cells = document.querySelectorAll('.cell');
let currentPlayer = 'X';

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

function handleCellClick(e) {
    const cell = e.target;
    if (cell.textContent === '') {
        cell.textContent = currentPlayer;
        checkForWin();
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function checkForWin() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    winningCombinations.forEach(combination => {
        const [a, b, c] = combination;
        if (document.querySelectorAll(`#cell-${a}`).textContent === 
document.querySelectorAll(`#cell-${b}`).textContent &&
            document.querySelectorAll(`#cell-${b}`).textContent === 
document.querySelectorAll(`#cell-${c}`).textContent &&
            document.querySelectorAll(`#cell-${a}`).textContent !== '') {
            alert(`${document.querySelectorAll(`#cell-${a}`).textContent} wins!`);
            resetGame();
        }
    });
}

function resetGame() {
    cells.forEach(cell => cell.textContent = '');
}

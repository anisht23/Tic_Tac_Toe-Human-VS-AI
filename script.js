const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const resetButton = document.getElementById('reset');

let board = Array(9).fill('');
let isGameActive = true;
let human = 'X';
let ai = 'O';

function handleClick(e) {
  const index = e.target.dataset.index;
  if (board[index] || !isGameActive) return;

  makeMove(index, human);
  if (checkWinner(board, human)) {
    endGame(You win!);
    return;
  }

  if (!board.includes('')) {
    endGame(It's a draw!);
    return;
  }

  let bestMove = getBestMove();
  makeMove(bestMove, ai);
  if (checkWinner(board, ai)) {
    endGame(AI wins!);
    return;
  }

  if (!board.includes('')) {
    endGame(It's a draw!);
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player);
}

function checkWinner(b, player) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winPatterns.some(pattern =>
    pattern.every(i => b[i] === player)
  );
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = ai;
      let score = minimax(board, 0, false);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(b, depth, isMax) {
  if (checkWinner(b, ai)) return 10 - depth;
  if (checkWinner(b, human)) return depth - 10;
  if (!b.includes('')) return 0;

  if (isMax) {
    let maxEval = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = ai;
        let eval = minimax(b, depth + 1, false);
        b[i] = '';
        maxEval = Math.max(maxEval, eval);
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = human;
        let eval = minimax(b, depth + 1, true);
        b[i] = '';
        minEval = Math.min(minEval, eval);
      }
    }
    return minEval;
  }
}

function endGame(message) {
  isGameActive = false;
  status.textContent = message;
}

function resetGame() {
  board = Array(9).fill('');
  isGameActive = true;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('X', 'O');
  });
  status.textContent = "Your turn!";
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);

status.textContent = "Your turn!";

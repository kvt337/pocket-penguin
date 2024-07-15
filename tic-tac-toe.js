//global variables
let player = true;
const spaces = document.querySelectorAll('.box');
const spaceGrid = new Map();
const listeners = new Map();
let gameMode = '';
let ticTacToeFinished = false;

const playerMark = document.createElement('div');
playerMark.style.width = "55px";
playerMark.style.height = "55px";
playerMark.style.backgroundImage = "url('assets/tic-tac-toe/x.png')";

const penguinMark = document.createElement('div');
penguinMark.style.width = "55px";
penguinMark.style.height = "55px";
penguinMark.style.backgroundImage = "url('assets/tic-tac-toe/penguin-head.png')";

function ticTacTextBox(text) {
    // clear any existing timeout
    clearTimeout(timeoutID);
  
    // set the text content to the provided text
    textID.textContent = text;

  }

function clearBoard() {
    spaces.forEach(space => {
        space.innerHTML = '';
        spaceGrid.set(space, null);
    });
}

function endGame(winner) {
    ticTacToeFinished = true;
    ticTacTextBox(winner + " wins!");
    console.log(winner + " wins");
    spaces.forEach(space => space.removeEventListener('click', listeners.get(space)));
}

function isFull() {
    for (let value of spaceGrid.values()) {
        if (value === null) {
            return false;
        }
    }
    ticTacToeFinished = true;
    return true;
}

function checkWin(index) {
    const player = spaceGrid.get(spaces[index]);
    const row = Math.floor(index / 3);
    const col = index % 3;

    //check rows
    if (
        spaceGrid.get(spaces[row * 3]) === player &&
        spaceGrid.get(spaces[row * 3 + 1]) === player &&
        spaceGrid.get(spaces[row * 3 + 2]) === player
    ) {
        return true;
    }

    // Check columns
    if (
        spaceGrid.get(spaces[col]) === player &&
        spaceGrid.get(spaces[col + 3]) === player &&
        spaceGrid.get(spaces[col + 6]) === player
    ) {
        return true;
    }

    //check diagonals
    if (
        (spaceGrid.get(spaces[0]) === player && spaceGrid.get(spaces[4]) === player && spaceGrid.get(spaces[8]) === player) ||
        (spaceGrid.get(spaces[2]) === player && spaceGrid.get(spaces[4]) === player && spaceGrid.get(spaces[6]) === player)
    ) {
        return true;
    }

    return false;
}

//function to mark a space
function markSpace(mark, space) {
    if (space) {
        if (mark === 'X') {
            space.appendChild(playerMark.cloneNode(true));
            spaceGrid.set(space, mark);
        } else if (mark === 'O') {
            space.appendChild(penguinMark.cloneNode(true));
            spaceGrid.set(space, mark);
        }
    }
}

//minimax and game logic for hard mode
function checkWinTestGrid(testGrid, player) {
    //check rows
    if ((testGrid[0] == player && testGrid[1] == player && testGrid[2] == player) ||
        (testGrid[3] == player && testGrid[4] == player && testGrid[5] == player) ||
        (testGrid[6] == player && testGrid[7] == player && testGrid[8] == player)) {
        return true;
    }
    //check columns
    else if ((testGrid[0] == player && testGrid[3] == player && testGrid[6] == player) ||
        (testGrid[1] == player && testGrid[4] == player && testGrid[7] == player) ||
        (testGrid[2] == player && testGrid[5] == player && testGrid[8] == player)) {
        return true;
    }
    //check diagonals
    else if ((testGrid[0] == player && testGrid[4] == player && testGrid[8] == player) ||
        (testGrid[2] == player && testGrid[4] == player && testGrid[6] == player)) {
        return true;
    }
    return false;
}

function evaluate(testGrid) {
    if (checkWinTestGrid(testGrid, "O")) {
        return 1;
    } else if (checkWinTestGrid(testGrid, "X")) {
        return -1;
    } else {
        return 0;
    }
}

function isTestGridFull(testGrid) {
    for (let i = 0; i < testGrid.length; i++) {
        if (testGrid[i] === null) {
            return false;
        }
    }
    return true;
}

function minimax(testGrid, depth, isMax) {
    let score = evaluate(testGrid);

    //max win
    if (score === 1) {
        return score;
    }

    //min win 
    if (score === -1) {
        return score;
    }

    //tie
    if (isTestGridFull(testGrid) && score === 0) {
        return score;
    }

    //maximizer move
    if (isMax) {
        let best = -Infinity;

        //look for free space 
        for (let i = 0; i < testGrid.length; i++) {
            if (testGrid[i] === null) {
                testGrid[i] = "O";
                let score = minimax(testGrid, depth + 1, !isMax);
                testGrid[i] = null;
                best = Math.max(best, score);
            }
        }
        return best;
    }
    //minimizer move
    else {
        let best = Infinity;

        //look for free space
        for (let i = 0; i < testGrid.length; i++) {
            if (testGrid[i] === null) {
                testGrid[i] = "X";
                let score = minimax(testGrid, depth + 1, !isMax);
                testGrid[i] = null;
                best = Math.min(best, score);
            }
        }
        return best;
    }
}

function hardMode() {
    console.log('hard mode');
    let testGrid = Array.from(spaceGrid.values());
    let bestScore = -Infinity;
    let score = 0;
    let oSpace = null;

    //check minimax for each empty space
    for (let i = 0; i < testGrid.length; i++) {
        if (testGrid[i] === null) {
            testGrid[i] = "O"; // Make the move
            score = minimax(testGrid, 0, false);
            testGrid[i] = null;
            if (score > bestScore) {
                bestScore = score;
                oSpace = spaces[i];
            }
        }
    }
    markSpace('O', oSpace);
    const index = Array.from(spaces).indexOf(oSpace);
    if (checkWin(index)) {
        endGame('pocket penguin');
    } else if (isFull()) {
        console.log("tie");
        ticTacTextBox('tie');
    } else {
        player = true;
        console.log("your turn!");
        ticTacTextBox('your turn!');
    }
}

function easyMode() {
    console.log('easy mode');
    const spaceIndex = (Math.floor(Math.random() * (8 - 0 + 1)) + 0); //chooses random space
    if (spaceGrid.get(spaces[spaceIndex]) === null) {
        const oSpace = spaces[spaceIndex];
        markSpace('O', oSpace);
        if (checkWin(spaceIndex)) {
            endGame('pocket penguin');
        } else if (isFull()) {
            console.log("tie");
            ticTacTextBox('tie');
        } else {
            player = true;
            console.log("your turn!");
            ticTacTextBox('your turn!');
        }
    } else {
        easyMode();
    }
}

function startGame() {
    //reset game
    clearBoard();
    player = true;
    listeners.clear();
    ticTacToeFinished = false;
    ticTacTextBox('your turn!');
    // Setup new game
    spaces.forEach((space, index) => {
        const clickListener = () => {
            if (spaceGrid.get(space) !== null) {
                return; //space is already marked
            }
            if (player) {
                markSpace('X', space);
                if (checkWin(index)) {
                    endGame('player');
                } else if (isFull()) {
                    console.log("tie");
                    ticTacTextBox('tie');
                } else {
                    player = false;
                    ticTacTextBox('');
                    if (gameMode === "easy") {
                        setTimeout(easyMode, 500);
                    } else {
                        setTimeout(hardMode, 500);
                    }
                }
            }
        };

        space.addEventListener('click', clickListener);
        listeners.set(space, clickListener); //store listeners
    });
}

//start function, select difficulty
function ticTacToe(callback) {
    console.log("tic tac toe function");
    clearBoard();

    const menu = document.querySelector('#tic-tac-toe-menu');
    const backTicTac = document.querySelector('#back-button-2');
    const disableButtons = document.querySelector('#disable-buttons');
    backTicTac.style.display = 'block';
    menu.style.display = 'flex';
    disableButtons.style.display = 'block';

    backTicTac.addEventListener('click', () => {
        backTicTac.style.display = 'none';
        menu.style.display = 'none';
        disableButtons.style.display = 'none';
        callback();
    });

    const difficultyMenu = document.querySelector('#difficulty');
    difficultyMenu.style.display = 'flex';
    ticTacTextBox('select difficulty');

    const easyBtn = document.querySelector('#easy-btn');
    const hardBtn = document.querySelector('#hard-btn');

    easyBtn.addEventListener('click', () => {
        difficultyMenu.style.display = 'none';
        gameMode = 'easy';
        startGame();
    });

    hardBtn.addEventListener('click', () => {
        difficultyMenu.style.display = 'none';
        gameMode = 'hard';
        startGame();
    });
}

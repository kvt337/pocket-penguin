    //include duplicate speech box
function textBoxTicTac(text) {
    let textIDTicTac = document.querySelector('#text');
    let timeoutTicTac;  // variable to store the timeout ID
    // clear any existing timeout
    clearTimeout(timeoutTicTac);

    // set the text content to the provided text
    textIDTicTac.textContent = text;

    // clear text content after 5 seconds
    timeoutTicTac = setTimeout(() => {
        textIDTicTac.textContent = '';
    }, 5000);
}

function ticTacToe(){
    console.log("tic tac toe function");

    //blank tic tac toe menu with grid
    const menu = document.querySelector('#tic-tac-toe-menu');
    const backTicTac = document.querySelector('#back-button-2');
    const disableButtons = document.querySelector('#disable-buttons');
    backTicTac.style.display = 'block';
    menu.style.display = 'block';
    disableButtons.style.display = 'block';

    backTicTac.addEventListener('click', ()=> {
        //enableButtons();
        backTicTac.style.display = 'none';
        menu.style.display = 'none';
        disableButtons.style.display = 'none';
        });

    //temporarily disable event listeners outside of tic tac toe menu in main
    

    //easy/hard buttons, choose between easy mode or hard mode

    //hide easy/hard buttons

    //speech box will display whose turn it is

    //tic tac toe functions

    //win animations

    //back button (user can leave any time throughout the game, if they leave before the game finishes, no hearts will be awarded)
        //return a boolean on whether the game has been completed or not
        //close tic tac toe menu, reapply event listeners in main
}
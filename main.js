//penguin animations

// Get the element
const penguin = document.getElementById('penguin');
let animationPaused = false;

// Function to handle animation end event

function centertoRight() {
    console.log("going right");
    // Change the background image
    penguin.style.backgroundImage = "url('assets/penguin/penguin_right.png')";

    // Apply the next animation
    penguin.style.animation = 'center-to-right 5s linear forwards';

    // Remove previous event listener and add the new one
    penguin.removeEventListener('animationend', centertoRight);
    penguin.addEventListener('animationend', righttoCenter);
}

function righttoCenter() {
    console.log("going back to center");
    // Change the background image
    penguin.style.backgroundImage = "url('assets/penguin/penguin_left.png')";

    // Apply the next animation
    penguin.style.animation = 'right-to-center 5s linear forwards';

    // Remove previous event listener and add the new one
    penguin.removeEventListener('animationend', righttoCenter);
    penguin.addEventListener('animationend', standtoLeft);
}

// Preparing to go left
function standtoLeft() {
    console.log("preparing to go left");
    penguin.style.backgroundImage = "url('assets/penguin/penguin_front.png')";
    penguin.style.animation = 'center 3s linear forwards';

    // Remove previous event listener and add the new one
    penguin.removeEventListener('animationend', standtoLeft);
    penguin.addEventListener('animationend', centertoLeft);
}

function centertoLeft() {
    console.log("going left");
    // Change the background image
    penguin.style.backgroundImage = "url('assets/penguin/penguin_left.png')";

    // Apply the next animation
    penguin.style.animation = 'center-to-left 5s linear forwards';

    // Remove previous event listener and add the new one
    penguin.removeEventListener('animationend', centertoLeft);
    penguin.addEventListener('animationend', lefttoCenter);
}

function lefttoCenter() {
    console.log("going back to center");
    // Change the background image
    penguin.style.backgroundImage = "url('assets/penguin/penguin_right.png')";

    // Apply the next animation
    penguin.style.animation = 'left-to-center 5s linear forwards';

    // Remove previous event listener and add the new one
    penguin.removeEventListener('animationend', lefttoCenter);
    penguin.addEventListener('animationend', standtoRight);
}

// Preparing to go right
function standtoRight() {
    console.log("preparing to go right");
    penguin.style.backgroundImage = "url('assets/penguin/penguin_front.png')";
    penguin.style.animation = 'center 3s linear forwards';

    // Remove previous event listener and add the new one
    penguin.removeEventListener('animationend', standtoRight);
    penguin.addEventListener('animationend', centertoRight);
}

// Function to pause animation
function pauseAnimation() {
    if (!animationPaused) {
        penguin.style.animationPlayState = 'paused';
        animationPaused = true;
        // Resume animation after 3 seconds
        setTimeout(() => {
            penguin.style.animationPlayState = 'running';
            animationPaused = false;
        }, 3000); // Adjust pause duration as needed (in milliseconds)
    }
}

// Initialize the loop by starting the first animation
penguin.addEventListener('animationend', centertoRight);
penguin.style.animation = 'center 3s linear forwards';

// Listen for click event to pause animation
penguin.addEventListener('click', pauseAnimation);



//


// Get all the buttons and divs
const buttons = document.querySelectorAll('.toggle-button');
const divs = document.querySelectorAll('.toggle-div');
const back = document.querySelector('#back-button');
//use same approach for back buttons


// Add click event listeners to the buttons
buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    // Hide all divs
    divs.forEach((div) => {
      div.style.display = 'none';
    });

    // Show the respective div based on the button index
    divs[index].style.display = 'block';
    back.style.display = 'block';
  });
});

back.addEventListener('click', ()=> {
back.style.display = 'none';
divs.forEach((div) => {
    div.style.display = 'none';
  });
});


let snow = 0;
let mood = 3;


class Item{
  price;
  button;

  constructor(price){
    this.price = price;
  }

  setPrice(price){
    this.price = price;
  }

  getPrice(){
    return this.price;
  }
}

const foodItem1 = new Item(1);
foodItem1.button = document.querySelector('#food-item-one');
const foodItems = document.querySelectorAll('.food-items');

function checkSnow(cost){


  if (snow-cost<0){
    return false;
  }
  else{
    return true;
  }
}

/*const store_btn = document.querySelector('#store-btn');

const store_menu = document.querySelector('.store-menu');

const food_btn = document.querySelector('#food-btn');

const food_menu = document.querySelector('.food-menu');

const toys_btn = document.querySelector('#toys-btn');

const toys_menu = document.querySelector('.toys-menu');

const eat_btn = document.querySelector('#eat-btn');

const play_btn = document.querySelector('#play-btn');

const dance_btn = document.querySelector('#dance-btn');

const menu = document.querySelector('class');

store_btn.addEventListener('click', ()=>{
    if (store_menu.style.display === 'none'){
        store_menu.style.display = 'block';
    }
    else{
        store_menu.style.display = 'none';
    }
});

food_btn.addEventListener('click', ()=>{
    if (food_menu.style.display === 'none'){
        food_menu.style.display = 'block';
    }
    else{
        food_menu.style.display = 'none';
    }
});*/
//panel functions
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
/////////////////////////////////////////////////////////

//variables
/////////////////////////////////////////////////////////
let snow = 10;
let snowElement = document.querySelector('#snow-label');
const mood = [];

const storeItems = [];

const foodElement = document.querySelector('#eat-menu');
const toyElement = document.querySelector('#play-menu');
/////////////////////////////////////////////////////////

//talk box
/////////////////////////////////////////////////////////

let textID = document.querySelector('#text');
let timeoutID;  // variable to store the timeout ID

function textBox(text) {
  // clear any existing timeout
  clearTimeout(timeoutID);

  // set the text content to the provided text
  textID.textContent = text;

  //clear text content after 5 seconds
  timeoutID = setTimeout(() => {
    textID.textContent = '';
  }, 5000);
}

/////////////////////////////////////////////////////////

//mood functions
/////////////////////////////////////////////////////////
class Heart {
  button;
  isFull;

  constructor(button, isFull) {
    this.button = button;
    this.isFull = isFull;
    if (this.isFull) {
      this.setFull();
    } else {
      this.setEmpty();
    }
  }

  setEmpty() {
    this.button.style.backgroundImage = "url('assets/heart_empty.png')";
    this.isFull = false;
  }

  setFull() {
    this.button.style.backgroundImage = "url('assets/heart.png')";
    this.isFull = true;
  }
}

const heart1 = new Heart(document.querySelector('#heart-one'), true);
const heart2 = new Heart(document.querySelector('#heart-two'), true);
const heart3 = new Heart(document.querySelector('#heart-three'), false);

mood.push(heart1, heart2, heart3);

function moodDecreaser(mood) {
  for (let i = mood.length - 1; i >= 0; i--) {
    if (mood[i].isFull) {
      mood[i].setEmpty();
      break;
    }
  }
}

let moodDecreaserInterval;

function startMoodDecreaser() {
  // Clear the existing interval if it exists
  if (moodDecreaserInterval) {
    clearInterval(moodDecreaserInterval);
  }

  // Start a new interval
  moodDecreaserInterval = setInterval(() => moodDecreaser(mood), 10000);
}

function moodIncreaser(mood, points) {
  for (let i = 0; i < mood.length && points > 0; i++) {
    if (!mood[i].isFull) {
      mood[i].setFull();
      points--;

      // Reset the mood decreaser timer
      startMoodDecreaser();
    }
  }
}

// Initialize the mood decreaser interval when the script runs
startMoodDecreaser();

/////////////////////////////////////////////////////////


//inventory
/////////////////////////////////////////////////////////
function addToInventory(item) {
  item.addQuantity();
  console.log("quantity after adding: " + item.getQuantity()); // Added logging

  let inventoryItem;
  let quantityElement;

  // Find the existing cloned item in the inventory using data attribute
  const selector = `[data-id="${item.button.id}"]`;
  inventoryItem = foodElement.querySelector(selector) || toyElement.querySelector(selector);

  if (!inventoryItem) {
    // Clone the button element if it does not exist in the inventory
    inventoryItem = item.button.cloneNode(true);
    inventoryItem.setAttribute('data-id', item.button.id); // Assign a data attribute
    inventoryItem.classList.add('store-items');

    // Create a span element to hold the quantity
    quantityElement = document.createElement('p');
    quantityElement.innerHTML = item.getQuantity();
    inventoryItem.appendChild(quantityElement);

    if (item.getItemType() === "food") {
      foodElement.appendChild(inventoryItem);
    } else if (item.getItemType() === "toy") {
      toyElement.appendChild(inventoryItem);
    }

    // Add event listener to the cloned item when used on penguin
    inventoryItem.addEventListener('click', () => {
      //minigames
      if (item.name === "tic-tac-toe"){
        ticTacToe(() => {
          if (ticTacToeFinished) {
              moodIncreaser(mood, item.getMoodPoints());
              textBox('pocket penguin: good game! :D');
          }
          else{
            textBox('pocket penguin: boooooo');
          }
      });
      }
      else{
        textBox(item.getQuote());
        moodIncreaser(mood, item.getMoodPoints());
      }

      item.removeQuantity();

      if (item.itemType === 'food') {
        foodElement.style.display = 'none';
        back.style.display = 'none';
      } else if (item.itemType === 'toy') {
        toyElement.style.display = 'none';
        back.style.display = 'none';
      }

      console.log("quantity after using: " + item.getQuantity()); // Added logging

      // Update the quantity span in the cloned item
      const updatedQuantityElement = inventoryItem.querySelector('p');
      if (updatedQuantityElement) {
        updatedQuantityElement.innerHTML = item.getQuantity();
      } else {
        console.error("Quantity span not found in inventory item");
      }

      if (item.getQuantity() === 0) {
        inventoryItem.style.display = 'none';
      }
    });
  } else {
    // Update the quantity span
    quantityElement = inventoryItem.querySelector('p');
    if (quantityElement) {
      console.log("Updating existing quantity span: " + item.getQuantity()); // Added logging
      quantityElement.innerHTML = item.getQuantity();
    } else {
      console.error("Quantity span not found in existing inventory item");
    }
  }
}

function updateInventory() {
  storeItems.forEach(item => {
    const selector = `[data-id="${item.button.id}"]`;
    let inventoryItem = foodElement.querySelector(selector) || toyElement.querySelector(selector);

    if (inventoryItem) {
      const quantityElement = inventoryItem.querySelector('p');
      if (quantityElement) {
        quantityElement.innerHTML = item.getQuantity();
        if (item.getQuantity() === 0) {
          inventoryItem.style.display = 'none';
        } else {
          inventoryItem.style.display = 'inline-block';
          inventoryItem.style.marginRight = "4px";
        }
      }
    }
  });
}

// Add this to ensure the inventory is updated when switching views
buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    // Hide all divs
    divs.forEach((div) => {
      div.style.display = 'none';
    });

    // Show the respective div based on the button index
    divs[index].style.display = 'block';
    back.style.display = 'block';

    // Update the inventory view
    updateInventory();
  });
});

/////////////////////////////////////////////////////////

//item functions
/////////////////////////////////////////////////////////
class Item{
  name;
  price;
  button;
  itemType;
  moodPoints;
  quote;
  quantity;
  image;

  constructor(name, button, price, itemType, moodPoints, quote, image){
    this.name = name;
    this.price = price;
    this.button = button;
    this.itemType = itemType;
    this.moodPoints = moodPoints;
    this.quote = "pocket penguin: " + quote;
    this.quantity = 0;
    this.image = image;
    this.setImage(image);
  }

  setImage(image){
    this.button.style.backgroundImage = image;
    this.button.style.backgroundSize = "100% 100%";
  }

  setPrice(price){
    this.price = price;
  }

  addQuantity(){
    this.quantity = this.quantity+1;
  }

  removeQuantity(){
    this.quantity = this.quantity-1;
  }

  getName(){
    return this.name;
  }

  getPrice(){
    return this.price;
  }

  getItemType(){
    return this.itemType;
  }

  getMoodPoints(){
    return this.moodPoints;
  }

  getQuote(){
    return this.quote;
  }

  getQuantity(){
    return this.quantity;
  }

}

function checkSnow(cost){
  if (snow-cost<0){
    return false;
  }
  else{
    snow = snow-cost;
    snowElement.textContent = `snow: ${snow}`;
    return true;
  }
}

//create items
const storeItem1 = new Item("shrimp", document.querySelector('#store-item-one'), 2, "food", 1, "yum! shrimp!", "url('assets/store-items/shrimp.png')");
const storeItem2 = new Item("fish", document.querySelector('#store-item-two'),3, "food", 1, "yay! fish!", "url('assets/store-items/fish.png')");
const storeItem3 = new Item("squid", document.querySelector('#store-item-three'),4, "food", 2, "HELL YEAH!!! SQUID!!!", "url('assets/store-items/squid.png')");
const storeItem4 = new Item("sled", document.querySelector('#store-item-four'),10, "toy", 2, "weeeeee!!", "url('assets/store-items/sled.png')");
const storeItem5 = new Item("skates", document.querySelector('#store-item-five'),20, "toy", 2, "woohoo!!!", "url('assets/store-items/skates.png')");
const storeItem6 = new Item("tic-tac-toe", document.querySelector('#store-item-six'),30, "toy", 3, "you're gonna lose :)", "url('assets/store-items/tic-tac-toe.png')");

storeItems.push(storeItem1, storeItem2, storeItem3, storeItem4, storeItem5, storeItem6);

//add event listener to item so that when clicked, can exchange snow or alert user that there is not enough snow
//TODO: conditional for whether an item clicked in in the store (needs to be bought) or in the inventory (needs to be used)
storeItems.forEach(item => {
  item.button.addEventListener('click', (parentDiv) => {

    if (checkSnow(item.getPrice())) {
      console.log("sufficient snow");
      textBox("you bought " + item.getName());
      addToInventory(item);
    } else {
      console.log("not enough snow");
      textBox("not enough snow");
    }

  });
});
/////////////////////////////////////////////////////////

//penguin interactions
/////////////////////////////////////////////////////////
zeroHeart = ["i'm depressed", "i'm at zero hearts"];
oneHeart = ["i'm sad", "i'm at one heart"];
twoHeart = ["i'm neutral", "i'm at two hearts"];
threeHeart = ["i'm happy!", "i'm at three hearts"];

function getQuote(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

function penguinInteract(mood){
  if(!(mood[0].isFull)){ //no hearts
    textBox("pocket penguin: " + getQuote(zeroHeart));
    snow+=1;
  }
  else if(!(mood[1].isFull)){ //one heart
    textBox("pocket penguin: " + getQuote(oneHeart));
    snow+=2;
  }
  else if(!(mood[2].isFull)){ //two hearts
    textBox("pocket penguin: " + getQuote(twoHeart));
    snow+=3;
  }
  else if (mood[2].isFull){ //three hearts
    textBox("pocket penguin: " + getQuote(threeHeart));
    snow+=4;
  }
  snowElement.textContent = `snow: ${snow}`;
}

/////////////////////////////////////////////////////////

//penguin animations
/////////////////////////////////////////////////////////
// Get the element
const penguin = document.getElementById('penguin');
let animationPaused = false;
let originalAnimation = '';

// Function to handle animation end event
function centertoRight() {
    //console.log("going right");
    // Change the background image
    penguin.style.backgroundImage = "url('assets/penguin/penguin_right.gif')";

    // Apply the next animation
    penguin.style.animation = 'center-to-right 3s linear forwards';

    // Remove previous event listener and add the new one
    penguin.removeEventListener('animationend', centertoRight);
    penguin.addEventListener('animationend', righttoCenter);
}

function righttoCenter() {
    //console.log("going back to center");
    // Change the background image
    penguin.style.backgroundImage = "url('assets/penguin/penguin_left.gif')";

    // Apply the next animation
    penguin.style.animation = 'right-to-center 3s linear forwards';

    // Remove previous event listener and add the new one
    penguin.removeEventListener('animationend', righttoCenter);
    penguin.addEventListener('animationend', standtoLeft);
}

// Preparing to go left
function standtoLeft() {
    //console.log("preparing to go left");
    penguin.style.backgroundImage = "url('assets/penguin/penguin_front.png')";
    penguin.style.animation = 'center 2s linear forwards';

    // Remove previous event listener and add the new one
    penguin.removeEventListener('animationend', standtoLeft);
    penguin.addEventListener('animationend', centertoLeft);
}

function centertoLeft() {
    //console.log("going left");
    // Change the background image
    penguin.style.backgroundImage = "url('assets/penguin/penguin_left.gif')";

    // Apply the next animation
    penguin.style.animation = 'center-to-left 3s linear forwards';

    // Remove previous event listener and add the new one
    penguin.removeEventListener('animationend', centertoLeft);
    penguin.addEventListener('animationend', lefttoCenter);
}

function lefttoCenter() {
    //console.log("going back to center");
    // Change the background image
    penguin.style.backgroundImage = "url('assets/penguin/penguin_right.gif')";

    // Apply the next animation
    penguin.style.animation = 'left-to-center 3s linear forwards';

    // Remove previous event listener and add the new one
    penguin.removeEventListener('animationend', lefttoCenter);
    penguin.addEventListener('animationend', standtoRight);
}

// Preparing to go right
function standtoRight() {
    //console.log("preparing to go right");
    penguin.style.backgroundImage = "url('assets/penguin/penguin_front.png')";
    penguin.style.animation = 'center 2s linear forwards';

    // Remove previous event listener and add the new one
    penguin.removeEventListener('animationend', standtoRight);
    penguin.addEventListener('animationend', centertoRight);
}

// Function to pause animation
function pauseAnimation() {
    if (!animationPaused) {
        originalAnimation = penguin.style.backgroundImage;
        penguin.style.animationPlayState = 'paused';
        animationPaused = true;
        penguin.style.backgroundImage = "url('assets/penguin/penguin_front.png')";
        // Resume animation after 3 seconds
        setTimeout(() => {
            penguin.style.backgroundImage = originalAnimation;
            penguin.style.animationPlayState = 'running';
            animationPaused = false;
        }, 3000); // Adjust pause duration as needed (in milliseconds)
    }
}

// Initialize the loop by starting the first animation
penguin.addEventListener('animationend', centertoRight);
penguin.style.animation = 'center 2s linear forwards';

// Listen for click event to pause animation
penguin.addEventListener('click', () => {
  pauseAnimation();
  penguinInteract(mood);
});
///////////////////////////////////////////////////////////////////////
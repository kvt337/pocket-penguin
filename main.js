//penguin animations

// Get the element
const penguin = document.getElementById('penguin');
let animationPaused = false;

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
penguin.style.animation = 'center 2s linear forwards';

// Listen for click event to pause animation
penguin.addEventListener('click', pauseAnimation);
///////////////////////////////////////////////////////////////////////

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

/////////////////////////////////////////////////////////

//mood functions
/////////////////////////////////////////////////////////
class Heart{
  button;
  isFull;

  constructor(button, isFull){
    this.button = button;
    this.isFull = isFull;
    if (this.isFull){
      this.setFull();
    }
    else{
      this.setEmpty();
    }
  }

  setEmpty(){
    this.button.style.backgroundImage = "url('assets/heart_empty.png')";
    this.isFull = false;
  }

  setFull(){
    this.button.style.backgroundImage = "url('assets/heart.png')";
    this.isFull = true;
  }
}

const heart1 = new Heart(document.querySelector('#heart-one'), true);
const heart2 = new Heart(document.querySelector('#heart-two'), true);
const heart3 = new Heart(document.querySelector('#heart-three'), false);

mood.push(heart1, heart2, heart3);

function moodDecreaser(mood){
  for( let i = mood.length-1; i>=0; i-- ){
    if(mood[i].isFull){
      mood[i].setEmpty();
      break;
    }
  }
}

//decrease mood every 10 seconds
setInterval(() => moodDecreaser(mood), 10000);

/////////////////////////////////////////////////////////

//inventory
/////////////////////////////////////////////////////////

function addToInventory(item) {
  item.addQuantity();
  //console.log("quantity: " + item.getQuantity());
  let inventoryItem;

  // Check if the item already exists in the inventory
  if (item.getQuantity() <= 1) {
    // Clone the button element if it does not exist in the inventory
    inventoryItem = item.button.cloneNode(true);
    inventoryItem.setAttribute('data-id', item.button.id); // Assign a data attribute

    // Create a span element to hold the quantity
    const quantitySpan = document.createElement('span');
    console.log("quantity in clone element: " + item.getQuantity());
    quantitySpan.textContent = ` Quantity: ${item.getQuantity()}`;
    inventoryItem.appendChild(quantitySpan);

    if (item.getItemType() == "food") {
      foodElement.appendChild(inventoryItem);
    } else if (item.getItemType() == "toy") {
      toyElement.appendChild(inventoryItem);
    }

    // Add event listener to the cloned item when used on penguin
    inventoryItem.addEventListener('click', () => {
      item.removeQuantity();
      console.log("quantity: " + item.getQuantity());
      quantitySpan.textContent = ` Quantity: ${item.getQuantity()}`;
      if (item.getQuantity() === 0) {
        inventoryItem.style.display = 'none';
      } else {
        //change mood, display quote, add snow
      }
    });
  } 
  else {
    // Find the existing cloned item in the inventory using data attribute
    const selector = `[data-id="${item.button.id}"]`;
    inventoryItem = foodElement.querySelector(selector) || toyElement.querySelector(selector);
    if (inventoryItem) {
      // Update the quantity span
      const quantitySpan = inventoryItem.querySelector('span');
      quantitySpan.textContent = ` Quantity: ${item.getQuantity()}`;
    }
  }
}

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

  constructor(name, button, price, itemType, moodPoints, quote){
    this.name = name;
    this.price = price;
    this.button = button;
    this.itemType = itemType;
    this.moodPoints = moodPoints;
    this.quote = "pocket penguin: " + quote;
    this.quantity = 0;
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
const storeItem1 = new Item("one", document.querySelector('#store-item-one'), 1, "food", 1, "this is item 1");
const storeItem2 = new Item("two", document.querySelector('#store-item-two'),2, "food", 1, "this is item 2");
const storeItem3 = new Item("three", document.querySelector('#store-item-three'),3, "food", 1, "this is item 3");
const storeItem4 = new Item("four", document.querySelector('#store-item-four'),4, "toy", 1, "this is item 4");
const storeItem5 = new Item("five", document.querySelector('#store-item-five'),5, "toy", 1, "this is item 5");
const storeItem6 = new Item("six", document.querySelector('#store-item-six'),6, "toy", 1, "this is item 6");

storeItems.push(storeItem1, storeItem2, storeItem3, storeItem4, storeItem5, storeItem6);

//add event listener to item so that when clicked, can exchange snow or alert user that there is not enough snow
//TODO: conditional for whether an item clicked in in the store (needs to be bought) or in the inventory (needs to be used)
storeItems.forEach(item => {
  item.button.addEventListener('click', (parentDiv) => {

    if (checkSnow(item.getPrice())) {
      console.log("sufficient snow");
      addToInventory(item);
    } else {
      console.log("not enough snow");
    }

  });
});
/////////////////////////////////////////////////////////



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
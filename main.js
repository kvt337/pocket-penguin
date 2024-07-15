//panel functions
//get all buttons and toggles for menus
const buttons = document.querySelectorAll('.toggle-button');
const divs = document.querySelectorAll('.toggle-div');
const back = document.querySelector('#back-button');

//when the button is clicked, each menu is hidden
//the respective menu is shown instead, along with the back button
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

//hide all menus when back button is clicked
back.addEventListener('click', ()=> {
back.style.display = 'none';
divs.forEach((div) => {
    div.style.display = 'none';
  });
});
/////////////////////////////////////////////////////////

//variable initialization
/////////////////////////////////////////////////////////
let snow = 10;
let snowElement = document.querySelector('#snow-label');
const mood = [];

const storeItems = [];

const foodElement = document.querySelector('#eat-menu');
const toyElement = document.querySelector('#play-menu');
const decorElement = document.querySelector('#furnish-menu');
/////////////////////////////////////////////////////////

//talk box
/////////////////////////////////////////////////////////

let textID = document.querySelector('#text'); //dialogue and/or instruction to be displayed
let timeoutID;  //store the timeout

function textBox(text) {
  // clear any existing timeout
  clearTimeout(timeoutID);

  //set the text content to the provided text
  textID.textContent = text;

  //clear text content after 5 seconds
  timeoutID = setTimeout(() => {
    textID.textContent = '';
  }, 5000);
}

/////////////////////////////////////////////////////////

//mood functions
/////////////////////////////////////////////////////////

//heart object: fills or depletes a heart in the mood meter
class Heart {
  button;
  isFull;

  constructor(image, isFull) { //start state of heart
    this.image = image;
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
let time = 10000; //starting time: hearts deplete every 10 seconds

mood.push(heart1, heart2, heart3);

function moodDecreaser(mood) { //loop that decreases each heart object in the array
  for (let i = mood.length - 1; i >= 0; i--) {
    if (mood[i].isFull) {
      mood[i].setEmpty();
      break;
    }
  }
}

let moodDecreaserInterval;

function startMoodDecreaser() { //depletes hearts in mood array every (time) seconds
  //every time we reach a new heart or a heart is filled, clear the time interval
  if (moodDecreaserInterval) {
    clearInterval(moodDecreaserInterval);
  }

  //start a new interval which runs the moodDecreaser after (time) amount of seconds
  moodDecreaserInterval = setInterval(() => moodDecreaser(mood), time);
}

function moodIncreaser(mood, hearts) { //fills hearts in mood array after an item is received
  for (let i = 0; i < mood.length && hearts > 0; i++) {
    if (!mood[i].isFull) {
      mood[i].setFull();
      hearts--;

      //reset timer so that new hearts won't get depleted within the current interval
      startMoodDecreaser();
    }
  }
}

//reset the mood decreaser timer until another item is received
startMoodDecreaser();

/////////////////////////////////////////////////////////


//inventory
/////////////////////////////////////////////////////////

//when food or toys are bought, they are added to the eat and play inventory menus respectively
//the quanitity bought of said item from the store will be displayed underneath the button
//upon being clicked:
//  the menus will close
//  the mood will be updated
//the quantity will decrease
//  the custom quote will be displayed in the text box
function addToInventory(item) {
  item.addQuantity();

  //console.log("quantity after adding: " + item.getQuantity());

  let inventoryItem; //holds dom element of inventory item button
  let quantityElement;

  //find existing cloned item in inventory using data attribute, hold it in inventoryItem
  const selector = `[data-id="${item.button.id}"]`;
  //search both toy and food menus
  inventoryItem = foodElement.querySelector(selector) || toyElement.querySelector(selector);

  if (!inventoryItem) { //if there is 0 of item, aka none in the inventory
    //clone the item button 
    inventoryItem = item.button.cloneNode(true);
    inventoryItem.setAttribute('data-id', item.button.id);
    inventoryItem.classList.add('store-items');

    //hold quantity in newly created p element, css styling included
    quantityElement = document.createElement('p');
    quantityElement.innerHTML = 'qty: ' + item.getQuantity();
    inventoryItem.appendChild(quantityElement);
    quantityElement.style.marginTop = '69px';
    quantityElement.style.background = '#51AADD';
    quantityElement.style.borderStyle = 'solid';
    quantityElement.style.borderColor = '#FFDE7E';
    quantityElement.style.fontSize = '12px';

    //add cloned item button in either the food inventory menu or toys inventory menu
    if (item.getItemType() === "food") {
      foodElement.appendChild(inventoryItem);
    } else if (item.getItemType() === "toy") {
      toyElement.appendChild(inventoryItem);
    }

    //use item when it is clicked
    inventoryItem.addEventListener('click', () => {
      //minigames
      if (item.name === "tic-tac-toe"){
        //promise that guarantees the hearts will be awarded ONLY AFTER the game is completed
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
      else{ //for every item that isn't a minigame, hearts and quote are given automatically
        textBox(item.getQuote());
        moodIncreaser(mood, item.getMoodPoints());
      }

      item.removeQuantity(); //remove a quantity from inventory

       //once item is used, close the respective inventory menu
      if (item.itemType === 'food') {
        foodElement.style.display = 'none';
        back.style.display = 'none';
      } else if (item.itemType === 'toy') {
        toyElement.style.display = 'none';
        back.style.display = 'none';
      }

      //console.log("quantity after using: " + item.getQuantity());

      //update quantity in DOM
      const updatedQuantityElement = inventoryItem.querySelector('p');
      if (updatedQuantityElement) {
        updatedQuantityElement.innerHTML = 'qty: ' + item.getQuantity();
      } else {
        console.error("Quantity span not found in inventory item");
      }

      //remove item button from inventory if there are no more
      if (item.getQuantity() === 0) {
        inventoryItem.style.display = 'none';
      }
    });
  } 
  else { //if the item DOES exist in the inventory
    //update quantity
    quantityElement = inventoryItem.querySelector('p');
    if (quantityElement) {
      //console.log("Updating existing quantity span: " + item.getQuantity());
      quantityElement.innerHTML = item.getQuantity();
    } else {
      console.error("Quantity not found in existing inventory item");
    }
  }
}

//reselect each item in inventory to ensure correct quantity is update and shown in DOM
function updateInventory() {
  storeItems.forEach(item => {
    const selector = `[data-id="${item.button.id}"]`;
    let inventoryItem = foodElement.querySelector(selector) || toyElement.querySelector(selector);

    if (inventoryItem) {
      const quantityElement = inventoryItem.querySelector('p');
      if (quantityElement) {
        quantityElement.innerHTML = 'qty: ' + item.getQuantity();
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

//when decor (furniture, i use the two interchangably woops) bought, they are added to the furnish inventory menu
//the status of the item (whether it is placed in the igloo or stored in the inventory) will be displayed underneath
//the button
//unlike toy and food items, decor items can only be purchased once and cannot be used up in the inventory
//additionally, instead of affecting the mood, it affects the time in which the hearts deplete
//upon being clicked:
//  the menus will close
//  the time of heart depletion will be updated
//  the status of the item
//  the custom quote will be displayed in the text box
function addDecor(item){
  let inventoryItem;
  let decorState; //whether its placed in the igloo or in the inventory

  //find exisiting cloned item
  const selector = `[data-id="${item.button.id}"]`;
  inventoryItem = decorElement.querySelector(selector);

  //decor item does not exist, add to inventory
  if (!inventoryItem) {
    inventoryItem = item.button.cloneNode(true);
    inventoryItem.setAttribute('data-id', item.button.id);
    inventoryItem.classList.add('store-items');

    inventoryItem.style.marginRight='4px';

    //similar to quantity, create a new element that toggles the visibility/status of item
    decorState = document.createElement('p');
    decorState.innerHTML = 'place';
    inventoryItem.appendChild(decorState);
    decorState.style.marginTop = '69px';
    decorState.style.background = '#51AADD';
    decorState.style.borderStyle = 'solid';
    decorState.style.borderColor = '#FFDE7E';
    decorState.style.fontSize = '12px';

    decorElement.appendChild(inventoryItem);

    item.setStatus('in inventory');

    item.setStock('out');


    //toggle status of item when button is clicked
    inventoryItem.addEventListener('click', () => {

      //place item in igloo
      if (item.getStatus()==="in inventory"){
        item.setStatus("in room");
        decorState.innerHTML = "clear";
        textBox(item.getQuote());
        time += item.getMoodPoints(); //add time
        item.getDOMelement().style.display = 'block';
      }
      //return item back to inventory
      else{
        time -= item.getMoodPoints(); //remove time
        item.setStatus("in inventory");
        decorState.innerHTML = "place";
        item.getDOMelement().style.display = 'none';
      }
      decorElement.style.display = 'none';
      back.style.display = 'none';
    });
  } 
}

//reinstate buttons to ensure the inventory is updated when switching views
buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    divs.forEach((div) => {
      div.style.display = 'none';
    });

    divs[index].style.display = 'block';
    back.style.display = 'block';

    //update inventory view
    updateInventory();
  });
});

/////////////////////////////////////////////////////////

//item functions
/////////////////////////////////////////////////////////

//holding certain properties for food, toys, and decor
class Item{
  name;
  price; //amount of snow
  button; //dom of item id
  itemType; //food, toy, or decor
  moodPoints; //amount of hearts filled, for food/toy items only
  quote; //dialogue to be displayed in text box
  quantity; //current amount bought to be displayed in inventory, for food/toy items only
  status; //in igloo or in inventory, for furniture items only
  stock; //in stock or out of stock
  image; //dom of button image
  DOMelement; //for furniture items only

  constructor(name, button, price, itemType, moodPoints, quote, image, stock, DOMelement){
    this.name = name;
    this.price = price;
    this.button = button;
    this.itemType = itemType;
    this.moodPoints = moodPoints;
    this.quote = "pocket penguin: " + quote;
    this.quantity = 0;
    this.image = image;
    this.setImage(image);
    this.DOMelement = DOMelement;
    this.stock = stock;
  }

  setImage(image){
    this.button.style.backgroundImage = image;
    this.button.style.backgroundSize = "100% 100%";
  }

  setDOMelement(DOMelement){
    this.DOMelement = DOMelement;
  }

  setStock(stock){
    this.stock = stock;
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

  setStatus(status){
    this.status = status;
  }

  getDOMelement(){
    return this.DOMelement;
  }

  getStock(){
    return this.stock;
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

  getStatus(){
    return this.status;
  }

}

//see if there's enough snow
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
const storeItem1 = new Item("shrimp", document.querySelector('#store-item-one'), 2, "food", 1, "yum! shrimp!", "url('assets/store-items/shrimp.png')", "in");
const storeItem2 = new Item("fish", document.querySelector('#store-item-two'),3, "food", 1, "yay! fish!", "url('assets/store-items/fish.png')", "in");
const storeItem3 = new Item("squid", document.querySelector('#store-item-three'),4, "food", 2, "HECK YEAH!!! SQUID!!!", "url('assets/store-items/squid.png')", "in");
const storeItem4 = new Item("sled", document.querySelector('#store-item-four'),10, "toy", 2, "weeeeee!!", "url('assets/store-items/sled.png')", "in");
const storeItem5 = new Item("skates", document.querySelector('#store-item-five'),20, "toy", 2, "woohoo!!!", "url('assets/store-items/skates.png')");
const storeItem6 = new Item("tic-tac-toe", document.querySelector('#store-item-six'),30, "toy", 3, "you're gonna lose :)", "url('assets/store-items/tic-tac-toe.png')", "in");
const storeItem7 = new Item("couch", document.querySelector('#store-item-seven'),50, "decor", 5000, "coooool", "url('assets/store-items/couch.png')", "in", document.querySelector('#couch'));
const storeItem8 = new Item("lights", document.querySelector('#store-item-eight'),70, "decor", 10000, "pretty!!", "url('assets/store-items/lights.png')", "in", document.querySelector('#lights'));
const storeItem9 = new Item("tank", document.querySelector('#store-item-nine'),100, "decor", 20000, "noice", "url('assets/store-items/tank.png')", "in", document.querySelector('#tank'));

storeItems.push(storeItem1, storeItem2, storeItem3, storeItem4, storeItem5, storeItem6, storeItem7, storeItem8, storeItem9);

//add event listener to item so that when clicked, can exchange snow or alert user that there is not enough snow
storeItems.forEach(item => {
  item.button.addEventListener('click', (parentDiv) => {

    if(item.getStock()==="out"){
      console.log("out of stock");
      textBox("out of stock");
    }
    else if (checkSnow(item.getPrice())) {
      console.log("sufficient snow");
      textBox("you bought " + item.getName());
      if (item.getItemType()==="decor"){
        addDecor(item);
      }
      else{
        addToInventory(item);
      }
    } 
    else {
      console.log("not enough snow");
      textBox("not enough snow");
    }

  });
});
/////////////////////////////////////////////////////////

//penguin interactions
/////////////////////////////////////////////////////////

//when penguin is clicked, one of the following quotes will 
//be displayed depending on the penguin's mood
zeroHeart = ["ughhhhh", "i'm boreduhhhh"]; //depressed
oneHeart = ["hmm...", "hey..."]; //sad
twoHeart = ["hiiii", "what's up?"]; //neutral
threeHeart = ["best day ever!", "you're the best!! :D"]; //happy

//select random quote within an array
function getQuote(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

//retrieve quote when penguin is clicked, accessed by penguin event listener
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
//retrieve penguin element from dom
const penguin = document.getElementById('penguin');
let animationPaused = false;
let originalAnimation = '';

//sprite directions
function centertoRight() {
    //console.log("going right");
    // Change the background image
    penguin.style.backgroundImage = "url('assets/penguin/penguin_right.gif')";

    // Apply the next animation
    penguin.style.animation = 'center-to-right 3s linear forwards';

    //remove event listeners so that dom is updated correctly
    penguin.removeEventListener('animationend', centertoRight);
    //prepare next animation
    penguin.addEventListener('animationend', righttoCenter);
}

function righttoCenter() {
    penguin.style.backgroundImage = "url('assets/penguin/penguin_left.gif')";

    // Apply the next animation
    penguin.style.animation = 'right-to-center 3s linear forwards';

    penguin.removeEventListener('animationend', righttoCenter);
    penguin.addEventListener('animationend', standtoLeft);
}

//preparing to go left
function standtoLeft() {
    //console.log("preparing to go left");
    penguin.style.backgroundImage = "url('assets/penguin/penguin_front.png')";
    penguin.style.animation = 'center 2s linear forwards';

    penguin.removeEventListener('animationend', standtoLeft);
    penguin.addEventListener('animationend', centertoLeft);
}

function centertoLeft() {
    //console.log("going left");
    penguin.style.backgroundImage = "url('assets/penguin/penguin_left.gif')";

    penguin.style.animation = 'center-to-left 3s linear forwards';

    penguin.removeEventListener('animationend', centertoLeft);
    penguin.addEventListener('animationend', lefttoCenter);
}

function lefttoCenter() {
    //console.log("going back to center");
    penguin.style.backgroundImage = "url('assets/penguin/penguin_right.gif')";

    penguin.style.animation = 'left-to-center 3s linear forwards';

    penguin.removeEventListener('animationend', lefttoCenter);
    penguin.addEventListener('animationend', standtoRight);
}

//preparing to go right
function standtoRight() {
    //console.log("preparing to go right");
    penguin.style.backgroundImage = "url('assets/penguin/penguin_front.png')";
    penguin.style.animation = 'center 2s linear forwards';

    penguin.removeEventListener('animationend', standtoRight);
    penguin.addEventListener('animationend', centertoRight);
}

//pause animation, penguin stops wherever it currently is and faces user
function pauseAnimation() {
    if (!animationPaused) {
        originalAnimation = penguin.style.backgroundImage; //store current animation at the time
                                                          //of pausing so that it can be restored
                                                          //after pausing
        penguin.style.animationPlayState = 'paused';
        animationPaused = true;
        penguin.style.backgroundImage = "url('assets/penguin/penguin_front.png')"; //have penguin face the front
        //resume animation after 3 seconds
        setTimeout(() => {
            penguin.style.backgroundImage = originalAnimation; //revert back to original animation
            penguin.style.animationPlayState = 'running';
            animationPaused = false;
        }, 3000);
    }
}

//start animation, will loop as event listeners switch
penguin.addEventListener('animationend', centertoRight);
penguin.style.animation = 'center 2s linear forwards';

//pause when penguin is clicked
penguin.addEventListener('click', () => {
  pauseAnimation();
  penguinInteract(mood);
});
///////////////////////////////////////////////////////////////////////
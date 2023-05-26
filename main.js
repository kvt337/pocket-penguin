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
// Game Constants & Variables
let inputDir = {x: 0, y:0};
const foodSound = new Audio('/music/food.mp3');
const gameOverSound = new Audio('/music/gameover.mp3');
const moveSound = new Audio('/music/move.mp3');
const musicSound = new Audio('/music/music.mp3');
let speed = 5 ; 
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    {x:13, y:15}
]
let food = {x:6, y:7};
var hiscoreval = 0;

//variables for speed buttons
var upArr =  document.getElementById('uparrow');
var downArr =  document.getElementById('Dnarrow');
var dispspeed = document.getElementById('showspeed');
var level = document.getElementById('Difficulty');

//variables for onscreen buttons
let up = document.getElementById('b1');
let down = document.getElementById('b2');
let left = document.getElementById('b3');
let right = document.getElementById('b4');
let touch =  document.getElementById('OnScreenButtons')

// Game Functions
function main(ctime){
    window.requestAnimationFrame(main)              //first parameter current time 
    console.time(ctime)
    if((ctime - lastPaintTime)/1000 < 1/speed )    // last paint time when was the screen last full rendered
   {
    return;
   }
   lastPaintTime = ctime;
   gameEngine(); 
}   

function isCollide(snake){
    // if you bump into yourself
    for (let i = 1; i < snakeArr.length; i++) {
      if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
        return true;
      } 
    }

    // if you bump into the wall
    if(snake[0].x >= 18 || snake[0].x <=0 || snake[0].y >=18 || snake[0].y <=0){
        return true;
    }
        
}

function gameEngine(){
    // updating the snake array & food 

    if(isCollide(snakeArr)){
        gameOverSound.play();
        musicSound.pause();
        inputDir  = {x: 0, y: 0};
        alert("Game Over. Your Score is " +score+ ". Press any key to play again!");
        snakeArr = [{x:13, y:15}];
        musicSound.play();
        dispspeed.innerHTML = "Speed : " +speed ;
        score = 0;
        scorebox.innerHTML = "Score: " +score;
        // speed = 5 ;                                       //Everytime game over Users would not want to adjust difficulty back to at they lost 
        // level.innerHTML = "Difficulty : Easy"            // it will go back to normal if window reloads 
    }

    // if food is eaten increment the score and regenerate the food 

    if(snakeArr[0].y === food.y && snakeArr[0].x === food.x){
        foodSound.play();
        score += 1;
        if(score>hiscoreval){
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            highscorebox.innerHTML = "High Score: " + hiscoreval;
        }
        scorebox.innerHTML = "Score: " +score;
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y})
        let a = 2;
        let b = 16;
        food = {x: Math.round(a + (b-a)* Math.random()), y: Math.round(a + (b-a)* Math.random())}   // to generate random location of the food 
    }

    // Moving the snake 

    for (let i = snakeArr.length - 2; i>=0; i--) { 
        snakeArr[i+1] = {...snakeArr[i]};
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;
  
    // display the snake and food

    // display the snake 

    board.innerHTML = "";
    snakeArr.forEach((e, index)=>{
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart =  e.y;  // to place snake in the y row
        snakeElement.style.gridColumnStart =  e.x;  // to place snake in the x column

        if(index === 0){    
            snakeElement.classList.add('head');  // if index is zero then add head to the body
        }
        else{
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });
    // display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart =  food.y;  // to place food in the y row
    foodElement.style.gridColumnStart =  food.x;  // to place food in the x column
    foodElement.classList.add('food')
    board.appendChild(foodElement);

 
}

// Difficulty/  let the user update it USING ONSCREEN BUTTONS

upArr.addEventListener("click",()=>{
    speed += 5;
    dispspeed.innerHTML = "Speed : " +speed ;
    if(speed > 14)                                  // Added difficulty Indicator for the user 
    { 
        level.innerHTML = "Difficulty : Medium";
    }
    if( speed > 29)
    {
        level.innerHTML = "Difficulty : Hard";
        console.log("speed")
    }
  
    // console.log("new speed " +speed);
})

downArr.addEventListener("click",()=>{
    speed -= 5;
    if(speed<1){
        alert("Speed Can Not Be Negative!");
        speed = 5 
    }
    dispspeed.innerHTML = "Speed : " +speed ;

    // console.log("new speed " +speed);
})





// MAIN LOGIC

musicSound.play();
let hiscore = localStorage.getItem("hiscore");
if(hiscore === null){
    
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else{
    hiscoreval = JSON.parse(hiscore);
    highscorebox.innerHTML = "High Score: " + hiscore;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', e =>{
    inputDir = {x: 0, y: -1} // Start the game
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            console.log("ArrowUp");
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case "ArrowDown":
            console.log("ArrowDown");
            inputDir.x = 0;
            inputDir.y = 1;
            break;

        case "ArrowLeft":
            console.log("ArrowLeft");
            inputDir.x = -1;
            inputDir.y = 0;
            break;

        case "ArrowRight":
            console.log("ArrowRight");
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
   
});

// ON SCREEN BUTTONS

OnScreenButtons.addEventListener('mouseover', () =>{   //when mouse is over onscreen buttons are active and can be used
    up.addEventListener("click",()=>{
        console.log("ArrowUp");
        inputDir.x = 0;
        inputDir.y = -1;
    })
    down.addEventListener("click",()=>{
        console.log("ArrowDown");
        inputDir.x = 0;
        inputDir.y = 1;
    })
    left.addEventListener("click",()=>{
        console.log("ArrowLeft");
        inputDir.x = -1;
        inputDir.y = 0;
    })
    right.addEventListener("click",()=>{
        console.log("ArrowRight");
        inputDir.x = 1;
        inputDir.y = 0;
    })
    });

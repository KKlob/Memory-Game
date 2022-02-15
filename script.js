// Setup some containers for relevent Elements on the page
const gameContainer = document.getElementById("game");
const startButton = document.getElementById("startButton");
const displayedScore = document.querySelector("h2");
const displayedLowScore = document.querySelector("h3");

// initialize container for currentScore and update the displayed value
let currentScore = 0;
displayedScore.innerText = `Current Score: ${currentScore}`;

// initialize container for lowestScore
let lowestScore = 0;
// check if localStorage has a lowscore stored. If so, import it. 
if (localStorage.getItem("lowScore")){
  lowestScore = localStorage.getItem("lowScore");
  displayedLowScore.innerText = `Lowest Score: ${lowestScore}`;
}

// add the original event listener on the startbutton to runGame
startButton.addEventListener("click", runGame);

//List of available colors to assign to card <div>'s
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;
  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);
    // Decrease counter by 1
    counter--;
    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

let shuffledColors = shuffle(COLORS);
// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");
    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color, "card");
    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);
    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// Varrious containers to keep track of game mechanics
let numPairs = COLORS.length / 2;
let pickedCards = 0;
let cardOne;
let cardTwo;

// Function toggles if card is showing or not.
// Also removes event listener for card.
// if 2 cards were picked, it will add the event listener back on the card and reset
// pickedCards
function toggleCard(card, picks){
  card.classList.toggle("cardShow");
  card.removeEventListener("click", handleCardClick);
  if (picks >= 2){
    card.addEventListener("click", handleCardClick);
    pickedCards = 0;
  }
}

// Function that checks if cardOne and cardTwo match, returns boolean 
function isMatch (firstCard, secondCard){
  if (firstCard.classList[0] === secondCard.classList[0] && firstCard != secondCard){
    // don't forget to reset counter!
    pickedCards = 0;
    return true;
  }
  else{
    return false;
  }
}

// Handles game flow on any card click event.
// Tracks pickedCards, toggles each card clicked, runs isMatch logic
// resets cards if no match, and passes to resetGame when either button is clicked
// or game ends.
function handleCardClick(event) {
  // increment pickedCards
  pickedCards++;
  // if we've picked the first of two cards to compare, hold onto the card info
  // toggle the card
  if (pickedCards === 1){
    cardOne = event.target;
    toggleCard(cardOne);
  }
  // otherwise, if this is the second card, hold onto the card info, toggle the card
  // , and increment currentScore + update displayed score
  else if (pickedCards === 2){
    cardTwo = event.target;
    toggleCard(cardTwo);
    currentScore++;
    displayedScore.innerText = `Current Score: ${currentScore}`;
    // check if both cards match and logic for true/false
    if (isMatch(cardOne, cardTwo)){
      // if isMatch returns true, decrement numPairs to track when game ends
      numPairs--;
      // once game ends, run resetGame
      if (numPairs === 0){
        resetGame(currentScore);
      }
    }
    // if isMatch returns false, toggle the cards back off after 1 seccond
    else {
      setTimeout(toggleCard, 1000, cardOne, pickedCards);
      setTimeout(toggleCard, 1000, cardTwo, pickedCards);
    }
  }
}

// Function to run the game. Attached to the start button
// Also sets the button to a reset button, removes the runGame listener and adds the
// resetGame listener
function runGame(){
  createDivsForColors(shuffledColors);
  startButton.innerText = "Reset Game";
  startButton.removeEventListener("click", runGame);
  startButton.addEventListener("click", resetGame);
}

// Function resets the game. Attached to the reset button
// Has logic comparing player's score to the lowest score, pulled from localStorage
// if available.
function resetGame(score){
  // Covers lowerScore being imported from localStorage
  if (lowestScore !== 0 && score < lowestScore){
    lowestScore = score;
    displayedLowScore.innerText = `Lowest Score: ${lowestScore}`;
    localStorage.setItem("lowScore", lowestScore);
  }
  // runs if no lowerScore was pulled from localStorage
  else if (lowestScore === 0){
    lowestScore = score;
    displayedLowScore.innerText = `Lowest Score: ${lowestScore}`;
    localStorage.setItem("lowScore", lowestScore);
  }
  // reset counters pickedCards and currentScore because game is being reset
  // reset numPairs to reset counter to track end of game
  pickedCards = 0;
  currentScore = 0;
  displayedScore.innerText = `Current Score: ${currentScore}`;
  numPairs = COLORS.length / 2;
  // select all the card <div>'s and remove them
  for (let card of document.querySelectorAll(".card")){
    card.remove();
  }
  // Set the button to be a Start button, remove the resetGame listener and add the 
  // runGame listener
  startButton.innerText = "Start Game"
  startButton.removeEventListener("click", resetGame);
  startButton.addEventListener("click", runGame);
}


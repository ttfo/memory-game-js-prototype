
/*
 * INSTRUCTIONS
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


 /* ----- GLOBAL VARIABLES ----- */


// @description Define deck of cards as array - each element of the array is a class required for the cards to show the appropriate icon
var deck = [
  "fa-diamond", "fa-diamond",
  "fa-paper-plane-o", "fa-paper-plane-o",
  "fa-anchor", "fa-anchor",
  "fa-bolt", "fa-bolt",
  "fa-cube", "fa-cube",
  "fa-leaf", "fa-leaf",
  "fa-bicycle", "fa-bicycle",
  "fa-bomb", "fa-bomb"
];


var totalCards = 16; // Total number of cards in deck
var openCards = []; // Initialize array of opened cards
var countOfClicks = 0; // Initialize count of clicks
var elapsedTenthOfSecond = 0; // Initialize timer
var numberOfGames = 0; // Initialize number of games
var maxNumberOfGames = 1000 // Initialize the total number of games allowed
var trackTimeS = 0;
var timerTs = 0;


// @description array of nick names to show on the final modal, add or change as you please
var nick = [
  "Friend",
  "Buddy",
  "Mate",
  "Dude",
  "Hun",
  "Darling",
  "Homie",
  "Bro",
  "Memsahib"
];


// @description Pick up a random item from the nick array
// ref. https://stackoverflow.com/questions/5915096/get-random-item-from-javascript-array
var randomNick = function rand(randomizableArray) {
    return randomizableArray[~~(randomizableArray.length * Math.random())];
}


/* ----- FUNCTIONS ----- */


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}


// @description Return last elements in array - ref. https://stackoverflow.com/questions/9050345/selecting-last-element-in-javascript-array
if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};


// @description Return second last elements in array - ref. https://stackoverflow.com/questions/9050345/selecting-last-element-in-javascript-array
if (!Array.prototype.secondLast){
    Array.prototype.secondLast = function(){
        return this[this.length - 2];
    };
};


// @description Create the deck of cards, shuffled
// @param An array representing the deck
function setUpDeck(yourDeck) {
  $( "ul.deck > li > i" ).attr( "class", "fa" );
  yourDeck = shuffle(yourDeck); // shuffles the deck
  $( "ul.deck > li > i" ).each(function(i) {
    var cardIcon = yourDeck[i];
    $(this).addClass( cardIcon );
    //console.log(this); <= TEST POINT
  });
  return yourDeck;
}


// @description Reset the game,
// clear all additional classes from cards and stars
// and set the moves counter to 0
function resetGame() {
  $( "ul.deck > li" ).attr( "class", "card" ); // hide all cards
  countOfClicks = 0 // set move/click count to 0
  $( "span.moves" ).text( countOfClicks ); // set move/click count to 0
  $( "ul.stars > li" ).children().attr( "class", "fa fa-star" ); // restart star score
  elapsedTenthOfSecond = 0; // restart timer
  $( ".timer" ).attr( "class", "timer"); // reset color of text of the timer to default
}


// @description formats value from setInterval into hh:mm:ss:ms
// @param tenthOfSecondCount - tenth of seconds contained in value from setInterval
// Credit: https://stackoverflow.com/questions/2604450/how-to-create-a-jquery-clock-timer
function timer(tenthOfSecondCount) {
  // @description Return value in double digits, e.g. 01 instead of 1
  function doubleDigits(num) {
    return ( num < 10 ? "0" : "" ) + num;
  }
  var hours = Math.floor(tenthOfSecondCount / 36000); // Math.floor returns the largest integer less than or equal to a number
  tenthOfSecondCount = tenthOfSecondCount % 36000; // Division remainder of the Math.floor operation
  var minutes = Math.floor(tenthOfSecondCount / 600);
  tenthOfSecondCount = tenthOfSecondCount % 600;
  var seconds = Math.floor(tenthOfSecondCount / 10);
  tenthOfSecondCount = tenthOfSecondCount % 10;
  var tenthOfSeconds = Math.floor(tenthOfSecondCount);
  hours = doubleDigits(hours);
  minutes = doubleDigits(minutes);
  seconds = doubleDigits(seconds);
  // Compose the string for display
  var currentTimeString = hours + ":" + minutes + ":" + seconds + ":" + tenthOfSeconds;
  return currentTimeString;
}


// @description Set up timer and call timer() function to format value
// change color of text as time is reaching 30 and 60 seconds
// Credit: https://stackoverflow.com/questions/2604450/how-to-create-a-jquery-clock-timer
function timerFormatted() {
  var timerTs = setInterval(function() {
    elapsedTenthOfSecond = elapsedTenthOfSecond + 1;
    $( ".timer" ).text(timer(elapsedTenthOfSecond));
    if (elapsedTenthOfSecond === 300) { // turn text orange after 30 seconds
      $( ".timer" ).toggleClass( "thirtySeconds" );
    } if (elapsedTenthOfSecond === 600) { // turn text red after 60 seconds
      $( ".timer" ).toggleClass( "thirtySeconds sixtySeconds" );
    }
    trackTimeS = elapsedTenthOfSecond;
  }, 100);
}


// @description Increase count of clicks on counter
// drop stars score once clicks exceed a certain threshold
// ref. https://stackoverflow.com/questions/23543015/jquery-how-to-show-number-of-clicks
// https://stackoverflow.com/questions/4701349/jquery-increase-the-value-of-a-counter-when-a-button-is-clicked
// http://api.jquery.com/html/
function scoreSystem() {
  $( "ul.deck > li" ).on( "click", function(){
    countOfClicks += 1;
    $( "span.moves" ).text( countOfClicks );
    // toggle classes on star icons
    // fa fa-star-half-empty > half empty star
    // fa fa-star-o > empty star
    var starThreshold = 24; // start dropping stars from this count of clicks
    var starDropUnit = 4; // incremental value for each additional drop in score
    if (countOfClicks === starThreshold) {
      $( "ul.stars > li > i:eq( 0 )" ).toggleClass("fa-star fa-star-half-empty");
    } if (countOfClicks === starThreshold + starDropUnit) {
      $( "ul.stars > li > i:eq( 0 )" ).toggleClass( "fa-star-half-empty fa-star-o" );
    } if (countOfClicks === starThreshold + starDropUnit * 2) {
      $( "ul.stars > li > i:eq( 1 )" ).toggleClass( "fa-star fa-star-half-empty" );
    } if (countOfClicks === starThreshold + starDropUnit * 3) {
      $( "ul.stars > li > i:eq( 1 )" ).toggleClass("fa-star-half-empty fa-star-o");
    } if (countOfClicks === starThreshold + starDropUnit * 4) {
      $( "ul.stars > li > i:eq( 2 )" ).toggleClass( "fa-star fa-star-half-empty" );
    } if (countOfClicks === starThreshold + starDropUnit * 5) {
      $( "ul.stars > li > i:eq( 2 )" ).toggleClass( "fa-star-half-empty fa-star-o" );
    }
  });
}

// @description Set up all main functionalities prior to the game
function setUpBoard() {
  setUpDeck(deck); // set up deck main function
  scoreSystem(); // score system main function
  timerFormatted(); // start timer
}


$( matchingLogic() );

/* @description Matching logic / If a card is clicked:
*  - display the card's symbol (put this functionality in another function that you call from this one)
*  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
*  - if the list already has another card, check to see if the two cards match */

function matchingLogic() {
  //console.log(numberOfGames); //<= TEST POINT
  setUpBoard(); // set up main functionalities of the board
  resetGame(); // reset game
  openCards = [];  // empty OpenCards array
  $( "div.restart > i" ).on( "click.resetBoard", resetGame ); // enable listener on restart icon
  $( "ul.deck > li" ).on( "click.showCard", function() {
    $( this ).toggleClass( "open show" );
    if (!$( this ).hasClass( "match" )) { // block cards that are already matching on board
      if ($( this ).hasClass( "open" )) {
        var card = $( this ).children().attr( "class" );
        var cardClass = card.replace("fa", "").trim(); // Only get the class defining the pair
        openCards.push(cardClass); // push class into array of open cards
        //console.log(cardClass); //<= TEST POINT (returns e.g. "fa-diamond")
        var lastCard = openCards.last();
        var secondLastCard = openCards.secondLast();
        if (openCards.length % 2 === 0 && openCards.length < 16) { // Check if we are opening a pair that is not the winning one
          //console.log("you opened a pair of cards"); //<= TEST POINT
          //console.log(openCards.last()); //<= TEST POINT
          //console.log(openCards.secondLast()); //<= TEST POINT
          if (lastCard === secondLastCard) { // confirm if last pair selected is matching
            //console.log("you have a match"); //<= TEST POINT
            $("ul.deck > li > i." + lastCard).parent().toggleClass( "open show match" ); // move to the parent element of li > ul to add match class
          } else { // hide cards if pair is not matching
            // for time delay fuction, ref. https://stackoverflow.com/questions/17883692/how-to-set-time-delay-in-javascript
            var delayInMilliseconds = 300; //1 second
            setTimeout(function() {
              $("ul.deck > li > i." + lastCard).parent().attr( "class", "card"); // if no match, hide last pair of cards
              $("ul.deck > li > i." + secondLastCard).parent().attr( "class", "card");
              //console.log(openCards); //<= TEST POINT
              openCards.splice(-2, 2); // flushing out non-matching cards from array
              //console.log(openCards); //<= TEST POINT
            }, delayInMilliseconds);
          }
        } if (openCards.length === 16) { // check if the last opened pair is winning the game
          // note from rubric: When a user wins the game, a modal appears to congratulate the player and ask if they want to play again.
          // It should also tell the user how much time it took to win the game, and what the star rating was.
          //console.log("you won!"); //<= TEST POINT

          // set up and format winning time
          winTime = timer(trackTimeS);
          var timeExtendedArray = winTime.split(":");
          winTimeExtended = timeExtendedArray[0] + " hours " + timeExtendedArray[1] + " minutes " + timeExtendedArray[2] + " seconds " + timeExtendedArray[3] + "\'";

          // clone star rating
          winStarRating = $( "ul.stars > li" ).clone();

          $( "ul.deck > li > i." + lastCard ).parent().toggleClass( "open show match" ); // uncover last 2 cards

          // if player hasn't reached the max num of games allowed, fire matchingLogic() again and show winning dialog box
          if (numberOfGames < maxNumberOfGames) {
            $( "div.restart > i" ).off( "click.resetBoard" ); // turn off event listener
            $( "ul.deck > li" ).off( "click.showCard" ); // turn off event listener
            $( ".winning-modal-content > p" ).html( "You won, " + randomNick(nick).toString() + "!" ).append( "<br><br>" ).append( "Your time is " +
            winTimeExtended).append( "<br><br>").append("Your rating is: " ).append(winStarRating);
            $( ".winning-modal" ).removeClass( "hide" ); // show modal box
            $( ".winning-modal-content > button" ).one( "click.closeModal", function(){
              numberOfGames += 1;
              $( ".winning-modal" ).addClass( "hide" ); // hide modal box
              //console.log(numberOfGames); //<= TEST POINT
              matchingLogic();
              return;
            });
          } else { // if player has reached the max num of games allowed, show 'close window' message
            $( "div.restart > i" ).off( "click.resetBoard" ); // turn off event listener
            $( "ul.deck > li" ).off( "click.showCard" ); // turn off event listener
            //console.log(numberOfGames); //<= TEST POINT
            var endGameLineOne = randomNick(nick).toString() + ", you\'ve played " + numberOfGames + " games and you\'ve reached the end of this little application. " +
            "It\'s time for me to depart and for you to get on with your life, maybe start playing golf? No hard feelings, huh?"
            var endGameLineTwo = randomNick(nick).toString() + ", please close this tab on your browser and go get some fresh air."
            $( ".winning-modal-content > p" ).html( endGameLineOne ).append( "<br><br>" ).append( "<b>" + endGameLineTwo + "</b>" ); // ref. https://stackoverflow.com/questions/2173556/why-cant-i-add-a-br-with-jquery-html
            $( ".winning-modal-content > button" ).remove();
            $( ".winning-modal" ).removeClass( "hide" ); // show modal box
          }
        }
      }
    }
  });
}

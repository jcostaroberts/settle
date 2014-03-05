$(document).ready(function() {
  var game = new SetGame();

  game.doSetup();

  // display time, now and in future nows
  game.displayTime();
  game.intervalId = setInterval(function() { game.displayTime() }, 500);

  // deal with card clicks
  $("div.card").click(function() {
    game.handleCellClick(this.id);
  })

  // deal with requests for new rows
  $("#addRowButton").click(function() {
    game.handleAddRowButtonClick(this.id);
  })
})


//todo: figure out whether there are any sets left.
// - the naive[st] implementation is to check all three-card
//   combinations. This takes 12*11*10=1320 checks.
// - the number of unique combinations is 12 choose 3 = 220.
// - a better approach is to create up a set of cards in each
//   attribute:
//     * color: red [1, 3] purple [2, 4, 7, 8] green [5, 6, 9, 10, 11, 12]
//   this is a constant-time operation. then we iterate over a 
// just say if (deck.length == 0 and !setsRemaining()) {
//            stopClock();
//          }

$(document).ready(function() {
  var game = new SetGame();

  game.doSetup();

  // display time, now and in future nows
  game.displayTime();
  setInterval( function() { game.displayTime() }, 500 );

  // deal with card clicks
  $("div.card").click(function() {
    game.handleCellClick(this.id);
  })

  // deal with requests for new rows
  $("#addRowButton").click(function() {
    game.handleAddRowButtonClick(this.id);
  })
})



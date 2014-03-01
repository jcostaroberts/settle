//streamline displays; i think I'm doing too many


function SetGame() {
  /* SetGame is the top-level object for a given instance of
   * a game of set. It manages the game grid, the deck, the
   * clock, and the score.
   */
  this.sets = 0;
  this.startTime = 0;
  this.grid = new Grid();
  this.deck = new Deck();
  this.selected = new Array();

  this.doSetup = function() {
    this.deck.doSetup();
    this.grid.doSetup();

    // deal em out
    for (var i = 0; i < this.grid.startSize; i++) {
      this.grid.cells[i].placeCard(this.deck.pop());
      this.grid.size = this.grid.startSize;
    }
    this.grid.updateDisplay();
  }

  this.isAttrSet = function(attr, a, b, c) {
    var allSame = (a[attr] == b[attr]) && (b[attr] == c[attr]);
    if (allSame) {
      return true;
    }
    var allDifferent = (a[attr] != b[attr]) &&
                       (b[attr] != c[attr]) &&
                       (c[attr] != a[attr]);
    return allDifferent;
  }

  this.isSet = function(selected) {
    var a = selected[0];
    var b = selected[1];
    var c = selected[2];
    return this.isAttrSet("color", a, b, c) &&
           this.isAttrSet("fill", a, b, c) &&
           this.isAttrSet("number", a, b, c) &&
           this.isAttrSet("shape", a, b, c);
  }

  this.updateScore = function() {
    this.sets = this.sets + 1;
    $("#setCount").replaceWith('<div id="setCount">Sets found: ' + this.sets + '</div>');
  }

  this.handlePotentialSet = function() {
    // clear selected list regardless of whether this is a set
    if (this.isSet(this.grid.selected)) {
      this.updateScore();
      this.grid.clearSet();
      if (this.grid.size > this.grid.startSize) {
        this.grid.consolidate();
      } else if (this.deck.remaining() >= 3) {
        this.grid.dealCards(3, this.deck)
      }
    }
    this.grid.clearSelected();
    this.grid.updateDisplay();
  }

  this.displayTime = function() {
    st = new Date();
    if (this.startTime == 0) {
      this.startTime = st.getTime();
    }
    diff = Math.floor((st.getTime() - this.startTime)/1000);
    h = Math.floor(diff/(60*60));
    m = Math.floor(diff/60) % 60;
    m = m < 10 ? "0" + m : m;
    s = diff % 60;
    s = s < 10 ? "0" + s : s;
    $("#clock").replaceWith('<div id="clock">' +
                            h + ':' + m + ':' + s + '</div>');
  }

  this.handleCellClick = function(cellId) {
    if (!this.grid.cell(cellId).card) {
      return;
    }
    this.grid.updateSelected(cellId);
    this.grid.handleCellClick(cellId);
    if (this.grid.selected.length == 3) {
      this.handlePotentialSet();
    }
  }

  this.handleAddRowButtonClick = function(cellId) {
    var numberToAdd = (this.grid.size + 3) > this.grid.maxSize ? 2 : 3;
    if (numberToAdd < 3) alert("<3")
    this.grid.size = this.grid.size + numberToAdd;
    this.grid.dealCards(numberToAdd, this.deck);
    this.grid.updateDisplay();
  }
   
}


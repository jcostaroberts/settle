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
  this.intervalId = -1;

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
    //alert( attr + " a: " + a[attr] + " b: " + b[attr] + " c: " + c[attr])
    var allSame = (a.card[attr] == b.card[attr]) &&
                  (b.card[attr] == c.card[attr]);
    if (allSame) {
      return true;
    }
    var allDifferent = (a.card[attr] != b.card[attr]) &&
                       (b.card[attr] != c.card[attr]) &&
                       (c.card[attr] != a.card[attr]);
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

      //stop timer
      if (this.deck.deck.length == 0 && !this.setsRemaining()) {
        clearInterval(this.intervalId);
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
    this.setsRemaining();
    var numberToAdd = (this.grid.size + 3) > this.grid.maxSize ? 2 : 3;
    if (numberToAdd < 3) alert("<3")
    this.grid.size = this.grid.size + numberToAdd;
    this.grid.dealCards(numberToAdd, this.deck);
    this.grid.updateDisplay();
  }

  this.setsRemaining = function() {
    for (var i = 0; i < this.grid.size - 2; i++) {
      for (var j = i + 1; j < this.grid.size - 1; j++) {
        for (var k = j + 1; k < this.grid.size; k++) {
          maybeSet = [this.grid.cells[i],
                      this.grid.cells[j],
                      this.grid.cells[k]];
          if (this.isSet(maybeSet)) {
            //alert("Set: " + this.grid.cells[i].card.name + " " +
            //      this.grid.cells[j].card.name + " " +
            //      this.grid.cells[k].card.name);
            return true;
          }
        }
      }
    }
    return false;
  }
 
}


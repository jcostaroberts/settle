function Grid() {
  /* A Grid maintains the cards in play. It has a 20 slots,
   * though usually only twelve of those have cards in
   * them. It also keeps track of which of these cards are
   * currently selected.
   */
  this.cells = new Array();
  this.startSize = 12;
  this.size = 0;  // never touch this
  this.maxSize = 20;
  this.selected = new Array();

  this.doSetup = function() {
    for (var i = 0; i < this.maxSize; i++) {
      this.cells.push(new Cell(i, this));
    }
  }

  this.placeInFirstOpen = function(card) {
    for (var i = 0; i < this.size; i++) {
      if (!this.cells[i].card) {
        this.cells[i].placeCard(card);
        return;
      }
    }
  }

  this.consolidate = function() {
    var moved = 0;
    for (var i = this.size-1;
         i >= 0 && moved != 3 && i >= this.size -3; i--) {
      var card = this.cells[i].card;
      if (card) {
        this.placeInFirstOpen(card);
        this.cells[i].clearCard();
        moved++;
      }
    }
    this.size = this.size - 3;
  }

  this.updateSelected = function(cellId) {
    cell = this.cells[cellId.substring("cell".length)]
    var selectedIndex = $.inArray(cell, this.selected);
    if (selectedIndex > -1) {
      this.selected.splice(selectedIndex, 1);
    } else {
      this.selected.push(cell);
    }
  }

  this.dealCards = function(n, deck) {
    for (var i = 0; i < n; i++) {
      this.placeInFirstOpen(deck.pop());
    }
  }

  this.clearSet = function() {
    for (var i = 0; i < 3; i++) {
      this.selected[i].clearCard();
    }
  }

  this.clearSelected = function() {
    this.selected.length = 0;
  }

  this.isSelected = function(cell) {
    return $.inArray(cell, this.selected) > -1;
  }

  this.updateDisplay = function() {
    for (var i = 0; i < this.maxSize; i++) {
      this.cells[i].doDisplay();
    }
  }

  this.cell = function(cellId) {
    return this.cells[cellId.substring("cell".length)];
  }

  this.handleCellClick = function(cellId) {
    this.cell(cellId).handleClick();
  }

  // need to be able to remove cards from grid, shifting the rest over
  //actually, ebtter not to shift; just move the last cards from the list
  //and place them in the first 12.
}

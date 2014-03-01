//streamline displays; i think I'm doing too many

function Card(color, shape, fill, number) {
  this.name = [color, shape, fill, number].join("-");
  this.color = color;
  this.fill = fill;
  this.shape = shape;
  this.number = number;
  this.image = "images/" + this.name + ".png";
}

function Deck() {
  /* A Deck contains all cards that are not currently
   * in play and have not been played yet.
   */
  this.deck = new Array();

  this.pop = function(x) {
    return this.deck.pop(x);
  }

  this.remaining = function() {
    return this.deck.length;
  }

  this.shuffle = function() {
    for (var i = this.deck.length-1; i >= 0; i--) {
      var j = Math.floor(Math.random()*i);
      var x = this.deck[i];
      this.deck[i] = this.deck[j];
      this.deck[j] = x;
    }
  }

  this.doSetup = function() {
    color = ["red", "green", "purple"];
    shape = ["diamond", "squiggle", "oval"];
    fill = ["striped", "open", "solid"];
    number = [1, 2, 3];
    for (i in color) {
      for (j in shape) {
        for (k in fill) {
          for (l in number) {
            this.deck.push(new Card(color[i], shape[j], fill[k], number[l]));
          }
        }
      }
    }
    this.shuffle();
  }
}

function Cell(name, grid) {
  /* A Cell represents a single card space on the grid.
   * It may or may not have a card currently occupying
   * its space. This is the unit of display---each cell
   * manages the display of its card, its border, and
   * so on.
   */
  this.name = "cell" + name;
  this.card = 0;
  this.displayed = false;
  this.grid = grid

  this.clearCard = function() {
    this.card = 0;
  }

  this.placeCard = function(card) {
    this.card = card;
  }

  this.doDisplayCard = function() {
    if (!this.card.image) {
      $("#" + this.name).css("visibility", "hidden");
    } else {
      $("#" + this.name + " img").attr("src",
                                       this.card ? this.card.image : "");
      $("#" + this.name).css("visibility", "visible");
    }
  }

  this.doDisplayCellBorder = function() {
    var sel = this.grid.isSelected(this);
    color = sel ? "#C1E0FF" : "";
    weight = sel ? "2px" : "";
    style = sel ? "solid" : "";
    $("#" + this.name).css({"border-color" : color,
                            "border-weight" : weight,
                            "border-style" : style});
  }

  this.doDisplay = function() {
    if (!this.displayed) {
      $("#board").append('<div id="' + this.name + '" class="card">' +
                         '<img id="img' + this.name + '" src="' + this.card.image + '"/>' +
                         '</div>');
      this.displayed = true;
    }
    this.doDisplayCard();
    this.doDisplayCellBorder();
  }

  this.handleClick = function() {
    this.doDisplay();
  }
}

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


var game = new SetGame();

// main
$(document).ready(function() {
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



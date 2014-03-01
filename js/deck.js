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

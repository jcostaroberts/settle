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

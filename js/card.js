
var COLOR = {
  RED : {value: 0, name: "red"},
  GREEN : {value: 1, name: "green"},
  PURPLE : {value: 2, name: "purple"}
};

var SHAPE = {
  DIAMOND : {value: 0, name: "diamond"},
  SQUIGGLE : {value: 1, name: "squiggle"},
  OVAL : {value: 2, name: "oval"}
};

var FILL = {
  STRIPED : {value: 0, name: "striped"},
  OPEN : {value: 1, name: "open"},
  SOLID: {value: 2, name: "solid"}
};

var NUMBER = {
  ONE : {value: 1, name: "1"},
  TWO : {value: 2, name: "2"},
  THREE : {value: 3, name: "3"}
};

function Card(color, shape, fill, number) {
  this.name = [color.name, shape.name, fill.name, number.name].join("-");
  this.color = color.value;
  this.fill = fill.value;
  this.shape = shape.value;
  this.number = number.value;
  this.image = "images/" + this.name + ".png";
}


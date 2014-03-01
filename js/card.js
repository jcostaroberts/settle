function Card(color, shape, fill, number) {
  this.name = [color, shape, fill, number].join("-");
  this.color = color;
  this.fill = fill;
  this.shape = shape;
  this.number = number;
  this.image = "images/" + this.name + ".png";
}


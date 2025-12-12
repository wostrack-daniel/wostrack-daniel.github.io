void setup() {
  size(400, 400);
}

void draw() {
  background(200);
  if (mouseX > 100) {
    fill (255, 0, 0);
    noStroke();
  } else {
    fill(0, 255, 0);
    strokeWeight (3);
  }
  circle(mouseX -36, mouseY -36, 100);
}

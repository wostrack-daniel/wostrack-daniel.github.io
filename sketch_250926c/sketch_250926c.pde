void setup() {
  size(400, 400);
}

void draw() {
  background(200);
  
  if (mousePressed) {
  circle(mouseX -36, mouseY -100, 100);  
  } else {
  circle(mouseX -36, mouseY -36, 100);  
  }
  
  if (keyPressed) {
  square(mouseX -36, mouseY -100, 100);  
  } else {
  square(mouseX -36, mouseY -36, 100);  
  }
  
  // if (key == 'a') {
  //square(mouseX -72, mouseY -100, 100);  
  //} else {
  //square(mouseX -72, mouseY -36, 100);  
  //}
  
}

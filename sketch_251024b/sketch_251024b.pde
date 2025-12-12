int rot = 0;
int grün = 0;
int blau = 0;
int hintergrund = #ffffff;

void setup() {
   size(1000, 1000);
}


void draw() {
  background(hintergrund);
  circle(100, 100, 100);
  color(rot, grün, blau);
  
  if(keyPressed && key == 'x' && rot<255) {
    rot = rot + 1;
  }
  else {
    rot = rot -1;
  }
  
  if(keyPressed && key == 'c' && grün<255) {
    grün = grün + 1;
  }
  else {
    grün = grün -1;
  }
  if(keyPressed && key == 'v' && blau<255) {
    blau = blau + 1;
  }
  else {
    blau = blau -1;
  }
}

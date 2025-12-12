int hintergrund = #ffffff;
boolean kreisAnzeigen = true;
int größe_kreis = 100;
char taste = 'j';
char taste2 = 'k';

void setup() {
   size(1000, 1000);
}


void draw() {
  background(hintergrund);
  if (kreisAnzeigen) {
    circle(größe_kreis, größe_kreis, größe_kreis);
  }
  if(mousePressed && mouseButton == LEFT || key == taste && keyPressed) {
    kreisAnzeigen = true;
  }
   if(mousePressed && mouseButton == RIGHT || key == taste2 && keyPressed) {
    kreisAnzeigen = false;
  }
}

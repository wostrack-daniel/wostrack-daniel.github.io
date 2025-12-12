int rot = 0;
int grün = 0;
int blau = 0;

void setup() {
   size(1000, 1000);
}

void draw() {
  // Setzt den Hintergrund auf Weiß.
  background(255); 
  
  // Setzt die Füllfarbe FÜR DEN KREIS.
  fill(rot, grün, blau); 
  
  // Zeichnet den Kreis NACHDEM die Füllfarbe gesetzt wurde.
  circle(100, 100, 100);
}

// Eine neue Funktion, die nur einmal aufgerufen wird, wenn eine Taste gedrückt wird.
void keyPressed() {
  if (key == 'x' && rot < 255) {
    rot = rot + 5; // Erhöht den Wert um 5
  }
  if (key == 'c' && grün < 255) {
    grün = grün + 5;
  }
  if (key == 'v' && blau < 255) {
    blau = blau + 5;
  }
  
    if (key == 's' && rot < 255) {
    rot = rot - 5; // Erhöht den Wert um 5
  }
  if (key == 'd' && grün < 255) {
    grün = grün - 5;
  }
  if (key == 'f' && blau < 255) {
    blau = blau - 5;
  }
}

int posSpielerX = 40;
int posSpielerY = 150;
int posHindernisX = 500;
int posLochY = 80;
int geschwindigkeitSpieler = 4;
int geschwindigkeitHindernis = 3;

void setup() {
  size(600, 300);
}

void draw() {
  background(255); // Hintergrund in jedem Frame neu zeichnen

  fill(0);
  noStroke();

  // Spieler zeichnen
  square(posSpielerX, posSpielerY, 20);

  // Hindernisse zeichnen
  // Oberer Teil des Hindernisses
  rect(posHindernisX, 0, 20, posLochY);
  // Unterer Teil des Hindernisses
  rect(posHindernisX, posLochY + 50, 20, height - posLochY - 50);

  // Spielerbewegung
  if (mousePressed) {
    posSpielerY -= geschwindigkeitSpieler;
  } else {
    posSpielerY += geschwindigkeitSpieler;
  }

  // Spieler auf dem Bildschirm halten
  if (posSpielerY < 0) {
    posSpielerY = 0;
  }
  if (posSpielerY > height - 20) {
    posSpielerY = height - 20;
  }

  // Hindernisbewegung
  posHindernisX -= geschwindigkeitHindernis;

  // Hindernis am linken Rand zurücksetzen
  if (posHindernisX < -20) {
    posHindernisX = 600;
    posLochY = int(random(50, height - 100)); // Zufällige Position für das Loch
  }

  // Kollisionserkennung
  // Überprüfen, ob der Spieler den oberen oder unteren Teil des Hindernisses berührt
  if (posSpielerX + 20 > posHindernisX && posSpielerX < posHindernisX + 20) {
    if (posSpielerY < posLochY || posSpielerY + 20 > posLochY + 50) {
      print("Kollision erkannt! " + frameCount + "\n");
      // Mögliche Aktion bei Kollision, z.B. Spielende
      noLoop(); // Stoppt die draw()-Schleife
    }
  }
}

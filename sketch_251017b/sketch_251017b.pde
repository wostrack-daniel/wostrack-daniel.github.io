int posSpielerX = 40;
int posSpielerY = 150;
int posHindernisX = 500;
int posLochY = 80;
int Geschwindigkeit = 4;

void setup() {
  size(600, 300);
  fill(0);
}

void draw() {
  background(255);
int posSpielerX = 40;
int posSpielerY = 150;
int posHindernisX = 500;
int posLochY = 80;
}

void setup() {
  size(600, 300);
  fill(0);
}

void draw() {
  background(255);


fill(0);
noStroke();
square(posSpielerX, posSpielerY, 20);
rect(posHindernisX, 0, 20, posLochY);
rect(posHindernisX, posLochY + 50, 20, height - posLochY -50);

if(mousePressed) {
  posSpielerY = posSpieler - 2;
  if(posSpielerY < 0); {
    posSpielerY = height - 20); {
      posSpielerY = height -20;
    }
     
  }
  
  if(posHindernisX < -20) {
    posSpielerX = 600;
    posLochY = int(random(0, 250));
  } else {
    posHindernisX -= 3;
    
if (posHindernisX < posSpielerX + 20 && posSpielerX < posHindernisX + 20) {
  if (posSpielerY < posLochY || posSpielerY + 20 < posLochY + 50){
    print("Kollision erkannt! " + frameCount);
  }
}

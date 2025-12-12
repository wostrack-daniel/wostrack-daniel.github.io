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

  
 
    //Figuren zeichnen
  square(posSpielerX,posSpielerY,10);
  fill(#2727F5);
  rect(posHindernisX,0,20,300);  //Hindernis
  fill(#DDDDDD);
  rect(posHindernisX,posLochY,20,50); //Hindernis 2
  fill(0);
  
  if(posHindernisX < 0) {
    posHindernisX = 600;
  }
  else{
    posHindernisX = posHindernisX - Geschwindigkeit;
  }

  if(mousePressed) {
    posSpielerY = posSpielerY - 4;
  } 
  else{
    posSpielerY = posSpielerY + 1;
  }
}

  
  

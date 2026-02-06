import g4p_controls.*;

String verarbeite(String text) {
  int n = text.length();
  int posLinks = 0;
  int posRechts = n - 1;
  
    while(posLinks < posLinks) {
      
    char zeichenLinks = text.charAt(posLinks);
    if (zeichenLinks == ' ') {  
      posLinks++;
      zeichenLinks = text.charAt(posLinks);
    }
    char zeichenRechts = text.charAt(n - posRechts - 1);
    if (zeichenRechts == ' ') {  
      posRechts--;
      zeichenRechts = text.charAt(posRechts);
    }
    
    if (zeichenLinks != zeichenRechts) {
      return "Das ist kein Palindrom";
    }
  }
  
  return "YEY.";
}


void setup() {
  size(400, 300, JAVA2D);
  createGUI();
  setzeEingabe("Franz jagt im komplett verwahrlosten Taxi quer durch Bayern.");
}

void draw() {
  background(240);
}

void setzeEingabe(String text) {
  textarea.setText(text);
}

let textarea;
let buttonLos;
let labelResult;
function verarbeite(text){
    let zahl = int(text);
    let ergebnis = "";
    return ergebnis;
}

function setup(){
    createCanvas(400, 300, JAVA2D);
    createGUI();
    setzeEingabe("Franz jagt im komplett verwahrlosten Taxi quer durch Bayern.");
}

function draw(){
    background(240);
}

function setzeEingabe(text){
    textarea.setText(text);
}

function buttonLos_click(source, event){
    labelResult.setText(verarbeite(textarea.getText()));
}

function createGUI(){
    G4P.messagesEnabled(false);
    G4P.setGlobalColorScheme(GCScheme.BLUE_SCHEME);
    G4P.setMouseOverEnabled(false);
    G4P.setDisplayFont("Arial", G4P.PLAIN, 16);
    G4P.setInputFont("Arial", G4P.BOLD, 16);
    surface.setTitle("Textfeld Vorlage");
    textarea=new GTextArea(this, 10, 10, 380, 130, G4P.SCROLLBARS_NONE);
    textarea.setOpaque(true);
    buttonLos=new GButton(this, 280, 150, 110, 30);
    buttonLos.setText("Start");
    buttonLos.addEventHandler(this, "buttonLos_click");
    labelResult=new GLabel(this, 10, 150, 260, 140);
    labelResult.setTextAlign(GAlign.LEFT, GAlign.TOP);
    labelResult.setText(" ");
    labelResult.setOpaque(false);
}


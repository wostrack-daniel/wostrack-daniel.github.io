//Aufgabe 6 Kapitel Binärsystem und Hexadezimalsystem

//Als Algorithmus zur Umwandlung von Zahlen ins Binärsystem kann am Computer 
//dieselbe Strategie wie von Hand verwendet werden. Dazu benötigen wir eine Division 
//mit Rest.

//a) Probiere die Division mit Rest an einigen Beispielen 
//mit dem Programmcode links aus. 

int quotient = zahl / 2; 
int rest = zahl % 2; 
println(zahl + ":2 = " + quotient + " Rest " + rest); 

//Um die Division mit Rest mehrfach zu wiederholen, 
//wird eine while-Schleife eingesetzt. Dabei wird 
//eine Laufbedingung angegeben: Der Schleifenblock 
//wird dann wiederholt, solange die Laufbedingung 
//wahr ist. 
//Ergänze die Lücken im Programmcode. 

int zahl = 90; 
while (_________) { 
 int quotient = zahl/2; 
 int rest = zahl%2; 
 println(zahl + ":2 = " + quotient + " Rest " + rest); 
 zahl = ________; 
}

//c) Wandle mit deinem Programm die Zahl 2147483647 aus dem Einstiegsbeispiel um. 

//d) Passe das Programm so an, dass eine Umwandlung ins Hexadezimalsystem 
//durchgeführt wird. 

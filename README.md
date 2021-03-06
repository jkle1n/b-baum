# B-Baum Implementierung
## Getting Started
* Laden Sie das Projekt herunter
* Öffnen Sie die Console und navigieren in den Ordner, in dem das Projekt liegt
* Voraussetzungen: docker und docker-compose
* Führen Sie den Befehl `docker-compose up` aus (mit Adminrechten)
* Öffnen Sie die Anwendung im Browser `http://localhost:3000/`

## Funktionen
### Allgemeines
* Generell können alle Werte, welche in ein Textfeld geschrieben werden mit Enter eingefügt/gelöscht/... werden
* Der Button "Weiter" wird aktiv, wenn mehrere Elemente schrittweise eingefügt werden
    * Alle anderen Textfelder und Buttons sind dann inaktiv
* Durch einen Klick auf den Button "Baum löschen" kann der gesamte Baum gelöscht werden
* Bei "Grad einfügen" kann die Anzahl der Schlüssel pro Knoten bestimmt werden
    * Ist p = 5, dann können im Wurzelknoten 1 bis p-1, also 1-4 Elemente sein. In Kindknoten beträgt die Anzahl der Elemente dann round(p/2)-1 bis p-1, also 2-4.
* Über den Button "Rückgängig" kann eine Operationenfolge rückgängig gemacht werden
    * Wurden zum Beispiel 3 Elemente aus dem Baum gelöscht und drückt anschließend auf "Rückgängig", so wird der Baum angezeigt, bevor diese 3 Elemente gelöscht wurden
    * Fügt man zufällige Zahlen ein und möchte diesen Schritt wieder rückgängig machen, so kann dies auch über den Button "Rückgängig" erledigt werden. Dies ist auch möglich, wenn die Operationenfolge noch nicht abgeschlossen ist.

### Einfügen
* Es dürfen nur Zahlen von 0 bis 64000 eingefügt werden.
* Doppelte Werte dürfen nicht eingefügt werden.
* Das zuletzt eingefügte Element wird im Baum entsprechend markiert.
* Über den Button "upload file" kann eine Csv-Datei ausgewählt werden
    * Die Werte müssen durch Kommas voneinander getrennt sein (z.B. 1,6,2,4)
    * Der Nutzer darf anschließend entscheiden, ob automatisch alle Werte aus der Csv-Datei in den Baum eingefügt werden, oder ob diese schrittweise eingefügt werden sollen
* In dem Textfeld "Werte einfügen" können sowohl einzelne, als auch mehrere Werte eingefügt werden (diese werden dann schrittweise eingefügt)
* Durch Angabe einer Anzahl an Elementen, einer Untergrenze und einer Obergrenze, können Zufallszahlen eingefügt werden
    * Die Zufallszahlen liegen dann zwischen der Untergrenze und der Obergrenze (min <= x < max)
### Löschen
* In dem Textfeld "Werte löschen" können sowohl einzelne, als auch mehrere Werte gelöscht werden (diese werden dann schrittweise gelöscht)
### Suchen
* In dem Textfeld "Wert suchen" kann in dem Baum nach einem Element gesucht werden
    * Wird das Element gefunden, so wird es im Baum markiert
    * Die Kosten für das Suchen werden angezeigt.

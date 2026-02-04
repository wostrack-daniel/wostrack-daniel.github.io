# Icon-Konfiguration für Menüreiter

## Wo ändere ich die Icons?

Die Icons der Menüreiter findest du im `<style>`-Block der [index.html](html/index.html) Datei im Abschnitt **"Icon definitions - einfach änderbar"** (ungefähr ab Zeile 47).

## Wie ändere ich die Icons?

### Schritt 1: index.html öffnen
Öffne die Datei `Informatik_AG_10/html/index.html`

### Schritt 2: Icon-Definitionen finden
Suche nach folgendem Abschnitt im `<style>`:
```css
/* Icon definitions - einfach änderbar */
:root {
    --icon-home: url('data:image/svg+xml;utf8,...');
    --icon-kurse: url('data:image/svg+xml;utf8,...');
    --icon-projekte: url('data:image/svg+xml;utf8,...');
    --icon-info: url('data:image/svg+xml;utf8,...');
}
```

### Schritt 3: SVG austauschen
Jeder Menüpunkt hat eine CSS-Variable:
- `--icon-home` → Home-Icon
- `--icon-kurse` → Kurse-Icon
- `--icon-projekte` → Projekte-Icon
- `--icon-info` → Info-Icon

**Beispiel:** Um das Home-Icon zu ändern, ersetze den SVG-Code nach `--icon-home: url('data:image/svg+xml;utf8,`

## Beliebte Icon-Tools

- **Font Awesome**: https://fontawesome.com/ (einfache SVG-Icons)
- **Feather Icons**: https://feathericons.com/ (minimalistisch)
- **Material Icons**: https://fonts.google.com/icons (Google)
- **SVG Online Editor**: https://www.svgeditor.dev/

## Tipps

✅ **Do's:**
- Verwende einfache, klare SVGs
- Halte die `viewBox="0 0 24 24"` bei, damit Icons konsistent skalieren
- Ersetze `fill="%23333"` nicht – das ist die aktuelle Farbe

❌ **Don'ts:**
- Vermeide sehr komplexe SVGs (zu langsam)
- Ändere nicht die `url()` Struktur

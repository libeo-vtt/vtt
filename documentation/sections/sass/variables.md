- `$mq-breakpoints` → Regroupe l'ensemble des breakpoints
    <br> *L'identifiant du breakpoint sera le label utilisé par les grilles et les mixins de responsive.*
    <br> **Pour chaque breakpoint, définir les paramètres suivants :**
    - **min** → *[valeur en pixel]* Valeur minimale du breakpoint. Si la valeur est *false*, le breakpoint n'aura pas de minimum
    - **max** → *[valeur en pixel]* Valeur maximale du breakpoint. Si la valeur est *false*, le breakpoint n'aura pas de maximum
    - **grid** → *[boolean]* Détermine si le breakpoint sera utilisé dans les grilles
    - **export** → *[boolean]* Détermine si le breakpoint sera exporté dans la variable JavaScript `window.breakpoint`


    $mq-breakpoints: (
        "breakpoint1": (
            min: 320px,
            max: 767px,
            grid: true,
            export: true
        ),
        "breakpoint2": (
            min: 768px,
            max: 1024px,
            grid: true,
            export: true
        )
    );

- `$colors` → Ensemble des couleurs et variations de couleurs
    <br> *Chaque couleurs comporte minimalement une couleur de base, et peut contenir une ou plusieurs variantes de couleurs*
    <br> *Il est possible de récupérer la valeur de chaque couleur avec la fonction Sass `color("couleur")` ou `color("couleur", "variante")`*


    $colors: (
        "couleur1": (
            "base": #000,
            "variante1": #555
        ),
        "couleur2": (
            "base": #fff,
            "variante1": darken(#fff, 10%),
            "variante2": darken(#fff, 20%)
        )
    );

    // Exemple d'utilisation
    $background-color: color("couleur1");
    $text-color: color("couleur1", "variante1");


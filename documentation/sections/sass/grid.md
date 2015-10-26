Le mixin `grid` permet de créer un système de colonnes responsive qui permet de gérer les breakpoints à partir des classes HTML. Le mixin se base sur les breakpoints définis dans la variable `$mq-breakpoints`. La structure HTML des colonnes doit respecter les règles suivantes;

- Le `<div>` parent doit contenir la classe défini dans le Sass.
- Le seul enfant direct de la classe parente doit être un `<div>` avec la classe "grid-wrapper". <br>*Ce `<div>` est obligatoire pour que la grille fonctionne correctement.*
- Les classes sur les colonnes doivent suivent la nomenclature suivante;
    - "col-" + largeur de la colonne + total des colonnes + nom du breakpoint. <br> *Exemples: `col-1-2` `col-1-2-mobile` `col-4-5-tablet`*


    .grid-example {
        $horizontal-gutter: 25px;
        $vertical-gutter: 25px;
        $margin: 30px 0;
        $max-columns: 5;
        $vertical-align: top;
        @include grid($horizontal-gutter, $vertical-gutter, $margin, $max-columns, $vertical-align);
    }

    // Exemple d'utilisation
    <div class="grid-example">
        <div class="grid-wrapper">
            <div class="col-1-3 col-1-2-tablet col-1-1-mobile"></div>
            <div class="col-1-3 col-1-2-tablet col-1-1-mobile"></div>
            <div class="col-1-3 col-1-2-tablet col-1-1-mobile"></div>
        </div>
    </div>

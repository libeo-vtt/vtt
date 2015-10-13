Le mixin `grid` permet de créer un système de colonnes responsive qui permet de gérer les breakpoints à partir des classes HTML. Le mixin se base sur les breakpoints définis dans la variable `$mq-breakpoints`.

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

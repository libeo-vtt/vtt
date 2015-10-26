- `headers` → Permet de styliser toutes les balises header (`h1` , `h2` , `h3` ...) ainsi que les classes de headers (`.h1` , `.h2` , `.h3` ...)


    @include headers {
        display: block;
        font-weight: bold;
        ...
    }

- `absolute-center` → Centre un élément verticalement et horizontalement*


    @include absolute-center;

- `absolute-vertical-center` → Centre un élément verticalement*


    @include absolute-vertical-center;

- `absolute-horizontal-center` → Centre un élément horizontalement*


    @include absolute-horizontal-center;

\* *Pour en savoir plus sur la technique utilisée pour centrer les éléments, [lire cet article](https://css-tricks.com/centering-percentage-widthheight-elements/).*

- `clearfix` → Applique un clearfix sur un élément. *Pour en savoir plus sur la technique du clearfix, [lire cet article](https://css-tricks.com/snippets/css/clear-fix/)*


    @include clearfix;

- `visuallyhidden($hide)` → Cache un élément visuellement en gardant l'information accessible pour les lecteurs d'écran.


    @include visuallyhidden;

- `reset-list-style` → Supprime les styles par défaut d'une liste comme les marges et les puces et affiche les éléments de la liste sur une même ligne.


    @include reset-list-style;

- `absolute($top, $right, $bottom, $left)` → Ce mixin est un raccourci pour positionner un élément en `position: absolute`.


    @include absolute(50px, auto, auto, 100px);

- `rem-fontsize($size)` → Permet de spécifier une valeur en pixel à transformer en rem pour le font-size, tout en gardant un fallback en pixel.


    @include rem-fontsize(16px);

- `rem-lineheight($size)` → Permet de spécifier une valeur en pixel à transformer en rem pour le line-height, tout en gardant un fallback en pixel.


    @include rem-lineheight(20px);

- `rem-typo($font, $line)` → Ce mixin est un raccourci pour utiliser `rem-fontsize` et `rem-lineheight` simultanément.


    @include rem-typo(16px, 20px);

- `triangle($direction: up, $color:#000, $size:100px)` → Crée un triangle en CSS. Il est conseillé d'utiliser ce mixin dans un pseudo element.


    .element:after {
        content: "";
        display: block;
        @include triangle(down, #000, 20px);
    }

- `placeholder($color)` → Change l'affichage du placeholder sur un champ texte.


    input[type="text"] {
        color: #111;
        @include placeholder {
            color: #ccc;
            font-style: italic;
        }
    }

- `underline($color, $weight, $offset)` → Ce mixin permet d'avoir plus de flexibilité pour styliser l'underline sur les liens. Il est conseillé d'utiliser ce mixin pour des liens décoratifs et non pour des liens génériques dans des pages de contenu, car la technique utilisée pour ce mixin ne supporte pas aussi bien les liens sur plusieurs lignes que le underline de base.


    @include underline(#000, 2px, 2px);

- `respond-to($breakpoint)` → Permet de créer un media query sur un élément en particulier. Lorsqu'une seule valeur est passée en paramètre, le mixin crée un media query avec la valeur en *max-width*. Il est possible de passer une liste en paramètre pour spécifier un *min-width* ainsi qu'un *max-width*. Il est également possible de passer un breakpoint spécifié dans la variable [$breakpoints](#sass-variables).


    .element {
        font-size: 36px;
        @include respond-to(1920px) {
            font-size: 30px;
        }
        @include respond-to(tablet) {
            font-size: 24px;
        }
        @include respond-to(500px 600px) {
            font-size: 20px;
        }
        @include respond-to(mobile) {
            font-size: 16px;
        }
    }

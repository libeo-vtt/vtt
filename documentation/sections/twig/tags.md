- `stylesheet` → Permet d'inclure une feuille de style dans un template twig


    {{ '{% stylesheet "path/to/file.css" %}' }}

- `script` → Permet d'inclure un fichier JS dans un template twig


    {{ '{% script "path/to/file.js" %}' }}


- `SVG with png fallback` → Permet d'inclure un svg dans un template twig


    Paramètres:

    [0]: SVG name
    [1]: SVG size (optional)
    [2]: SVG alternative text (optional)

    {{ '{% svg "nomdusvg", "widthxheight", "Texte alternatif" %}' }}


- `Vidéo youtube` → Permet d'inclure une vidéo provenant de youtube dans un template twig


    {{ '{% youtube "id de la vidéo youtube" %}' }}


- `Vidéo viméo` → Permet d'inclure une vidéo provenant de viméo dans un template twig


    {{ '{% vimeo "id de la vidéo viméo" %}' }}


- `Lorem ipsum generator` → Permet d'inclure du Lorem Ipsum dans un template twig



    {{ '{% lorem nombreDeMot %}' }} ex: {{ '{% lorem 100 %}' }}

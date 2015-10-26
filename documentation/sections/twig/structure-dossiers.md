- **Layouts** → Templates qui gèrent les différentes structures des pages, tel que le contenu principal, les sidebars, etc.
- **Partials** → Sections de page qui peuvent être inclues dans les views
- **Templates** → Dossier pour les [VTT-Templates](#vtt-templates)
- **Views** → Premier niveau de page, ce sont à partir des fichiers dans ce dossier que les pages HTML du build sont générés.
- **Widgets** → Éléments qui peuvent être réutilisés plusieurs fois dans une même page, tel que les folders, les sliders, etc
- **main.twig** → Contient la structure générale de la page, tel que le `<head>` et le `<body>`. Toutes les pages se basent sur ce fichier.

L'hiérarchie des pages fonctionnent de la façon suivante:

                                  partials
    main.twig > layouts > views <
                                  widgets

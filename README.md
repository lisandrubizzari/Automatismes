# Automatismes

Site statique en français pour s'entraîner aux automatismes de mathématiques de Première (épreuve du baccalauréat).

## Contenu

- Page d'accueil dédiée qui présente les 6 thématiques et renvoie vers un générateur par page
- 6 générateurs de QCM auto-correctifs (calcul, proportions, évolutions, fonctions, statistiques et probabilités)
- Interface responsive sombre utilisable sur mobile

## Démarrer le site localement

```bash
python -m http.server 8000
```

Ouvrir ensuite [http://localhost:8000](http://localhost:8000) dans votre navigateur.

- `index.html` : page d'accueil avec le menu et les descriptions
- `calcul.html`, `proportions.html`, ... : chaque fichier correspond à un générateur

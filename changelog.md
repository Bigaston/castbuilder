## Changelog de Castbuilder

### 1.0.17
**Ajouts :**
- Possibilitée de mettre du texte uniquement sur le site web avec `%website% %/website%`
- Possibilitée de mettre du texte uniquement sur le flux avec `%feed% %/feed%`
- Ajout de la possibilitée de définir l'accessibilitée d'un épisode :
> all : présent partout
> feed : présent uniquement sur le flux RSS
> website : présent uniquement sur le site web
> unlisted : accessible uniquement via l'URL de l'épisode
- Ajout d'un player audio dans le flux RSS affiché via le XSL par défaut

**Correction :**
- Vérification de *information.md* au lancement de new

### 1.0.16
**Ajouts :**
- Ajout du tag meta color dans le template par défaut
- Ajout des boutons de partages Facebook et Twitter

### 1.0.15
**Ajouts :**
- Lien vers le flux RSS dans l'entête de index.html par défaut
- Média tag pour Open Graph
- Vérification du numéro de version à la fin de chaques commandes par raport au package de Github

### 1.0.14
**Ajouts :**
- Taille des fichiers dans le flux
- Possibilitée de définir à partir de quel endroit on fait chacune des commandes
- Vérification de la présence de *information.md* au lancement du rendu
- Lors de la création d'un nouvel épisode, si pas de lien spécifié, définit à l'URL du fichier html généré pour l'épisode

**Correction :**
- Utilisation du mauvais template dans le rendu de index.html

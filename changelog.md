## Changelog de Castbuilder
### 1.1.5
**Correction :**
- Correction lors de plusieurs auteurs

### 1.1.4
**Ajouts :**
- Plus besoin de mettre deux espaces ou de sauter une ligne pour revenir à la ligne
- Utilisation de vrai YAML Front Matter pour les entêtes

### 1.1.3
**Correction :**
- Titre de la page des auteurs
- Metadata de la page des auteurs
- Correction problème avec les auteurs

### 1.1.2
**Correction :**
- Les chroniques apparaissaient en double dans les pages

### 1.1.1
**Correction :**
- Image pour les fichiers des auteurs

### 1.1.0
#### Author Update
**Ajouts :**
- Ajout des auteurs
- Chaque auteur a sa propre page dans le dossier exporté `au/` et qui indique ses épisodes
- Ajout de la page `auteurs.html` qui présente les différents auteurs
- Ajout du nom des auteurs dans les fichiers des épisodes
- Ajout d'un lien vers la page d'un auteur dans les épisodes

**Une fois la mise à jour faite, utilisez `castbuilder init` pour réavoir une arborescence propre! Vos fichiers seront concervés.**

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

(Les idées de texte uniquement présent sur le site web ou sur le flux RSS viennent de Podcastics!)

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
- Correction du copyright

### 1.0.14
**Ajouts :**
- Taille des fichiers dans le flux
- Possibilitée de définir à partir de quel endroit on fait chacune des commandes
- Vérification de la présence de *information.md* au lancement du rendu
- Lors de la création d'un nouvel épisode, si pas de lien spécifié, définit à l'URL du fichier html généré pour l'épisode

**Correction :**
- Utilisation du mauvais template dans le rendu de index.html

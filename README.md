# castbuilder

[![NPM Version](http://img.shields.io/npm/v/castbuilder.svg?style=flat)](https://www.npmjs.org/package/castbuilder)
[![NPM Downloads](https://img.shields.io/npm/dm/castbuilder.svg?style=flat)](https://npmcharts.com/compare/castbuilder?minimal=true)
[![Install Size](https://packagephobia.now.sh/badge?p=castbuilder)](https://packagephobia.now.sh/result?p=castbuilder)
![Licence](https://img.shields.io/npm/l/castbuilder)

Un générateur de site statique pour le podcast. Une fois installé utilisez
- `castbuilder init` depuis votre dossier pour initialiser l'arborescence
- `castbuilder render` pour générer votre site
- `castbuilder new` pour créer un nouvel épisode. Utilisez `castbuilder new -e` pour avoir une création interractive

## Informations
Attention! Ce projet n'est pas fait pour les gros projets de flux RSS. Il est plutôt là pour servir de complément à un flux principal, ou pour quelques épisodes, ou encore si vous avez besoin d'un flux vraiment sur votre site web. Si vous voulez un flux plus résistant, avec une belle interface graphique et hébergé en ligne gratuitement, vous pouvez utiliser [Podcloud](https://podcloud.fr/). Castbuilder est un peut pensé comme son petit frère spirituel, qui est là pour avoir les fonctions de bases.

Autre information, ce projet est encore en cours de développement. Il fonctionne en l'état, mais est loin d'être parfait! Si vous rencontrez des problèmes, n'hésitez pas à me les reporter dans les Issues ou [sur Twitter](https://twitter.com/bigaston) !

J'ai quelques idées d'améliorations dans le futur, n'hésitez pas à suivre le développement du projet ici même dans la partie projet!

## Instalation 
Pour installer le module, il faut commencer par télécharger [NodeJS](https://nodejs.org/en/) puis executez la commande :
```
npm install castbuilder -g
```

Le module est installé 🎉!

## Utilisation
Rnedez vous dans le dossier où vous souhaitez installer votre site web (vous pourrez de toute façon le déplacer plus tard!) et executez dans un terminal de commande :
```
castbuilder init
```

Tous les fichiers par défauts seront installés à ce moment là. Petit explication des fichers. Déjà les fichiers sont des fichiers Markdown. Vous pouvez utiliser toute la sythaxe Markdown supportée par Showdown (le module que j'utilise pour transformer le Markdown en HTML). Toutes les infos sont [ici](https://github.com/showdownjs/showdown/wiki/Showdown's-Markdown-syntax).

Alors ouvront le premier fichier, `information.md`. Dedans il y aura toutes les informations globales de votre flux, et la description de celui si. Voici à quoi correspondent les différents champs.
```Markdown
title: Titre de votre podcast
author: Votre nom
email: votre.email@example.com
category: Catégorie iTunes
subcategory: Sous catégorie iTunes
copyright: Le texte présent dans la balise Copyright
type: episodic/serial
image: Le nom de l'image de couverture de votre podcast! Elle doit être dans le dossier img/ (1400x1400 en 72ppi)
link: Le lien où sera accessible ce flux (sans index.html/feed.xml)
keyword: Les tags présents dans le flux
language: Le langage du flux
explicit: yes/no si explicite ou non
------
Sous cette ligne, entrez la description de votre podcast!

Vous pouvez faire de la mise en page en **gras par exemple** mais prenez en compte que tous les lecteurs ne le supporteront pas!
```
Liste des catégories iTunes : [castos.com/itunes-podcast-category-list](https://castos.com/itunes-podcast-category-list/)  
Les langages supportés dans les flux RSS : [rssboard.org/rss-language-codes](http://www.rssboard.org/rss-language-codes)

Maintenant qu'on a vu le fichier information.md on va voir un peu comment créer un épisode! Il suffit de créer un fichier .md dans le dossier `episode/`. Le nom du fichier sera le GUID de votre épisode et son adresse quand la génération d'article pour l'épisode sera en place.

Comme la dernière fois, il y a quelques infos à completer!
```Markdown
title: Titre de votre épisode
author: Auteur de l'épisode
audio: Lien vers le fichier MP3
pubDate: Date de publication (Timestamp Javascript!)
duration: La durée de votre épisode (au format hh:mm:ss ou mm:ss)
image: lien vers l'image, encore une fois présente dans le dossier img/
keyword: les tags de votre épisode sur iTunes
url: L'URL de l'article associé à votre épisode (dans le futur possibilitée qu'il soit généré automatiquement
------
Encore une fois une description *en Markdown*
```
Si vous voulez savoir le timestamp d'une date, vous pouvez utiliser [cet outil](http://www.timestamp.fr/)! Il faudra juste multiplier par 1000 le timestamp donné puisque le Javascript utilise des timestamps en millisecondes.

Voilà! Il ne vous reste plus qu'à ajouter d'autes épisodes si vous le souhaitez en recomançant la manoeuvre!

Maintenant il faudrait créer le flux non? Utilisez simplement la commande dans le même dossier que `information.md` :
```
castbuilder render
```

Vous trouverez votre site web et votre flux RSS dans le dossiet `output/` généré à ce moment! Plus qu'à copier tout ce contenu et à le mettre sur votre hébergement Web!

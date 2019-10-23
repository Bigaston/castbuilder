const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const fetch = require('node-fetch');
const package = require("../package.json");

const error = chalk.bold.red;
const warning = chalk.yellow;
const good = chalk.green;
const info = chalk.bold.blue;

var folder = ["img", "episode", "auteur"]
var files = [
	{
		"origin": "information.md",
		"dest":  "."
	},
	{
		"origin": "episode_example.md",
		"dest": "./episode"
	},
	{
		"origin": "author_example.md",
		"dest": "./auteur"
	}
]

module.exports = (cmd) => {
	main_dir = process.cwd();

	if (cmd.path != undefined) {
		main_dir = pathEvalute(cmd.path)
		console.log(good(`Création de l'arboréscence dans "${main_dir}"`))
		fs.mkdirSync(main_dir, { recursive: true });
	}

	console.log(info("Initialisation du projet\nCréation des dossiers"))

	folder.forEach((f) => {
		try {
			fs.mkdirSync(path.join(main_dir, f));
			console.log(good(`Le dossier "${f}" créé!`))
		} catch(err) {
			if (err.code == 'EEXIST') {
				console.log(warning(`Le dossier "${f}" existe déjà`));
			} else {
				console.log(error(`Erreur inconue lors de la création de "${f}" :\n${err.Error}`))
			}
		}
	})

	console.log(info("\nCopie des fichiers d'exemples"));

	files.forEach((f) => {
		try {
			fs.copyFileSync(path.join(__dirname, "basic_file", f.origin), path.join(main_dir, f.dest, f.origin), fs.constants.COPYFILE_EXCL)
			console.log(good(`Le fichier "${f.origin}" à bien été copié!`))
		} catch(err) {
			if (err.code == "EEXIST") {
				console.log(warning(`Le fichier "${f.origin}" existe déjà, il ne sera pas remplacé`))
			} else {
				console.log(error(`Erreur inconue lors de la copie de "${f.origin}" :\n${err.Error}`))
			}
		}
	})

	console.log(info("Création des fichiers de base terminée!"))

	checkVersion();
}

function pathEvalute(arg_path) {
	if (path.isAbsolute(arg_path)) {
		return arg_path
	} else {
		return path.join(main_dir, arg_path)
	}
}

function checkVersion() {
	fetch("https://raw.githubusercontent.com/Bigaston/castbuilder/master/package.json")
		.then(res => res.json())
		.then(body => {
			if (body.version > package.version) {
				console.log(error(`\n\nUne nouvelle version de Castbuilder est en ligne!\nUtilisez "npm i -g castbuilder" pour mettre à jour!`))
				console.log(error(`Votre version : ${package.version} | Dernière version : ${body.version}`))
			}
		})
}

/*
main_dir:
|- information.md
|- img
	|
|- episodes
    |
*/
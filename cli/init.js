const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const error = chalk.bold.red;
const warning = chalk.yellow;
const good = chalk.green;

var folder = ["img", "episode"]
var files = [
	{
		"origin": "information.md",
		"dest":  "."
	},
	{
		"origin": "episode_example.md",
		"dest": "./episode"
	}
]

module.exports = (args) => {
	main_dir = process.cwd();
	console.log(chalk.bold.blue("Initialisation du projet\nCréation des dossiers"))

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

	console.log(chalk.bold.blue("\nCopie des fichiers d'exemples"));

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
}

/*
main_dir:
|- information.md
|- img
	|
|- episodes
    |
*/
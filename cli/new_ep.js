const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const readline = require('readline');
const fetch = require('node-fetch');
const package = require("../package.json");

const error = chalk.bold.red;
const warning = chalk.yellow;
const good = chalk.green;
const info = chalk.bold.blue;

main_dir = process.cwd();

parametres = {
	"title": "",
	"author": "",
	"audio": "",
	"pubDate": "",
	"duration": "",
	"image": "",
	"keyword": "",
	"url": ""
}

module.exports = (cmd) => {
	if (cmd.path != undefined) {
		main_dir = pathEvalute(cmd.path)
		console.log(good(`Création de l'épisode dans "${path.join(main_dir, "episode")}"`))
	}

	if (!fs.existsSync(path.join(main_dir, "information.md"))) {
		console.log(error(`Le fichier "information.md" n'éxiste pas! Il est nécessaire pour lancer le traitement.`))
		process.exit(1);
	}

	if (cmd.easy != undefined) {
		console.log(info("Mode facile activé! Merci de répondre aux questions suivantes!"))

		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});

		rl.question(info("Quel est le nom de votre épisode?\n> "), (answer) => {
			parametres.title = answer;

			rl.question(info("\nQuel est l'auteur de l'épisode? (laissez vide pour le même que le podcast)\n> "), (answer) => {
				getAuthorInformation(answer, () => {
					rl.question(info("\nQuel est le lien du fichier MP3 de l'épisode?\n> "), (answer) => {
						parametres.audio = answer
					
						rl.question(info("\nQuel est la date de publication? (Format JJ/MM/AAAA HH:MM. Laisser blanc pour maintenant)\n> "), (answer) => {
							if (answer == "") {
								parametres.pubDate = Date.now();
							} else {
								date_heure = answer.split(" ")
								date_split = date_heure[0].split("/")
								heure_split = date_heure[1].split(":")
								create_date = new Date(date_split[2], date_split[1]-1, date_split[0], heure_split[0], heure_split[1])


								parametres.pubDate = create_date.getTime();
							}

							console.log(good("Date entrée : " + (new Date(parametres.pubDate)).toString()));
		
							rl.question(info("\nQuel est la durée de votre épisode? (Format HH:MM:SS ou MM:SS)\n> "), (answer) => {
								parametres.duration = answer;

								rl.question(info("\nQuel est le nom de l'image de l'épisode? (Présente dans le dossier img/. Laissez vide pour la même que le podcast)\n> "), (answer) => {
									getImageInformation(answer, () => {
										rl.question(info("\nQuels sont les tags de votre épisode? (Séparés par une virgule)\n> "), (answer) => {
											parametres.keyword = answer
											rl.question(info("\nQuel est votre numéro de saison? (0 ou vide si il n'y en a pas)\n> "), (answer) => {
												parametres.season = answer

												rl.question(info("\nQuel est votre numéro d'épisode (0 ou vide si il n'y en a pas)\n> "), (answer) => {
													parametres.episode = answer

													rl.question(info("\nQuelle est l'URL associée à votre épisode? (Laissez vide pour la définir automatiquement en fonction du site généré)\n> "), (answer) => {
														parametres.url = answer;

														rl.question(info("\nQuel est le type de l'épisode? (full, trailer, bonus)\n> "), (answer) => {
															parametres.episodeType = answer;

															rl.question(info("\nQuelle est l'accéssibilitée de votre épisode? (all, feed, website, unlisted)\n> "), (answer) => {
																parametres.privacy = answer;

																rl.question(info("\nQuel est l'id unique de votre épisode (utilisé dans le GUID)\n> "), (answer) => {
																	rl.close();
				
																	generationFichier(answer);
																})
															})
														})
													})
												})
											})
										})
									})
								})
							})
						})
					})
				});				
			})
		});
	} else {
		generationFichier("new_episode")
	}
}

function getAuthorInformation(answer, _callback) {
	if (answer == "") {
		parametres.author = "";

		let info = readline.createInterface({
			input: fs.createReadStream(path.join(main_dir, "information.md"))
		})
		
		info.on("line", (line) => {
			let cut = line.split(" ");
						
			if(cut[0].replace(":", "") == "author") {
				parametres.author = cut.slice(1).join(" ");
			}
		})
		
		info.on("close", (line) => {
			if (parametres.author == "") {
				console.log(error("Le nom de l'auteur est vide!"))
				parametres.author = "";
			} else {
				console.log(good("Auteur importé : " + parametres.author))
			}

			_callback();
		})
	} else {
		parametres.author = answer
		_callback();
	}
}

function getImageInformation(answer, _callback) {
	if (answer == "") {
		parametres.image = "";

		let info = readline.createInterface({
			input: fs.createReadStream(path.join(main_dir, "information.md"))
		})
		
		info.on("line", (line) => {
			let cut = line.split(" ");
						
			if(cut[0].replace(":", "") == "image") {
				parametres.image = cut.slice(1).join(" ");
			}
		})
		
		info.on("close", (line) => {
			if (parametres.image == "") {
				console.log(error("L'image est vide!"))
				parametres.image = "";
			} else {
				console.log(good("Image importée : " + parametres.image))
			}

			_callback();
		})
	} else {
		parametres.image = answer
		_callback();
	}
}

function getUrlInformation(guid, _callback) {
	if (parametres.url == "") {
		let info = readline.createInterface({
			input: fs.createReadStream(path.join(main_dir, "information.md"))
		})
		
		info.on("line", (line) => {
			let cut = line.split(" ");
						
			if(cut[0].replace(":", "") == "link") {
				parametres.url = cut.slice(1).join(" ") + "/ep/" + guid + ".html";
			}
		})
		
		info.on("close", (line) => {
			if (parametres.url == "") {
				console.log(error("\nL'url de base n'est pas définie dans information.md est vide!"))
				parametres.url = "";
			} else {
				console.log(good("\nURL de l'épisode généré : " + parametres.url))
			}

			_callback();
		})
	} else {
		_callback();
	}
}


function generationFichier(guid) {
	chaine_fichier = "";

	key = Object.keys(parametres);

	key.forEach((cle) => {
		chaine_fichier = chaine_fichier + cle + ": " + parametres[cle] + "\n"
	})

	getUrlInformation(guid, () => {
		chaine_fichier = chaine_fichier + "------\n";
		try {
			fs.writeFileSync(path.join(main_dir, "episode", guid + ".md"), chaine_fichier)
			console.log(good("Episode généré et disponible dans le dossier episode/ sous le nom " + guid + ".md !"))
		} catch (err) {
			console.log(err)
		}
	})

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
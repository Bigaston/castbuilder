const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const render_ep = require("./submodule/render_ep.js")
const checkVersion = require("./submodule/checkversion.js")
const render_author = require("./submodule/render_author.js")

const error = chalk.bold.red;
const warning = chalk.yellow;
const good = chalk.green;
const inf = chalk.blue.bold;

main_dir = process.cwd();

module.exports = (cmd) => {
	if (cmd.path != undefined) {
		main_dir = pathEvalute(cmd.path)
		console.log(good(`Création à partir de dans "${main_dir}"`))
	}

	if (!fs.existsSync(path.join(main_dir, "information.md"))) {
		console.log(error(`Le fichier "information.md" n'éxiste pas! Il est nécessaire pour lancer le traitement.`))
		process.exit(1);
	}
	
	console.log(inf(`Démarage de la création du site.`))

	render_author.import((author) => {
		render_ep.import((information) => {
			author = render_ep.render(author, information, cmd);

			render_author.render(author, information, cmd);
	
			checkVersion();
		});
	})
}

function pathEvalute(arg_path) {
	if (path.isAbsolute(arg_path)) {
		return arg_path
	} else {
		return path.join(main_dir, arg_path)
	}
}

/*
main_dir:
|- information.md
|- img
	|
|- episodes
	|
|- animateur
	|
*/
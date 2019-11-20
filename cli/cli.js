#!/usr/bin/env node

const package = require("../package.json")
const init = require("./init.js")
const render = require("./render.js")
const new_ep = require("./new_ep.js")
const chalk = require("chalk");
const command = require('commander');

const [,, ...args] = process.argv

command
	.version(package.version)
	.name("castbuilder")

command
	.command("init")
	.description("Crée l'arborescence basique des fichiers")
	.arguments("[path]")
	.action((main_path, cmd) => {
		init({"path": main_path});
	})

command
	.command("render")
	.description("Crée le site web et le flux RSS à partir des fichiers présents")
	.option("-o, --override", "Supprime le fichier output/ avant de créer l'arborescence")
	.option("-p, --template-podcast <file path>", "Spécifie le fichier .mustache qui servira de template pour le rendu de l'index")
	.option("-e, --template-episode <file path>", "Spécifie le fichier .mustache qui servira de template pour le rendu des épisodes")
	.option("-f, --template-feed <file path>", "Spécifie le fichier .xsl qui servira de template pour l'affichage du flux RSS")
	.option("-a, --template-author <file path>", "Spécifie le fichier .mustache qui servira de template pour le rendu des auteurs")
	.option("-i, --template-author-index <file path>", "Spécifie le fichier .mustache qui servira de template pour le rendu de l'index des auteurs")
	.arguments("[path]")
	.action((main_path, cmd) => {
		render({"override": cmd.override, "templatePodcast": cmd.templatePodcast, "templateEpisode": cmd.templateEpisode, "templateFeed": cmd.templateFeed, "path": main_path});
	})

command
	.command("new")
	.description("Crée un nouvel épisode")
	.option("-e, --easy", "Active le mode facile")
	.option("-t, --template <file path>", "Spécifie un template.md pour avoir une description par défaut")
	.arguments("[path]")
	.action((main_path, cmd) => {
		new_ep({"easy":cmd.easy, "path": main_path, "template": cmd.template});
	})

command.on('--help', function(){
	console.log("\n  > Utilisez castbuilder [nom d'une commande] --help pour avoir plus d'informations sur les options d'une commande")
});


command.parse(process.argv)

if (args.length == 0) {
	command.outputHelp((txt) => {
		return chalk.blue(txt)
	})
}
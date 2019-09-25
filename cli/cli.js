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
	.option("-e, --easy", "Active le mode facile")
	.option("-o, --override", "Supprime le fichier output/ avant de créer l'arborescence")

command
	.command("init")
	.description("Crée l'arborescence basique des fichiers")
	.action((cmd, env) => {
		init();
	})

command
	.command("render")
	.description("Crée le site web et le flux RSS à partir des fichiers présents")
	.action((cmd, env) => {
		render(command.override);
	})

command
	.command("new")
	.description("Crée un nouvel épisode")
	.action((cmd, env) => {
		new_ep(command.easy);
	})


command.parse(process.argv)

if (args.length == 0) {
	command.outputHelp((txt) => {
		return chalk.blue(txt)
	})
}
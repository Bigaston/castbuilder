#!/usr/bin/env node

const package = require("../package.json")
const init = require("./init.js")

const [,, ...args] = process.argv

if (args.length == 0) {
	console.log(`=== Welcome to Webcast (Version : ${package.version}) ===
Commands are:
- init : Create the basic organisation of your website`)
} else {
	switch(args[0]) {
		case "init":
			init(args);
	}
}
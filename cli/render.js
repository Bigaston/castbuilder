const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const readline = require('readline');
const rss = require("rss");
const showdown  = require('showdown');
const url = require("url");

const error = chalk.bold.red;
const warning = chalk.yellow;
const good = chalk.green;
const inf = chalk.blue.bold;

const valid_info_tag = ["title", "author", "email", "category", "subcategory", "copyright", "type", "image", "link", "keyword", "language", "explicit"];
const valid_ep_tag = ["title", "author", "audio", "pubDate", "duration", "image", "keyword"];

var information = {
	"items": []
};

module.exports = (args) => {
	main_dir = process.cwd();
	console.log(inf(`Démarage de la création du site.`))

	let is_desc = false;
	let desc;

	let info = readline.createInterface({
		input: fs.createReadStream(path.join(main_dir, "information.md"))
	})

	info.on("line", (line) => {
		if (is_desc == false) {
			if (line.match(/------[-]*/) != undefined) {
				is_desc = true;
			} else {
				let cut = line.split(" ");
				
				if(valid_info_tag.includes(cut[0].replace(":", ""))) {
					information[cut[0].replace(":", "")] = cut.slice(1).join(" ");
				}
			}
		} else {
			if (desc == undefined) {
				desc = line;
			} else {
				desc = desc + "\n" + line;
			}
		}
	})

	info.on("close", (line) => {
		information.description = desc + "";
		console.log(good(`Fichier "information.md" importé!`))
		readEpisode();
	})

	function readEpisode() {
		var files = fs.readdirSync(path.join(main_dir, "episode"));
		
		var nb_file_read = 0;

		check = setInterval(checkReadEpisode, 500);

		files.forEach((f, i) => {
			let is_desc_ep = false;
			let desc_ep;

			information.items[i] = {};

			information.items[i].url = f.replace(".md", "");
		
			let ep = readline.createInterface({
				input: fs.createReadStream(path.join(main_dir, "episode", f))
			})
		
			ep.on("line", (line) => {
				if (is_desc_ep == false) {
					if (line.match(/------[-]*/) != undefined) {
						is_desc_ep = true;
					} else {
						let cut = line.split(" ");
						
						if(valid_ep_tag.includes(cut[0].replace(":", ""))) {
							information.items[i][cut[0].replace(":", "")] = cut.slice(1).join(" ");
						}
					}
				} else {
					if (desc_ep == undefined) {
						desc_ep = line;
					} else {
						desc_ep = desc_ep + "\n" + line;
					}
				}
			})
		
			ep.on("close", (line) => {
				information.items[i].description = desc_ep + "";
				console.log(good(`Fichier "${f}" importé!`))
				nb_file_read++;
			})
		})
	
		function checkReadEpisode() {
			if (nb_file_read >= files.length) {
				console.log(good("\nTous les fichiers ont été importés!"))
				clearInterval(check);
				renderXML();
			}
		}
	}

	function renderXML() {
		try {
			fs.mkdirSync(path.join(main_dir, "output"));
			console.log(good(`Dossier de sortie créé`))
		} catch(err) {
			if (err.code == 'EEXIST') {
				console.log(warning(`Le dossier "output" existe déjà`));
			} else {
				console.log(error(`Erreur inconue lors de la création de "output" :\n${err.Error}`))
			}
		}
		
		console.log(inf("Création du flux RSS"));
		var feed = new rss({
			title: information.title,
			description: new showdown.Converter().makeHtml(information.description),
			generator: "Webcast",
			feed_url: url.resolve(information.link, "/feed.xml"),
			site_url: information.link,
			image_url: url.resolve(information.link, "img/" + information.image),
			copyright: information.copyright,
			language: information.language,
			custom_namespaces: {
				'itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd'
			},
			custom_elements: [
				{"itunes:author" : information.author},
				{"itunes:owner" : [
					{"itunes:email" : information.email}
				]},
				{"itunes:category" : [
					{_attr: {
						text: information.category
					}},
					{'itunes:category': {
						_attr: {
						  text: information.subcategory
						}
					}}
				]},
				{"itunes:summary": information.description},
				{"itunes:type" : "episodic"},
				{"itunes:image": [
					{_attr: {
						href: url.resolve(information.link, "img/" + information.image)
					}}
				]},
				{"itunes:explicit" : information.explicit}
			]
		})

		information.items.forEach((item) => {
			feed.item({
				title: item.title,
				description: new showdown.Converter().makeHtml(item.description),
				url: url.resolve(information.link, "ep/" + item.url + ".html"),
				guid: item.url,
				author: item.author,
				date: new Date(parseInt(item.pubDate)),
				enclosure: item.audio,
				custom_elements: [
					{'itunes:author': item.author},
					{'itunes:subtitle': item.description},
					{'itunes:image': {
					  _attr: {
						href: url.resolve(information.link, "img/" + information.image)
					  }
					}},
					{'itunes:duration': item.duration},
					{"itunes:episodeType": "full"}
				  ]
			})
		})


		fs.writeFileSync(path.join(main_dir, "output", "feed.xml"), feed.xml({indent: true}));
	}
}

/*
main_dir:
|- information.md
|- img
	|
|- episodes
    |
*/
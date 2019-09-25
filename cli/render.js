const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const readline = require('readline');
const rss = require("rss");
const showdown  = require('showdown');
const mustache = require("mustache")

const error = chalk.bold.red;
const warning = chalk.yellow;
const good = chalk.green;
const inf = chalk.blue.bold;

const valid_info_tag = ["title", "author", "email", "category", "subcategory", "copyright", "type", "image", "link", "keyword", "language", "explicit"];
const valid_ep_tag = ["title", "author", "audio", "pubDate", "duration", "image", "keyword", "url", "season", "episode", "episodeType"];

var information = {
	"items": []
};

module.exports = () => {
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

			information.items[i].guid = f.replace(".md", "");
		
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
				renderFiles();
			}
		}
	}

	function renderFiles() {
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

		try {
			fs.mkdirSync(path.join(main_dir, "output", "ep"));
			console.log(good(`Dossier "ep" créé`))
		} catch(err) {
			if (err.code == 'EEXIST') {
				console.log(warning(`Le dossier "ep" existe déjà`));
			} else {
				console.log(error(`Erreur inconue lors de la création de "ep" :\n${err.Error}`))
			}
		}

		information.items.sort((a,b) => {
			return -(a.pubDate-b.pubDate);
		});
		
		console.log(inf("Création du flux RSS"));
		var feed = new rss({
			title: information.title,
			description: new showdown.Converter().makeHtml(information.description),
			generator: "Castbuilder",
			feed_url: information.link + "/feed.xml",
			site_url: information.link,
			image_url: information.link + "/img/" + information.image,
			copyright: information.copyright,
			language: information.language,
			custom_namespaces: {
				'itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
				"google": "http://www.google.com/schemas/play-podcasts/1.0"
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
						href: information.link + "/img/" + information.image
					}}
				]},
				{"itunes:explicit" : information.explicit}
			]
		})

		information.items.forEach((item) => {
			//url.resolve(information.link, "ep/" + item.guid + ".html")

			ep_info = {
				title: item.title,
				description: new showdown.Converter().makeHtml(item.description),
				url: item.url,
				guid: item.guid,
				author: item.author,
				date: new Date(parseInt(item.pubDate)),
				custom_elements: [
					{'itunes:author': item.author},
					{'itunes:subtitle': item.description},
					{'itunes:image': {
					  _attr: {
						href: information.link + "/img/" + information.image
					  }
					}},
					{'itunes:duration': item.duration},
					{"itunes:episodeType": "full"},
					{"enclosure" : {
						_attr: {
							url: item.audio,
							type: "audio/mpeg"
						}
					}}
				]
			}

			if (item.episode != "") {
				ep_info.custom_elements.push({"itunes:episode": item.episode})
			}

			if (item.season != "") {
				ep_info.custom_elements.push({"itunes:season" : item.season})
			}

			if (item.episodeType != "") {
				ep_info.custom_elements.push({"itunes:episodeType" : item.episodeType})
			}

			feed.item(ep_info)
		})

		xml_sortie = feed.xml({indent:true}).replace(`<?xml version="1.0" encoding="UTF-8"?>`, `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="feed_style.xsl" ?>`)
		fs.writeFileSync(path.join(main_dir, "output", "feed.xml"), xml_sortie);
		console.log(good("FLux RSS généré"));

		console.log(inf("\nCopie des images"));
		try {
			fs.mkdirSync(path.join(main_dir, "output", "img"));
			console.log(good(`Dossier des images créé`))
		} catch(err) {
			if (err.code == 'EEXIST') {
				console.log(warning(`Le dossier "img" existe déjà`));
			} else {
				console.log(error(`Erreur inconue lors de la création de "img" :\n${err.Error}`))
			}
		}

		var img = fs.readdirSync(path.join(main_dir, "img"));

		img.forEach((i) => {
			fs.copyFileSync(path.join(main_dir, "img", i), path.join(main_dir, "output", "img", i))
			console.log(good(`Copie de "${i}" effectuée`))
		})

		console.log(good("Toutes les images ont été copiés!"))

		console.log(inf("\nGénération des fichiers HTML"));

		try {
			fs.copyFileSync(path.join(__dirname, "basic_file", "style.css"), path.join(main_dir, "output", "style.css"), fs.constants.COPYFILE_EXCL)
			console.log(good(`Le fichier "style.css" à bien été copié!`))
		} catch(err) {
			if (err.code == "EEXIST") {
				console.log(warning(`Le fichier "style.css" existe déjà, il ne sera pas remplacé`))
			} else {
				console.log(error(`Erreur inconue lors de la copie de "style.css" :\n${err.Error}`))
			}
		}

		try {
			fs.copyFileSync(path.join(__dirname, "basic_file", "ep_style.css"), path.join(main_dir, "output/ep", "ep_style.css"), fs.constants.COPYFILE_EXCL)
			console.log(good(`Le fichier "ep_style.css" à bien été copié!`))
		} catch(err) {
			if (err.code == "EEXIST") {
				console.log(warning(`Le fichier "ep_style.css" existe déjà, il ne sera pas remplacé`))
			} else {
				console.log(error(`Erreur inconue lors de la copie de "ep_style.css" :\n${err.Error}`))
			}
		}

		try {
			fs.copyFileSync(path.join(__dirname, "basic_file", "ep_script.js"), path.join(main_dir, "output/ep", "ep_script.js"), fs.constants.COPYFILE_EXCL)
			console.log(good(`Le fichier "ep_script.js" à bien été copié!`))
		} catch(err) {
			if (err.code == "EEXIST") {
				console.log(warning(`Le fichier "ep_style.css" existe déjà, il ne sera pas remplacé`))
			} else {
				console.log(error(`Erreur inconue lors de la copie de "ep_style.css" :\n${err.Error}`))
			}
		}

		try {
			fs.copyFileSync(path.join(__dirname, "basic_file", "feed_style.xsl"), path.join(main_dir, "output", "feed_style.xsl"), fs.constants.COPYFILE_EXCL)
			console.log(good(`Le fichier "feed_style.xsl" à bien été copié!`))
		} catch(err) {
			if (err.code == "EEXIST") {
				console.log(warning(`Le fichier "feed_style.xsl" existe déjà, il ne sera pas remplacé`))
			} else {
				console.log(error(`Erreur inconue lors de la copie de "feed_style.xsl" :\n${err.Error}`))
			}
		}

		var index_template = fs.readFileSync(path.join(__dirname, "basic_file", "index.mustache"), "utf8");

		var render_object = {
			"podcast_title": information.title,
			"podcast_author": information.author,
			"image_link": "img/" + information.image,
			"podcast_description": new showdown.Converter().makeHtml(information.description),
			"podcast_copyright": information.copyright,
			"episodes": []
		}

		information.items.forEach((ep) => {
			pub_date = new Date(parseInt(ep.pubDate))
			render_object.episodes.push({
				"ep_image": "img/" + ep.image,
				"ep_title": ep.title,
				"ep_desc": new showdown.Converter().makeHtml(ep.description),
				"duree_ep": ep.duration,
				"date_sortie": pub_date.getDate() + "/" + (pub_date.getMonth()+1) + "/" + pub_date.getFullYear() + " " + addZero((pub_date.getHours()-2)) + ":" + addZero(pub_date.getMinutes()),
				"file_link": ep.audio,
				"ep_guid": ep.guid
			})
		})

		var index_html = mustache.render(index_template, render_object)

		fs.writeFileSync(path.join(main_dir, "output", "index.html"), index_html);
		console.log(good("Fichier index.html créé"))

		console.log(inf(`\nCréation des fichiers des épisodes dans "ep/"`))

		ep_template = fs.readFileSync(path.join(__dirname, "basic_file", "episode.mustache"), "utf8");

		information.items.forEach((ep) => {
			pub_date = new Date(parseInt(ep.pubDate))
			render_object = {
				"ep_image": "../img/" + ep.image,
				"ep_title": ep.title,
				"ep_desc": new showdown.Converter().makeHtml(ep.description),
				"duree_ep": ep.duration,
				"podcast_title": information.title,
				"podcast_author": information.author,
				"podcast_copyright": information.copyright,
				"date_sortie": pub_date.getDate() + "/" + (pub_date.getMonth()+1) + "/" + pub_date.getFullYear() + " " + addZero((pub_date.getHours()-2)) + ":" + addZero(pub_date.getMinutes()),
				"file_link": ep.audio
			}

			var ep_html = mustache.render(ep_template, render_object)
			fs.writeFileSync(path.join(main_dir, "output/ep", ep.guid + ".html"), ep_html);
			console.log(good(`Fichier "${ep.guid}.html" créé`))			
		})
	}
}

function addZero(val) {
    if (val >= 10) {
      return "" + val;
    } else {
      return "0" + val
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
const showdown  = require('showdown');
const mustache = require("mustache");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const readline = require("readline")

const error = chalk.bold.red;
const warning = chalk.yellow;
const good = chalk.green;
const inf = chalk.blue.bold;

const valid_author_tag = ["name", "image", "twitter", "instagram", "twitch", "youtube", "facebook", "website"]

module.exports.import = (_callback) => {
    var author = {}

    var files = fs.readdirSync(path.join(main_dir, "auteur"));
	var nb_file_read = 0;

    check = setInterval(checkReadAuthor, 500);
    
    console.log(inf("Import des auteurs..."))

    files.forEach((f, i) => {
        let is_desc_ep = false;
        let desc_ep;
        let this_author = {
            id: f.replace(".md", ""),
            ep: []
        }

        let au = readline.createInterface({
            input: fs.createReadStream(path.join(main_dir, "auteur", f))
        })
    
        au.on("line", (line) => {
            if (is_desc_ep == false) {
                if (line.match(/------[-]*/) != undefined) {
                    is_desc_ep = true;
                } else {
                    let cut = line.split(" ");
                    
                    if(valid_author_tag.includes(cut[0].replace(":", ""))) {
                        this_author[cut[0].replace(":", "")] = cut.slice(1).join(" ");
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
    
        au.on("close", (line) => {
            this_author.description = desc_ep + "";
            console.log(good(`Fichier "${f}" importé!`))

            author[this_author.name.replace(".md", "").replace(" ", "_").toLowerCase()] = this_author;
            
            nb_file_read++;
        })
    })

    function checkReadAuthor() {
        if (nb_file_read >= files.length) {
            console.log(good("\nTous les fichiers auteurs ont été importés!"))
            clearInterval(check);
            _callback(author);
        }
    }
}

module.exports.render = (author, information, cmd) => {
    console.log(inf("\nDémarage du rendu des pages des auteurs"));

    try {
        fs.mkdirSync(path.join(main_dir, "output", "au"));
        console.log(good(`Dossier "au" créé`))
    } catch(err) {
        if (err.code == 'EEXIST') {
            console.log(warning(`Le dossier "au" existe déjà`));
        } else {
            console.log(error(`Erreur inconue lors de la création de "au" :\n${err.Error}`))
        }
    }

    if (cmd.templateAuthor != undefined) {
        if (path.extname(cmd.templateAuthor) == ".mustache") {
            path_file = pathEvalute(cmd.templateAuthor)

            if (fs.existsSync(path_file)) {
                template_file = path_file;

                console.log(good(`Fichier de template pour l'auteur trouvé dans "${path_file}"`))
            } else {
                console.log(error(`Le fichier "${path.basename(cmd.templateAuthor)}" n'existe pas! Fichier par défaut utilisé`))
                template_file = path.join(__dirname, "../basic_file", "author.mustache")
            }
        } else {
            console.log(error(`Le fichier "${path.basename(cmd.templateAuthor)}" n'est pas un fichier .mustache! Fichier par défaut utilisé`))
            template_file = path.join(__dirname, "../basic_file", "author.mustache")
        }
    } else {
        template_file = path.join(__dirname, "../basic_file", "author.mustache")
    }

    var author_template = fs.readFileSync(template_file, "utf8");

    auteur = Object.keys(author)

    auteur.forEach((a) => {
        au = author[a];

        small_desc = au.description;

        if (small_desc.length > 200) {
            small_desc = small_desc.substring(0,197) + "..."
        }

        var render_object = {
            "podcast_title": information.title,
            "podcast_author": information.author,
            "image_link": "img/" + au.image,
            "author_description": new showdown.Converter().makeHtml(au.description),
            "podcast_copyright": information.copyright,
            "self_link": information.link,
            "author_link": information.link + "/au/" + au.id + ".html",
            "small_desc": small_desc,
            "author_name": au.name,
            "episodes": []
        }

        au.ep.forEach((ep) => {
            if (ep.privacy == undefined || ep.privacy == "all" || ep.privacy == "website" || !privacy_type.includes(ep.privacy)) {
                pub_date = new Date(parseInt(ep.pubDate))
                render_object.episodes.push({
                    "ep_image": "img/" + ep.image,
                    "ep_title": ep.title,
                    "ep_desc": new showdown.Converter().makeHtml(ep.description.replace("%website%", "").replace("%/website%", "").replace(/%feed%.*%\/feed%/gs, "")),
                    "duree_ep": ep.duration,
                    "date_sortie": pub_date.getDate() + "/" + (pub_date.getMonth()+1) + "/" + pub_date.getFullYear() + " " + addZero((pub_date.getHours()-2)) + ":" + addZero(pub_date.getMinutes()),
                    "file_link": ep.audio,
                    "ep_author": ep.author,
                    "ep_guid": ep.guid
                })
            }
        })

        var author_html = mustache.render(author_template, render_object)

        fs.writeFileSync(path.join(main_dir, "output/au", au.id + ".html"), author_html);
        console.log(good(`Fichier ${au.id}.html créé`))
    })
}

function addZero(val) {
    if (val >= 10) {
      return "" + val;
    } else {
      return "0" + val
    }
}
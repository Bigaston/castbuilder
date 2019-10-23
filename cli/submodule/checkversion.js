const fetch = require('node-fetch');
const package = require("../../package.json")

module.exports = () => {
    fetch("https://raw.githubusercontent.com/Bigaston/castbuilder/master/package.json")
        .then(res => res.json())
        .then(body => {
            if (body.version > package.version) {
                console.log(error(`\n\nUne nouvelle version de Castbuilder est en ligne!\nUtilisez "npm i -g castbuilder" pour mettre à jour!`))
                console.log(error(`Votre version : ${package.version} | Dernière version : ${body.version}`))
            }
        })
}
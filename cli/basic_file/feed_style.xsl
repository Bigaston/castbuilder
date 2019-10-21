<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
    <xsl:output method="html" version="1.0" encoding="ISO-8859-1" indent="yes"/>
    <xsl:template match="/">
        <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <meta charset="UTF-8" />
                <title><xsl:value-of select="/rss/channel/title"/></title>
                <style type="text/css">
                    @import url('https://fonts.googleapis.com/css?family=Roboto');
                    @import url("https://use.fontawesome.com/releases/v5.8.1/css/all.css");

                    body {
                        font-family: 'Roboto', sans-serif;
                        background-color: #ECEFF1;
                    }

                    header {
                        border: solid 1px #ABB2B9;
                        background-color: #F8F9F9;
                        border-radius: 2px 2px 0px 0px;
                        box-shadow: 2px 2px #ABB2B9;
                    }

                    section {
                        border: solid 1px #ABB2B9;
                        margin-top: 5px;
                        background-color: #FDFEFE;
                        box-shadow: 2px 2px #ABB2B9;
                    }

                    footer {
                        border: solid 1px #ABB2B9;
                        background-color: #F8F9F9;
                        border-radius: 2px 2px 0px 0px;
                        box-shadow: 2px 2px #ABB2B9;
                        margin-top: 20px;
                    }

                    footer > p {
                        margin: 5px;
                    }

                    #podlogo {
                        width: 100px;
                        border-radius: 5px;
                    }
                    
                    /*Article de podcast*/
                    .podcast {
                    display: flex;
                    padding: 10px;
                    transition-property: max-height;
                    border-bottom: solid 1px #ABB2B9;
                    transition-duration: 0.5s;
                    overflow: hidden;
                    }

                    .podcast:last-child {
                        border-bottom: none;
                    }

                    .leftDiv {
                        display: flex;
                        flex-direction: column;
                        max-width: 120px;
                    }

                    .leftDiv > p {
                        margin: 0px;
                    }

                    .leftDiv > a, .leftDiv > u {
                        color: black;
                    }

                    .leftDiv > img {
                        height: 100px;
                        min-width: 100px;
                        border-radius: 5px;
                    }

                    .leftDiv > div > i {
                        margin-top: 5px;
                        font-size: 20px;
                    }

                    .leftDiv > div > i:hover {
                        cursor: pointer;
                    }

                    .rightDiv {
                        display: flex;
                        flex-direction: column;
                        margin: 0px;
                        padding: 0px;
                        text-align: left;
                    }

                    .rightDiv > h2 {
                        margin-left: 5px;
                        margin-top: 0px;
                        margin-bottom: 2px;
                    }

                    .rightDiv > h3 {
                        margin-left: 5px;
                        margin-top: 0px;
                        margin-bottom: 4px;
                    }

                    /* Mise en page de la description */
                    .description {
                        margin-left: 5px;
                        margin-top: 0px;
                        margin-bottom: 2px;
                        padding-left: 5px;
                        border-left: solid 3px #2C3E50;
                        border-radius: 3px 0px 0px 3px;
                    }

                    .description > p {
                        margin-top: 0px;
                        margin-bottom: 2px;
                    }

                    .description > h2 {
                        margin-top: 5px;
                        margin-bottom: 2px;
                    }

                    .description > h3 {
                        margin-top: 5px;
                        margin-bottom: 2px;
                    }

                    .description a, .description u {
                        text-decoration: none;
                        color: #17202A;
                        border-bottom: dotted 1px #17202A;
                        word-wrap: break-word;
                    }

                    center > p:first-child {
                        margin-bottom:2px;
                        font-size: 12px;
                        color: #566573;
                    }

                    audio {
                        width: 100%;
                        margin: 3px;
                    }
                </style>
            </head>

            <body>
                <center>
                    <p>Ceci est un flux RSS rendu sous forme de site web. Pour utiliser le flux, copiez simplement l'URL de votre navigateur</p>
                    <header>
                        <h1><xsl:value-of select="/rss/channel/title"/></h1>
                        <img id="podlogo">
                            <xsl:attribute name="src">
                                <xsl:value-of select="/rss/channel/image/url"/>
                            </xsl:attribute>
                            <xsl:attribute name="alt">
                                <xsl:value-of select="/rss/channel/title"/>
                            </xsl:attribute>
                        </img>
                        <div><xsl:value-of select="/rss/channel/description" disable-output-escaping="yes"/></div>
                    </header>

                    <section>
                        <xsl:for-each select="/rss/channel/item">
                            <article class="podcast">
                                <div class="leftDiv">
                                    <img>
                                        <xsl:attribute name="src">
                                            <xsl:value-of select="itunes:image/@href"/>
                                        </xsl:attribute>
                                        <xsl:attribute name="title">
                                            <xsl:value-of select="title"/>
                                        </xsl:attribute>
                                    </img>
                                    <p>⏱<xsl:value-of select="itunes:duration" disable-output-escaping="yes"/></p>
                                    <p>📅<xsl:value-of select="pubDate" /></p>
                                    <a>
                                        <xsl:attribute name="href">
                                            <xsl:value-of select="enclosure/@url"/>
                                        </xsl:attribute>
                                        <xsl:attribute name="target">_blank</xsl:attribute>
                                    💾Télécharger</a>
                                </div>
                                <div class="rightDiv">
                                    <h2><xsl:value-of select="title"/></h2>
                                    <audio>
                                        <xsl:attribute name="controls" />
                                        <xsl:attribute name="src">
                                            <xsl:value-of select="enclosure/@url"/>
                                        </xsl:attribute>
                                    </audio>
                                    <div class="description">
                                        <xsl:value-of select="description" disable-output-escaping="yes"/>
                                    </div>
                                </div>
                            </article>
                        </xsl:for-each>
                    </section>

                    <footer>
                        <p><xsl:value-of select="/rss/channel/title"/> par <xsl:value-of select="/rss/channel/itunes:author"/></p>
                        <p>© <xsl:value-of select="/rss/channel/copyright"/></p>
                    </footer>
                </center>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
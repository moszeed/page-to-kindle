(function() {

    "use strict";

    var _           = require('underscore');
    var fs          = require('fs');
    var when        = require('when');
    var guard       = require('when/guard')
    var phantom     = require('phantom');
    var read        = require('node-readability');
    var nodemailer  = require('nodemailer');

    var Main = {};

        Main.MailTransporter        = null;
        Main.MailTransporterParams  = null;


        Main._cleanUpUrl = function(url) {

            url = url.replace(/[^a-zA-Z0-9 ]/g, "");
            url = url.replace("http", "");
            url = url.replace("html", "");
            url = url.replace("www", "");
            url = url.substring(0, 30);
            url = url.trim();

            return url;
        };


        Main._connectMail = function(params) {

            params = params || {};

            return when.promise(function(resolve, reject) {

                if (params.length === 0) {
                    reject('no imap params given');
                    return;
                }

                if (Main.MailTransporter === null || (
                        Main.MailTransporter       !== null &&
                        Main.MailTransporterParams !== params.transporter
                    )) {

                        Main.MailTransporterParams  = params.transporter;
                        Main.MailTransporter        = nodemailer.createTransport(params.transporter);

                        resolve();
                }
            });
        };

        Main._sendMail = function(url, title, params) {

            return when.promise(function(resolve, reject) {

                Main._connectMail(params)
                    .then(function() {

                        var mailOptions = _.extend({
                                from        : params.transporter.auth.user || null,
                                subject     : 'convert',
                                attachments : [{
                                    filename : Main._cleanUpUrl(title) + '.pdf',
                                    path     : Main._cleanUpUrl(url) + '.pdf'
                                }]

                            }, params.mailOptions);

                        Main.MailTransporter.sendMail(mailOptions, function(error, info) {
                            if (error) reject(error);
                            else resolve();
                        });
                    });
            });
        };


        Main._cleanup = function(url) {

            return when.promise(function(resolve, reject) {
                fs.unlink(Main._cleanUpUrl(url) + '.pdf', function(err) {
                    if (err) reject(err);
                    else resolve();
                });
            });
        };


        Main._getContent = function(url) {

            return when.promise(function(resolve, reject) {
                read(url, function(err, article, meta) {
                    if (err) reject(err);
                    else resolve(article);
                });
            });
        };

        Main._createPDF = function(url, article) {

            return when.promise(function(resolve, reject) {

                var content = article.content + '<hr> <br><br> Source: <a href="' + url + '">' + url + '</a>';

                phantom.create(function(ph){
                    ph.createPage(function(page) {

                        page.setContent(content);
                        setTimeout(function() {
                            page.render(Main._cleanUpUrl(url) + '.pdf', function() {
                                ph.exit();
                                resolve();
                            });
                        }, 1000);
                    });
                });
            });
        };


        Main.send = function(url, params) {

            return Main._getContent(url)
                .then(function(article) {
                    return Main._createPDF(url, article)
                        .then(function() {
                            return Main._sendMail(url, article.title, params);
                        });
                })
                .then(function() {
                    return Main._cleanup(url);
                });
        };

    exports.send = Main.send;

})();

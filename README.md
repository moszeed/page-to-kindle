#page-to-kindle
send any webpage to your kindle

####How it works
---
1. read the Page with [*node-readability*](https://github.com/luin/node-readability)
2. write content to pdf with [*phantomjs*](https://github.com/sgentle/phantomjs-node)
3. send pdf via Email ([*nodemailer*](https://github.com/andris9/Nodemailer)) to the Amazon Kindle convert Service

#####Usage example
---
    var pageToKindle = require('pageToKindle');

    var sendParams = {

        mailOptions : {
        	to : 'your-kindle-mail-adress@kindle.com'
        },

        //Nodemailer Transporter
        transporter : {
        	service : 'Gmail',
            	auth    : {
                	user : 'gmail-user-name',
                    pass : 'gmail-pass'
                }
            }
        };


    var sendUrl = pageToKindle.send("www.awesomewebsite.com", sendParams);
        sendUrl.done(function() {
            console.log('page is sent to kindle...');
        });`



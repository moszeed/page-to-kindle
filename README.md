#page-to-kindle
send any webpage to your kindle

####How it works
---
1. read the Page with *node-readability*
2. write content to pdf with *phantomjs*
3. send pdf via Email (*nodemailer*) to the Amazon Kindle convert Service

#####Usage example
---
    var pageToKindle = require('pageToKindle');
   
    var sendParams = { 
    	
        mailOptions : {
        	to : 'your-kindle-mail-adress@kindle.com'
        },
        
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



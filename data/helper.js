/*
 * Called by main.js and attached as a contentScript for every tab.
 */

/*
 * Emits "grabData" signal if the current url is a login page.
 */
function grabData() {
    if(document.URL.indexOf('https://auth.ucla.edu/index.php') > -1
    || document.URL.indexOf('https://netaccess.logon.ucla.edu/cgi-bin/login') > -1
    || document.URL.indexOf('https://wlanc.resnet.ucla.edu/cgi-bin/login') > -1) {
        self.port.emit("grabData","x");
    }
}

/*
 * Checks the url of the page and changes the user/pass values, then calls submit.
 */
function populate(user,pass) {
    if(document.URL.indexOf('https://auth.ucla.edu/index.php') > -1) {
        if(document.getElementsByTagName('input').item(0).value=='') {
            document.getElementsByTagName('input').item(0).value=user;
            document.getElementsByTagName('input').item(1).value=pass;
            document.forms.item(0).submit();
        }
    }
    else if(document.URL.indexOf('https://netaccess.logon.ucla.edu/cgi-bin/login') > -1
         || document.URL.indexOf('https://wlanc.resnet.ucla.edu/cgi-bin/login') > -1) {
        if(document.getElementsByTagName('input')!=null) {
            document.getElementsByTagName('input').item(1).value=user;
            document.getElementsByTagName('input').item(2).value=pass;
            document.forms.item(0).submit();
        } else {
            document.getElementsByTagName('a').item(0).click();
        }
    }
};

/*
 * Listens for "sendData" signal to call populate().
 */
self.port.on("sendData", function(messageData) {
    populate(messageData[0],messageData[1]);
});

grabData();

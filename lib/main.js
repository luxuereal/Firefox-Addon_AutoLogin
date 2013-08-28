/*
 * UCLA Automated Login add-on for Firefox.
 */

var widgets = require("sdk/widget");
var tabs = require("sdk/tabs");
var data = require("sdk/self").data;
var panel = require("sdk/panel").Panel({
    contentURL: data.url("options.html"),
    contentScriptFile: data.url("optionScript.js"),
    width: 640,
    height: 480
});
var widget = widgets.Widget({
  id: "login-link",
  label: "UCLA Automated Login",
  contentURL: data.url("icon16.ico"),
  onClick: function(event){
      panel.show();
  }
});

panel.on("message", function handleMyEvent(messageData) {
    require("sdk/passwords").search({
        realm: "UCLA Login",
        onComplete: function onComplete(credentials) {

            // Delete all old credentials.
            credentials.forEach(require("sdk/passwords").remove);
            // Store new credentials.
            require("sdk/passwords").store({
                realm: "UCLA Login",
                username: messageData[0],
                password: messageData[1]
            });
            // Hide panel when done.
            panel.hide();
        }
    });
});

tabs.on('ready', function(tab) {
    worker = tab.attach({
        contentScriptFile: [data.url("helper.js")]
    });
    worker.port.on("grabData", function handleMyEvent(myEventPayload) {

        // Finds first (only) password entry and emits credentials.
        require("sdk/passwords").search({
            onComplete: function onComplete(credentials) {
                if(credentials[0].username && credentials[0].password) {
                
                    // Emits credentials to populate external login page.
                    worker.port.emit("sendData",[credentials[0].username,credentials[0].password]);
                }
            }
          });
    });
});

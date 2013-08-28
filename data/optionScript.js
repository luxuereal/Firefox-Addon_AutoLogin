/*
 * Called as contentScript of options.html.
 */

/*
 * Emit user and pass to be stored.
 */
function storeData(user,pass)
{
    self.postMessage([user,pass],"*");
};

/*
 * On the "message" event, call storeData, sending the contents of messageText.
 */
window.addEventListener('message', function(messageText) {
    storeData(messageText.data[0],messageText.data[1]);
});

'use strict';

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

const parseLink = (link) => {
//  switch(true) {
//    case /*youtube.com/watch?v=*/.test(link):
        return link.split("?v=")[1].split("&")[0];
//    case /*vimeo.com*/.test(link):
//        return "TODO";
//    case /*netflix.com*/.test(link):
//        return "TODO";
//    default:
//        return null;
//  }
}

window.addEventListener ("load", checkoutLogic, false);

function checkoutLogic (evt) {

    // Log url of current webpage
    console.log("Ethan's event. Current url is:", window.location.href, "Video ID is:", parseLink(window.location.href));

    // append at 5 remove at 20

    var start = 5;
    var end = 20;
    var showing = false;

    const interval = setInterval(function() {

        let currentTime = document.getElementsByTagName('video')[0].currentTime;
        console.log("The current time in seconds is:", currentTime);

        if (currentTime > start && currentTime < end) {
          if (!showing) {
            showing = true
            console.log("Begin showing");
          }
          console.log("showing");
        } else if (showing) {
          console.log("removing");
          showing = false;
        }

     }, 2000);

     // Generated div
//    let productPanel = document.createElement("div");
//    productPanel.setAttribute("style","position: absolute; width: 402px; border: 1px solid rgb(51, 102, 153); margin-right: 24px; background-color: rgb(255, 255, 255); z-index: 2001; overflow: auto; text-align: center; top: 149px; right: 0;");
//    document.body.appendChild(productPanel);

    // Communicate with background file by sending a message
    chrome.runtime.sendMessage(
      {
        type: 'GREETINGS',
        payload: {
          message: 'Hello, my name is Con. I am from ContentScript.',
        },
      },
      response => {
        console.log(response.message);
      }
    );

    // Listen for message
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.type === 'COUNT') {
        console.log(`Current count is ${request.payload.count}`);
      }

      // Send an empty response
      // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
      sendResponse({});
      return true;
    });
}

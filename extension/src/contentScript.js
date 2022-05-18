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
//    return link.includes("youtube.com/watch?v=") ? link.split("?v=")[1].split("&")[0] : "";

  switch(true) {
    case link.includes("youtube.com/watch?v="):
        return link.split("?v=")[1].split("&")[0];
    case link.includes("vimeo.com"):
        return null;
    case link.includes("netflix.com"):
        return null;
    default:
        return null;
  }
}

window.addEventListener ("load", checkoutLogic, false);

function checkoutLogic (evt) {

    let videoId = parseLink(window.location.href);

    // Log url of current webpage
    console.log("Ethan's event. Current url is:", window.location.href, "Video ID is:",videoId);

    // append at 5 remove at 20

    var start = 5;
    var end = 20;
    var showing = false;

     // Generated div
    let productPanel = document.createElement("div");
    productPanel.setAttribute("style","position: absolute; width: 400px; height: 400px; background-color: rgb(255, 255, 255); z-index: 2001; overflow: auto; text-align: center; top: 10px; right: 10px;");

    if (videoId != null) {
        const interval = setInterval(function() {

            let currentTime = document.getElementsByTagName('video')[0].currentTime;
            console.log("The current time in seconds is:", currentTime);

            if (currentTime > start && currentTime < end) {
              if (!showing) {
                console.log("Begin showing");
                document.body.appendChild(productPanel);
                showing = true
              }
              console.log("showing");
            } else if (showing) {
              console.log("removing");
              productPanel.remove();
              showing = false;
            }

         }, 2000);
    }

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

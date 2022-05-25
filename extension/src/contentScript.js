'use strict';

window.addEventListener('productOnScreen', () => console.log('Show now'));

window.addEventListener('productOffScreen', () => console.log('Hide now'));

window.addEventListener("extensionCheckoutBegin", () => {
  console.log("Ethan event received");
  pauseCurrentVideo();
  document.getElementById('rapyd-checkout').style.width = "550px";
});

window.addEventListener("load", checkoutLogic, false);

async function checkoutLogic() {

  injectRapyd();

  // Log url of current webpage
  let videoId = parseLink(window.location.href);
  console.log("Current url is:", window.location.href, "Video ID is:", videoId);

  var showing = false;

  // Generated div
  let productPanel = document.createElement("div");
  productPanel.setAttribute("style", "position: absolute; width: 400px; height: 400px; background-color: rgb(255, 255, 255); z-index: 3001; overflow: auto; text-align: center; top: 10px; right: 10px;");
  productPanel.id = "rapyd-checkout";

  let productTitle = document.createElement("h1");
  productTitle.style.color = "black";
  productTitle.id = "productTitle";

  productPanel.appendChild(productTitle);
  fetch(chrome.runtime.getURL('/checkoutButton.html')).then(r => r.text()).then(html => { productPanel.appendChild(parser.parseFromString(html, 'text/html').body.firstChild) });

  if (videoId != null) {

    let data = await fetch('http://localhost:8000/fetch/video/youtube/' + videoId, { mode: 'cors' })
      .then(response => response.json())
      .then(payload => payload['Data']);

    console.log("Fetch results: ", data);

    let product = data['products'].at(0);
    console.log("Product", product);

    var start = parseInt(product['timeEnter']);
    var end = parseInt(product['timeExit']);

    productTitle.innerHTML = product['name'];

    const interval = setInterval(function () {

      let currentTime = document.getElementsByTagName('video')[0].currentTime;

      if (currentTime > start && currentTime < end) {
        if (!showing) {
          window.dispatchEvent(new Event('productOnScreen'));
          console.log("Begin showing");
          document.body.appendChild(productPanel);
          showing = true
        }

      } else if (showing) {
        window.dispatchEvent(new Event('productOffScreen'));
        console.log("removing");
        productPanel.remove();
        showing = false;
      }

    }, 1000);
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

const parser = new DOMParser();

const injectRapyd = () => {
  let rapydScript = document.createElement("script");
  rapydScript.type = 'text/javascript';
  rapydScript.src = "https://sandboxcheckouttoolkit.rapyd.net";
  document.head.appendChild(rapydScript);
}

const parseLink = (link) => {
  switch (true) {
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

const pauseCurrentVideo = () => {
  let video = document.querySelector('video');
  if (video != null) {
    video.pause();
  }
}

const createCheckoutBox = () => {
  let productPanel = document.createElement("div");
  productPanel.setAttribute("style", "position: absolute; width: 400px; height: 400px; background-color: rgb(255, 255, 255); z-index: 3001; overflow: auto; text-align: center; top: 10px; right: 10px;");
  productPanel.id = "rapyd-checkout";

  let productTitle = document.createElement("h1");
  productTitle.style.color = "black";
  productTitle.id = "productTitle";

  productPanel.appendChild(productTitle);
  fetch(chrome.runtime.getURL('/checkoutButton.html')).then(r => r.text()).then(html => { productPanel.appendChild(parser.parseFromString(html, 'text/html').body.firstChild) });

  return productPanel;
}
'use strict';

// window.addEventListener('productOnScreen', () => console.log('Show now'));

// window.addEventListener('productOffScreen', () => console.log('Hide now'));

window.addEventListener("extensionCheckoutBegin", () => {
  console.log("Ethan event received");
  pauseCurrentVideo();
  document.getElementById('rapyd-checkout').style.width = "550px";
});

window.addEventListener("load", checkoutLogic, false);

async function checkoutLogic() {

  injectRapyd();

  // Log url of current webpage
  let siteData = parseLink(window.location.href);

  // var showing = false;

  if (siteData.site != null && siteData.siteId != null) {

    let data = await fetch('http://localhost:8000/fetch/video/' + siteData.site + '/' + siteData.siteId, { mode: 'cors' })
      .then(response => response.json())
      .then(payload => payload['Data']);

    let product = data['products'].at(0);
    var start = parseInt(product['timeEnter']);
    var end = parseInt(product['timeExit']);

    // Generated div
    let productPanel = createCheckoutBox(product['name']);

    window.addEventListener('productOnScreen', () => {
      document.body.appendChild(productPanel);
      console.log('Show now');
    });

    window.addEventListener('productOffScreen', () => {
      productPanel.remove();
      console.log('Hide now');
    });

    pollVideo(start, end, 1000);
  }
}

//
// Parser used to inject code from html files
//
const parser = new DOMParser();

//
// Inject the Rapyd Checkout Toolkit dependencies into the current page
//
const injectRapyd = () => {
  let rapydScript = document.createElement("script");
  rapydScript.type = 'text/javascript';
  rapydScript.src = "https://sandboxcheckouttoolkit.rapyd.net";
  document.head.appendChild(rapydScript);
}

//
// Parse a url into a sitename and an Id
//
const parseLink = (link) => {
  let siteData = {
    "site": parseSite(link),
    "siteId": parseId(link)
  };
  console.log("Current site is:", siteData.site, "Video ID is:", siteData.siteId);
  return siteData;
}

//
// Pase the site portion of the URL
//
const parseSite = (link) => {
  if (link.includes("youtube.com")) {
    return "youtube";
  }
  return null;
}

//
// Parse the Id portion of the URL
//
const parseId = (link) => {
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

//
// begin polling for the video's timestamp
//
const pollVideo = (start, end, rate) => {

  let showing = false;

  return setInterval(function () {

    let currentTime = document.getElementsByTagName('video')[0].currentTime;

    if (currentTime > start && currentTime < end) {
      if (!showing) {
        window.dispatchEvent(new Event('productOnScreen'));
        showing = true
      }

    } else if (showing) {
      window.dispatchEvent(new Event('productOffScreen'));
      showing = false;
    }

  }, rate);
}

//
// Pause any video elements in the current frame
//
const pauseCurrentVideo = () => {
  let video = document.querySelector('video');
  if (video != null) {
    video.pause();
  }
}

//
// Generate the code for the checkout box
//
const createCheckoutBox = (title) => {
  let productPanel = document.createElement("div");
  productPanel.setAttribute("style", "position: absolute; width: 400px; height: 400px; background-color: rgb(255, 255, 255); z-index: 3001; overflow: auto; text-align: center; top: 10px; right: 10px;");
  productPanel.id = "rapyd-checkout";

  let productTitle = document.createElement("h1");
  productTitle.style.color = "black";
  productTitle.innerHTML = title;
  productTitle.id = "productTitle";

  productPanel.appendChild(productTitle);
  fetch(chrome.runtime.getURL('/checkoutButton.html')).then(r => r.text()).then(html => { productPanel.appendChild(parser.parseFromString(html, 'text/html').body.firstChild) });

  return productPanel;
}

'use strict';

window.addEventListener("load", async () => {

  injectRapyd();

  let siteData = parseLink(window.location.href);

  if (siteData.site != null && siteData.siteId != null) {

    let data = await fetch('http://localhost:8000/fetch/video/' + siteData.site + '/' + siteData.siteId, { mode: 'cors' })
      .then(response => response.json())
      .then(payload => payload['Data']);

    let product = data['products'].at(0);
    var start = parseInt(product['timeEnter']);
    var end = parseInt(product['timeExit']);

    let productPanel = createCheckoutBox(product['name'], product['imgUrl'], product['checkoutId'], product['checkoutJson']['amount']);

    //
    // Begin watching for timestamps
    //
    const videoPoller = pollVideo(start, end, 1000);

    //
    // Listener to show the product window
    //
    window.addEventListener('productOnScreen', () => {
      document.body.appendChild(productPanel);
      console.log('Showing product now');
    });

    //
    // Listener to hide the product window
    //
    window.addEventListener('productOffScreen', () => {
      productPanel.remove();
      console.log('Hiding product now');
    });

    //
    // Listener to go to checkout
    //
    window.addEventListener("extensionCheckoutBegin", () => {
      document.getElementById('productImg').remove();

      pauseCurrentVideo();
      productPanel.style.width = "550px";
      productPanel.style.height = "750px";

      // Delay removing the original elements for effect
      setTimeout(() => {
        document.getElementById('productLogo').remove();
        document.getElementById('productTitle').remove();
        document.getElementById('productBtn').remove();
      }, 2000);
      console.log("Proceed to checkout");
    });

    //
    // Listener for checkout success
    //
    window.addEventListener('onCheckoutPaymentSuccess', () => {
      console.log("Checkout Success");
      clearInterval(videoPoller);
      checkoutSuccessHandler();
    });

    //
    // Listener for checkout failure
    //
    window.addEventListener('onCheckoutFailure', () => {
      console.log("Checkout Failed");
      sendAlert("red", "Checkout Failed. Please Try Again");
    });

  }
});

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
// Resume any video elements in the current frame
//
const resumeCurrentVideo = () => {
  let video = document.querySelector('video');
  if (video != null) {
    video.play();
  }
}

const checkoutSuccessHandler = () => {
  sendAlert("green", "Checkout succeeded!");
  setTimeout(() => {
    document.getElementById("rapyd-checkout").remove();
    resumeCurrentVideo();
  }, 2500);
}


//
// Helper method to send alerts
//
const sendAlert = (color, message) => {
  let checkout = document.getElementById("rapyd-checkout");
  let productAlert = document.createElement("div");
  productAlert.setAttribute("style", "margin: auto; margin-top: 25px; width: 90%; height: 150px; border-radius: 8px; font-size: large; text-align: center; height: auto; padding-top: 6px; padding-bottom: 10px;");

  if (color == "red") {
    productAlert.style.backgroundColor = "#f8d7da"
    productAlert.style.color = "#721c24";
    productAlert.style.borderColor = "#f5c6cb";
  } else {
    productAlert.style.backgroundColor = "#d4edda"
    productAlert.style.color = "#155724";
    productAlert.style.borderColor = "#c3e6cb";
  }

  productAlert.innerHTML = message;
  productAlert.id = "productAlert";
  checkout.appendChild(productAlert);
}

//
// Generate the code for the checkout box
//
const createCheckoutBox = (title, imgUrl, checkoutId, price) => {
  let productPanel = document.createElement("div");
  productPanel.setAttribute("style", "position: absolute; width: 405px; height: auto; background-color: rgb(255, 255, 255); z-index: 3001; overflow: auto; text-align: center; top: 0px; right: 10px; border-radius: 6px; border: solid #312e81 2px;");
  productPanel.id = "rapyd-checkout";

  let productLogo = document.createElement("img");
  productLogo.setAttribute("style", "max-height:45px; max-width: 400px; margin: auto;")
  productLogo.src = chrome.runtime.getURL("/WindowShopTextLogo.png");
  productLogo.id = "productLogo";

  let productTitle = document.createElement("h1");
  productTitle.style.color = "black";
  // productTitle.style.fontSize = "black";
  productTitle.style.margin = "10px";
  productTitle.innerHTML = "On Screen: " + title;
  productTitle.id = "productTitle";

  let productImg = document.createElement("img");
  productImg.setAttribute("style", "max-height:400px; max-width: 400px; margin: auto;")
  productImg.src = imgUrl;
  productImg.id = "productImg";

  productPanel.appendChild(productLogo);
  productPanel.appendChild(productTitle);
  productPanel.appendChild(productImg);
  fetch(chrome.runtime.getURL('/checkoutButton.html'))
    .then(r => r.text())
    .then(t => t.replace('%checkoutId%', checkoutId))
    .then(t => t.replace('%price%', (Math.round(parseFloat(price) * 100) / 100).toFixed(2)))
    .then(html => { productPanel.appendChild(parser.parseFromString(html, 'text/html').body.firstChild) });

  return productPanel;
}

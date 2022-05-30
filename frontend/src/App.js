import React, { useState, useEffect } from "react";
import Video from "./Video";

function App() {

  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/fetch/videos", {
      // mode: 'no-cors',
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          console.log(json);
          setVideos(json.Data);
        });
      }
    });
  }, []);

  return (
    <div className="App">
      {videos.map((v) =>
        <Video name={v.name} link={v.link} id={v.id} siteId={v.siteId} thumbnail={v.thumbnail} products={v.products} />
      )}
      <footer className={`text-center`}>
      </footer>
    </div>
  );
}

export default App;

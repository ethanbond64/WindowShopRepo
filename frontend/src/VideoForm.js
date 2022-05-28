import React, { useState } from "react";

const parseSite = (link) => {
    if (link.includes("youtube.com")) {
        return "youtube";
    }
    return null;
}

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

const parseThumbnail = (site, siteId) => {
    if (site == "youtube") {
        return "https://i.ytimg.com/vi/" + siteId + "/hqdefault.jpg";
    }
    return "";
}

function VideoForm() {
    const now = new Date();

    const [name, setName] = useState("");
    const [link, setLink] = useState("");

    function onChangeName(e) {
        setName(e.target.value);
    }

    function onChangeLink(e) {
        setLink(e.target.value);
    }


    function saveProduct() {
        console.log("name: ", name);

        let site = parseSite(link);
        let siteId = parseId(link);
        let thumbnail = parseThumbnail(site, siteId);

        console.log("site: ", site);
        console.log("siteId: ", siteId);
        console.log("thumbnail: ", thumbnail);

        fetch("http://localhost:8000/create/video", {
            // mode: 'no-cors',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "name": name,
                "link": link,
                "site": site,
                "siteId": siteId,
                "thumbnail": thumbnail
            })
        }).then(response => {
            if (response.ok) {
                response.json().then(json => {
                    console.log(json);
                    window.location = "http://localhost:3000/";
                });
            }
        });
    }

    return (
        <div className={`mx-auto h-screen`}>
            <h1>Video Form</h1>
            <div className={`bg-gray-50 m-auto p-2.5 w-3/4 rounded shadow-md container h-screen`} >
                <div className={`h-30 mt-4 mb-4`} >
                    <input className={`w-1/6 float-left shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline inline-block`}
                        placeholder="Video Name" onChange={onChangeName} />
                    <input className={`w-1/6 float-left shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline inline-block`}
                        placeholder="Video URL" onChange={onChangeLink} />
                    <button className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded float-right inline-block`}
                        onClick={saveProduct} >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VideoForm;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Video(props) {

    const [deleted, setDeleted] = useState(false);
    let hider = deleted ? 'hidden' : '';

    function deleteVideo() {
        fetch(`http://localhost:8000/delete/video/${props.id}`, { method: 'GET', }).then(response => {
            if (response.ok) {
                response.json().then(json => {
                    console.log(json);
                    setDeleted(true);
                });
            }
        });
    };

    return (
        <div className={`relative mb-6 p-2.5 pb-16 rounded shadow-md h-fit bg-blue-100 ${hider}`}>
            <div className={`absolute rounded-t-lg inset-x-0 top-0 p-2.5 bg-indigo-900 text-white font-bold`}>
                {props.name}
            </div>
            <br />
            <img src={props.thumbnail} className={`max-h-54 mt-4 `} />
            <div class={`absolute rounded-b-lg inset-x-0 bottom-0 p-2.5 bg-white h-14`}>
                <div className={`grid grid-cols-3 gap-4`}>
                    <a className={`inline-block border rounded py-1 px-3 bg-blue-400 text-white`} href={props.link}>
                        Go to video
                    </a>
                    <Link to={`/create/product/${props.id}/${props.siteId}`}>
                        <div className={`inline-block border rounded py-1 px-3 bg-blue-400 text-white`} >
                            Register a product
                        </div>
                    </Link>
                    <button className={`inline-block border rounded py-1 px-3 bg-red-400 hover:bg-red-700 text-white`} onClick={deleteVideo}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Video;

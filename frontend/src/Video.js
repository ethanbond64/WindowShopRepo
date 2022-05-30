import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Product from "./Product";

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
        <div className={`relative my-6 p-2.5 pb-4 rounded shadow-lg h-fit w-full bg-gray-200 ${hider}`}>
            <div className={`block absolute rounded-t-lg inset-x-0 top-0 p-2.5 bg-indigo-500 text-white`}>
                <img className={`float-left h-10 mx-0 mr-2`} src="/images/yticon.png"></img>
                <span className={`float-left text-3xl ml-2`}>{props.name}</span>
                <button className={`inline float-right rounded font-bold mr-2 py-1 px-3 bg-red-400 hover:bg-red-700 text-white`} onClick={deleteVideo}>
                    Delete
                </button>
                <a className={`inline float-right rounded mr-4 py-1 px-3 bg-blue-400 hover:bg-blue-700 text-white`} href={props.link}>
                    Go to video
                </a>
            </div>
            <div className={`block mt-16 w-full`}>
                <div className={`inline-block w-1/3`}>
                    <img src={props.thumbnail} className={`max-h-54`} />
                </div>
                <div className={`inline-block w-1/2 ml-6 align-top`}>
                    <span className={`block text-2xl`}>Registered Products</span>
                    {props.products.map((p) =>
                        <Product {...p} />
                    )}
                    <Link to={`/create/product/${props.id}/${props.siteId}`}>
                        <div className={`inline-block border rounded py-1 px-3 bg-indigo-500 hover:bg-indigo-700 text-white`} >
                            {`Register a${props.products.length == 0 ? '' : 'nother'} product`}
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Video;

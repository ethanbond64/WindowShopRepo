import React, { useState } from "react";

function Product(props) {

    const [deleted, setDeleted] = useState(false);
    let hider = deleted ? 'hidden' : '';

    function deleteProduct() {
        fetch(`http://localhost:8000/delete/product/${props.id}`, { method: 'GET', }).then(response => {
            if (response.ok) {
                response.json().then(json => {
                    console.log(json);
                    setDeleted(true);
                });
            }
        });
    }

    function secondsToTimestamp(secondsIn) {
        // THIS CODE IS FROM https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
        var sec_num = parseInt(secondsIn, 10);
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        let colon = ":";

        if (hours == 0) {
            hours = "";
            colon = "";
        } else if (hours < 10) {
            hours = "0" + hours;
        }

        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) { seconds = "0" + seconds; }
        return hours + colon + minutes + ':' + seconds;
    }

    return (
        <div className={`relative my-2 p-2.5 pb-4 rounded shadow-md h-fit w-full bg-white ${hider}`}>
            <div className={`block w-full`}>
                <span className={`text-xl font-bold ml-2`}>{props.name}</span>
            </div>
            <div className={`block w-full`}>
                <div className={`inline-block h-28 w-28 bg-gray-200 text-center rounded`}>
                    <img src={props.imgUrl} className={`inline-block mt-2 max-h-24`} />
                </div>
                <div className={`inline-block ml-6 align-top`}>
                    <span className={`block text-lg font-bold`}>Price</span>
                    <span>${(Math.round(props.checkoutJson.amount * 100) / 100).toFixed(2)}</span>
                </div>
                <div className={`inline-block ml-6 align-top`}>
                    <span className={`block text-lg font-bold`}>Time on Screen</span>
                    <span>{secondsToTimestamp(props.timeEnter)}</span>
                    <span>&nbsp;-&nbsp;</span>
                    <span>{secondsToTimestamp(props.timeExit)}</span>
                </div>
                <div className={`inline-block ml-6 align-top`}>
                    <span className={`block text-lg font-bold`}>Currency</span>
                    <span>{props.checkoutJson.currency}</span>
                </div>
                <div className={`inline-block mr-6 align-top float-right`}>
                    <button className={`inline float-right rounded font-bold mr-2 py-1 px-3 bg-red-400 hover:bg-red-700 text-white`} onClick={deleteProduct}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Product;

import React, { useState } from "react";
import { useParams } from "react-router-dom";

function convertDate(date) {
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, -1);
}

function addHours(date, x) {
    date.setHours(date.getHours() + x);
    return date;
}

function ProductForm() {

    const { video_id, site_id } = useParams();

    const now = new Date();
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [start, setStart] = useState(undefined);
    const [end, setEnd] = useState(undefined);
    const [price, setPrice] = useState(undefined);
    const [currency, setCurrency] = useState("USD");

    function onChangeName(e) {
        setName(e.target.value);
    }

    function onChangeStart(e) {
        setStart(e.target.value);
    }

    function onChangeEnd(e) {
        setEnd(e.target.value);
    }

    function onChangePrice(e) {
        setPrice(parseFloat(e.target.value));
    }

    function onChangeCurrency(e) {
        setCurrency(e.target.value);
    }

    function onFileChange(e) {

        let formData = new FormData();

        formData.append("file", e.target.files[0]);

        fetch("http://localhost:8000/upload", {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.ok) {
                response.json().then(json => {
                    console.log(json);
                    document.getElementById('dragDropBox').remove();
                    setImage(json.filename);
                    setImageUrl("http://localhost:8000/uploads/" + json.filename);
                });
            }
        });
    };

    function saveProduct() {

        console.log("name: ", name);
        console.log("img: ", image);
        console.log("start: ", start);
        console.log("end: ", end);
        console.log("price: ", price);
        console.log("currency: ", currency);

        fetch("http://localhost:8000/create/product/" + video_id, {
            // mode: 'no-cors',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "name": name,
                "imgUrl": image,
                "timeEnter": start,
                "timeExit": end,
                "checkoutJson": {
                    "amount": parseFloat(price),
                    "country": "US",
                    "currency": currency,
                    "payment_method _types_include": [
                        "us_mastercard_card",
                        "us_visa_card"
                    ]
                }
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
            <div className={`w-full text-center`}>
                <span className={`block text-4xl my-4 mx-auto`}>Register a new product</span>
            </div>
            <div className={`bg-gray-100 m-auto p-2.5 pt-1 w-3/4 rounded shadow-md container h-fit`} >
                <div className={`bg-white rounded h-32 mt-2 mb-4 p-5`} >
                    <span className={`block text-xl mb-3 font-bold`}>Product Name</span>
                    <input className={`w-1/2 float-left shadow appearance-none border-solid border-2 border-indigo-200 rounded py-2 px-3 text-gray-700 leading-tight focus:ring-indigo-500 focus:border-black-500 focus:shadow-outline inline-block`}
                        placeholder="Product Name" onChange={onChangeName} />
                    <button className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded float-right inline-block`}
                        onClick={saveProduct} >
                        Save
                    </button>
                </div>
                <div className={`bg-white rounded h-72 mt-4 mb-4 p-5`} >
                    <span className={`block text-xl mb-3 font-bold`}>Checkout Info</span>
                    <div className={`w-1/3 inline-block`}>
                        <label for="price" className={`block text-sm font-medium text-gray-700`}>Price</label>
                        <div className={`mt-1 relative rounded-md shadow-md border-solid border-2 border-indigo-200`}>
                            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none`}>
                                <span className={`text-gray-500 sm:text-sm`}> $ </span>
                            </div>
                            <input onChange={onChangePrice} type="text" name="price" id="price" className={`focus:ring-indigo-500 focus:border-black-500 h-10 block w-full pl-7 pr-12 sm:text-sm rounded-md`} placeholder="0.00" />
                            <div className={`absolute inset-y-0 right-0 flex items-center`}>
                                <label for="currency" className={`sr-only`}>Currency</label>
                                <select onChange={onChangeCurrency} id="currency" name="currency" className={`focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md`}>
                                    <option value={"USD"}>USD</option>
                                    <option value={"CAD"}>CAD</option>
                                    <option value={"EUR"}>EUR</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className={`w-1/3 inline-block m-4 ml-10 mt-0`}>
                        <label for="price" className={`block text-sm font-medium text-gray-700`}>Accept Cards</label>
                        <div className={`mt-1 relative rounded-md shadow-md border-solid border-2 border-indigo-200`}>
                            <select id="currency" name="currency" className={`focus:ring-indigo-500 focus:border-indigo-500 w-full h-10 py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md`}>
                                <option>All</option>
                                <option>Visa</option>
                                <option>Mastercard</option>
                            </select>
                        </div>
                    </div>
                    <div className={`w-1/4 text-center form-check inline-block`}>
                        <input className={`form-check-input h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain mr-2 cursor-pointer`} type="checkbox" value="" id="flexCheckDefault" />
                        <label className={`form-check-label inline-block text-gray-800`} for="flexCheckDefault">
                            Shipping
                        </label>
                    </div>
                    <div className={`block w-full`}>
                        <div className={`container w-full`}>
                            <img src={imageUrl} className={`mx-auto max-h-36`} ></img>
                        </div>
                        <label id="dragDropBox" className={`flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none`}>
                            <span className={`flex items-center space-x-2`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 text-gray-600`} fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span className={`font-medium text-gray-600`}>
                                    Drop thumbnail image, or&nbsp;
                                    <span className={`text-blue-600 underline`}>browse</span>
                                </span>
                            </span>
                            <input type="file" name="file_upload" onChange={onFileChange} className={`hidden`} />
                        </label>
                    </div>
                </div>
                <div className={`bg-white rounded h-fit mt-4 mb-4 p-5`} >
                    <span className={`block text-xl mb-3 font-bold`}>On Screen Info</span>
                    <iframe id="youtubePlayer" className={`mx-auto mb-5 block`} width="560" height="315" src={`https://www.youtube.com/embed/${site_id}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <div className={`block container w-full justify-center items-center mb-5`}>
                        <div className={`inline-block container w-1/2`}>
                            <button className={`bg-indigo-500 hover:bg-indigo-700 mx-auto text-white font-bold py-2 px-3 rounded float-right inline-block mr-6`}>
                                Product On Screen
                            </button>
                        </div>
                        <div className={`inline-block container w-1/2`}>
                            <button className={`bg-indigo-500 hover:bg-indigo-700 max-auto text-white font-bold py-2 px-3 rounded float-left inline-block ml-6`} >
                                Product Off Screen
                            </button>
                        </div>
                    </div>
                    <div className={`block container w-full justify-center items-center mb-20`}>
                        <div className={`inline-block container w-1/2`}>
                            <input className={`w-1/3 float-right mx-auto shadow border rounded py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline block mr-6`}
                                placeholder="Time in seconds" type="number" value={start} onChange={onChangeStart} />
                        </div>
                        <div className={`inline-block container w-1/2`}>
                            <input className={`w-1/3 float-left mx-auto shadow border rounded py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline inline-block ml-6`}
                                placeholder="Time in seconds" type="number" value={end} onChange={onChangeEnd} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductForm;
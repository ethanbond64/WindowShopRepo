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

    const { video_id } = useParams();

    const now = new Date();
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [start, setStart] = useState(convertDate(now));
    const [end, setEnd] = useState(convertDate(addHours(now, 3)));

    function onChangeName(e) {
        setName(e.target.value);
    }

    function onChangeStart(e) {
        setStart(e.target.value);
    }

    function onChangeEnd(e) {
        setEnd(e.target.value);
    }

    function onFileChange(e) {
        // setFile(e.target.files[0]);

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
                    "amount": 20,
                    "country": "US",
                    "currency": "USD",
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
                    // window.location = "http://localhost:3000/";
                });
            }
        });
    }

    return (
        <div className={`mx-auto h-screen`}>
            <h1>Product Form</h1>
            <div className={`bg-gray-100 m-auto p-2.5 w-3/4 rounded shadow-md container h-fit`} >
                <div className={`bg-white h-20 mt-4 mb-4 p-5`} >
                    <input className={`w-1/2 float-left shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline inline-block`}
                        placeholder="Product Name" onChange={onChangeName} />
                    <button className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded float-right inline-block`}
                        onClick={saveProduct} >
                        Save
                    </button>
                </div>
                <div className={`bg-white h-72 mt-4 mb-4 p-5`} >
                    <div className={`w-1/3 inline-block`}>
                        <label for="price" className={`block text-sm font-medium text-gray-700`}>Price</label>
                        <div className={`mt-1 relative rounded-md shadow-md border-solid border-2 border-indigo-200`}>
                            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none`}>
                                <span className={`text-gray-500 sm:text-sm`}> $ </span>
                            </div>
                            <input type="text" name="price" id="price" className={`focus:ring-indigo-500 focus:border-black-500 h-10 block w-full pl-7 pr-12 sm:text-sm rounded-md`} placeholder="0.00" />
                            <div className={`absolute inset-y-0 right-0 flex items-center`}>
                                <label for="currency" className={`sr-only`}>Currency</label>
                                <select id="currency" name="currency" className={`focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md`}>
                                    <option>USD</option>
                                    <option>CAD</option>
                                    <option>EUR</option>
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
                    <div className={`block w-full mx-auto `}>
                        <div className={`container w-full justify-center items-center`}>
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
                <div className={`bg-white h-fit mt-4 mb-4 p-5`} >
                    <iframe className={`mx-auto mb-10`} width="560" height="315" src="https://www.youtube.com/embed/aJoo79OwZEI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <div className={`container w-full justify-center items-center mb-20`}>
                        <input className={`w-1/3 float-left shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline inline-block mr-6`}
                            type="number" value={start} onChange={onChangeStart} />
                        <input className={`w-1/3 float-left shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline inline-block mr-6`}
                            type="number" value={end} onChange={onChangeEnd} />
                    </div>
                </div>
                <h2 className={`font-semibold font-3xl`}>Time the product enters and exists the screen</h2>
                <div className={`h-30 mt-4 mb-4`}>

                </div>
                <br />

            </div>
        </div >
    );
}

export default ProductForm;
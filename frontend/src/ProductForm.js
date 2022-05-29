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
    const [imageUrl, setImageUrl] = useState("");
    const [file, setFile] = useState(null);
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
                    setImageUrl(json.filename);
                });
            }
        });
    };

    function saveProduct() {

        console.log("name: ", name);
        console.log("img: ", imageUrl);
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
                "imgUrl": imageUrl,
                "timeEnter": start,
                "timeExit": end,
                "checkoutJson": {
                    "amount": 20,
                    "country": "US",
                    "currency": "USD",
                    "payment_method_types_include": [
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
            <div className={`bg-gray-50 m-auto p-2.5 w-3/4 rounded shadow-md container h-screen`} >
                <div className={`h-30 mt-4 mb-4`} >
                    <input className={`w-1/6 float-left shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline inline-block`}
                        placeholder="Product Name" onChange={onChangeName} />
                    <input type="file" onChange={onFileChange} />
                    <button className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded float-right inline-block`}
                        onClick={saveProduct} >
                        Save
                    </button>
                </div>
                <h2 className={`font-semibold font-3xl`}>Time the product enters and exists the screen</h2>
                <div className={`h-30 mt-4 mb-4`}>
                    <input className={`w-1/3 float-left shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline inline-block mr-6`}
                        type="number" value={start} onChange={onChangeStart} />
                    <input className={`w-1/3 float-left shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline inline-block mr-6`}
                        type="number" value={end} onChange={onChangeEnd} />
                </div>
                <br />
            </div>
        </div>
    );
}

export default ProductForm;
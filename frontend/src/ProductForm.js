import React, { useState } from "react";
import { Link } from "react-router-dom";


function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function convertDate(date) {
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, -1);
}

function addHours(date, x) {
    date.setHours(date.getHours() + x);
    return date;
}

function ProductForm() {
    const now = new Date();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [start, setStart] = useState(convertDate(now));
    const [end, setEnd] = useState(convertDate(addHours(now, 3)));

    function onChangeName(e) {
        setName(e.target.value);
    }

    function onChangeDescription(e) {
        setDescription(e.target.value);
    }

    function onChangeStart(e) {
        setStart(e.target.value);
    }

    function onChangeEnd(e) {
        setEnd(e.target.value);
    }



    function saveProduct() {
        console.log("name: ", name);
        console.log("desc: ", description);
        console.log("start: ", start);
        console.log("end: ", end);

        var formData = new FormData();

        formData.append("name", name);
        formData.append("description", description);
        formData.append("start", start);
        formData.append("end", end);


        fetch("http://localhost:8000/create/product", {
            // mode: 'no-cors',
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: formData
        }).then(response => {
            if (response.ok) {
                response.json().then(json => {
                    window.location = "http://localhost:3000/";
                });
            }
        });
    }



    return (
        <div className={`mx-auto h-screen`}>
            <div className={`bg-gray-50 m-auto p-2.5 w-3/4 rounded shadow-md container h-screen`} >
                <div className={`h-30 mt-4 mb-4`} >
                    <input className={`w-1/6 float-left shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline inline-block`}
                        placeholder="Product Name" onChange={onChangeName} />
                    <button className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded float-right inline-block`}
                        onClick={saveProduct} >
                        Save
                    </button>
                </div>
                <textarea class="m-auto mt-4 mb-4 w-5/6 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none" rows="4"
                    placeholder="Product Description" onChange={onChangeDescription}>
                </textarea>

                <h2 className={`font-semibold font-3xl`}>Time the product enters and exists the screen</h2>
                <div className={`h-30 mt-4 mb-4`} >
                    <input className={`w-1/3 float-left shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline inline-block mr-6`}
                        type="datetime-local" value={start} onChange={onChangeStart} />
                    <input className={`w-1/3 float-left shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline inline-block mr-6`}
                        type="datetime-local" value={end} onChange={onChangeEnd} />
                </div>
                <br />
            </div>
        </div>
    );
}

export default ProductForm;
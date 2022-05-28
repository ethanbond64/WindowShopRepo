import { Link } from "react-router-dom";

function Video(props) {

    return (
        <div className={`relative mb-6 p-2.5 rounded shadow-md h-250 bg-blue-100`}>
            <div className={`absolute rounded-t-lg inset-x-0 top-0 p-2.5 bg-indigo-900 text-white font-bold`}>
                {props.name}
            </div>
            <br />
            <img src={props.thumbnail} style={{ maxHeight: 500, maxWidth: 500 }} />
            <div class={`absolute rounded-b-lg inset-x-0 bottom-0 p-2.5 bg-white h-14`}>
                <div className={`grid grid-cols-3 gap-4`}>
                    <a className={`inline-block border rounded py-1 px-3 bg-blue-400 text-white`} href={props.link}>
                        Go to video
                    </a>
                    <Link to={`/create/product/${props.id}`}>
                        <div className={`inline-block border rounded py-1 px-3 bg-blue-400 text-white`} >
                            Register a product
                        </div>
                    </Link>
                    <a className={`inline-block border rounded py-1 px-3 bg-blue-400 text-white`} href={`localhost:8000/V1/latest/${props.id}`}>
                        TODO
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Video;
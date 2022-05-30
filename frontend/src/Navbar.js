import { Link } from 'react-router-dom';

function Navbar() {

    return (
        <div className={`relative w-full h-30 mb-10`}>
            <Link to="/">
                <img src="/images/templogo.png" className={`h-20`} alt="Checkout App Logo" />
            </Link>
            <div className={`mt-8 absolute inset-y-0 right-0`}>
                <a className={`inline-block border rounded py-1 px-3 bg-indigo-500 text-white mr-4`}>
                    <Link to="/create/video">+ New Video</Link>
                </a>
                <a className={`inline-block border rounded py-1 px-3 bg-indigo-500 text-white mr-4`}>
                    Help
                </a>
                <div className={`inline-block border rounded py-1 px-3 bg-indigo-500 text-white mr-4`} >
                    About
                </div>
            </div>
            {/* <Link to="/" ><img src={logo} alt="Chia No Code Logo" /></Link> */}
        </div>
    );
}

export default Navbar;
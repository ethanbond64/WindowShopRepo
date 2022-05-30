import { Link } from 'react-router-dom';

function Navbar() {

    return (
        <div className={`relative w-full h-36 mb-10`}>
            <Link to="/">
                <img src="/images/MainTextLogo.png" className={`h-28 pt-3`} alt="Checkout App Logo" />
            </Link>
            <div className={`mt-8 absolute inset-y-0 right-0`}>
                <a className={`inline-block border rounded py-1 px-3 bg-indigo-900 text-white mr-4`}>
                    <Link to="/create/video">+ New Video</Link>
                </a>
                <div className={`inline-block border rounded py-1 px-3 bg-indigo-900 text-white mr-4`}>
                    Help
                </div>
                <div className={`inline-block border rounded py-1 px-3 bg-indigo-900 text-white mr-4`} >
                    About
                </div>
                <div className={`inline-block rounded px-3 pt-1 text-white align-bottom`} >
                    <img src='/images/userIcon.png' className={`max-h-10`}></img>
                </div>
            </div>
            {/* <Link to="/" ><img src={logo} alt="Chia No Code Logo" /></Link> */}
        </div>
    );
}

export default Navbar;
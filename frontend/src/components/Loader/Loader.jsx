import { TailSpin } from "react-loader-spinner";
import './Loader.css'

function Loader() {
    return (
        <div className="loader-container">
            <TailSpin
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
        </div>
    );
}

export default Loader;

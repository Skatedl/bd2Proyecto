import { useNavigate } from "react-router-dom";
import Navbar from "../componentes/navbar";
import Footer from "../componentes/footer";


function Home() {
    return (
        <> 
        <Navbar/>
        <div className="bg-gray-800 p-75 flex">
            <div className="grid">
                <div></div>
            </div>
        </div>
        <Footer/>
        </>
    );
}

export default Home;
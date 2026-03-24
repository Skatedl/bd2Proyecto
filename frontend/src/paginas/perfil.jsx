import Navbar from "./navbar";
import Footer from "./footer";

export function Perfil () {
    return (
        <>
            <Navbar/>
            <div className="min-h-screen bg-gray-800 text-white p-8">
                <h1 className="text-3xl font-bold mb-6">Perfil de Usuario</h1>
                <div className="bg-gray-700 p-6 rounded-lg">
                    <p>Aquí puedes ver y editar tu información de perfil.</p>
                    {/* Agrega más contenido según necesites */}
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default Perfil;
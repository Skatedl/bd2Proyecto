import Navbar from "../componentes/navbar";
import Footer from "../componentes/footer";
import { useState } from "react";
import { useEffect } from "react";

export function Perfil() {

    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const DatosPerfil = async () => {
            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:3001/perfil", {
                method: "GET",
                headers: {
                    "Authorization": token
                }
            });

            const data = await response.json();
            console.log("Respuesta del servidor:", data);
            console.log("Status:", response.status);
            if (response.ok) {
                setUsuario(data);
            } else {
                console.error("No se pudo obtener el perfil");
            }
        };
        DatosPerfil();
    }, []);

    if (!usuario) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
                <p className="animate-bounce">Cargando datos del perfil...</p>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen  text-white p-8 bg-gradient-to-t from-white via-blue-800/90 to-black">
                <h1 className="text-3xl font-bold mb-6">Perfil de Usuario</h1>
                <div className="bg-gradient-to-r from-grey-700 via-blue-800/90 to-gray-400 p-6 rounded-lg">
                    <h3><strong>{usuario.NOMBRE}</strong></h3>
                    <div className="flex justify-center ">
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>Cédula:</div>
                            <div className="text-black ">{usuario.COD_USER}</div>
                            <div>Correo:</div>
                            <div className="text-black">{usuario.CORREO}</div>
                            <div>Rol:</div>
                            <div className="text-black">{usuario.ROL}</div>
                        </div>
                        <button className="hover:bg-blend-color-burn p-1 w-1.5" >Editar</button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Perfil;
import { useNavigate } from "react-router-dom";
import Navbar from "../componentes/navbar";
import Footer from "../componentes/footer";
import { useEffect, useState } from "react";

function Home() {
    const navigate = useNavigate();
    const [validando, setValidando] = useState(true);
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const validarToken = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/", { replace: true });
                return;
            }

            try {
                const response = await fetch("http://localhost:3001/perfil", {
                    method: "GET",
                    headers: {
                        Authorization: token,
                    },
                });

                if (!response.ok) {
                    localStorage.removeItem("token");
                    navigate("/", { replace: true });
                    return;
                }

                const data = await response.json();
                setUsuario(data);
            } catch (error) {
                console.error("Error validando token:", error);
                localStorage.removeItem("token");
                navigate("/", { replace: true });
            } finally {
                setValidando(false);
            }
        };

        validarToken();
    }, [navigate]);

    if (validando) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
                <p>Validando token...</p>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="bg-gray-800 p-8 min-h-screen text-white">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-4">
                        Bienvenido{usuario ? `, ${usuario.NOMBRE}` : ""}
                    </h1>
                    <p className="mb-6">Esta página sólo es accesible con un token válido.</p>
                    <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                        <p className="text-lg">Tu sesión está activa y el token se validó correctamente.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Home;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';

function Login() {

    const [cedula, setCedula] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        const response = await fetch("http://localhost:3001/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cedula,
                password
            })
        });

        const data = await response.json();

        if (data.login) {
            navigate("/home");
        } else {
            alert("Usuario o contraseña incorrecta");
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">

            {/* 🔹 LOGO DE FONDO */}
            <img
                src={logo}
                alt="logo fondo"
                className="absolute inset-0 w-full h-full object-contain opacity-10 blur-2xl pointer-events-none"
            />

            {/* 🔹 CAPA OSCURA PARA MEJOR CONTRASTE */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* 🔹 CONTENIDO (FORMULARIO) */}
            <div className="relative z-10 bg-blue-900/80 p-8 rounded-2xl shadow-xl w-full max-w-md border border-blue-700 backdrop-blur-md">

                <h2 className="text-2xl font-bold text-white text-center mb-6">
                    Iniciar Sesión
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            Identificación
                        </label>
                        <input
                            type="number"
                            placeholder="Ingrese su identificación"
                            onChange={(e) => setCedula(e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-700 text-white 
          placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border 
          border-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            placeholder="Ingrese su contraseña"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-700 text-white 
          placeholder-gray-400 focus:outline-none focus:ring-2 
          focus:ring-blue-500 border border-gray-600"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 
        text-white font-semibold p-3 rounded-lg shadow-md"
                    >
                        Ingresar
                    </button>
                </form>

            </div>
        </div>
    );
}

export default Login;
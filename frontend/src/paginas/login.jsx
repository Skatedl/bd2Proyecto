import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"

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
            navigate("/menu");
        } else {
            alert("Usuario o contraseña incorrecta");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Iniciar Sesion</h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="number"
                        placeholder="Identificación"
                        onChange={(e) => setCedula(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit">
                        Ingresar
                    </button>

                </form>

            </div>
        </div>
    );
}

export default Login;
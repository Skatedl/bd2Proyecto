import "./menu.css";
import { useNavigate } from "react-router-dom";

function Menu() {

    const navigate = useNavigate();

    const cerrarSesion = () => {
        navigate("/");
    };

    return (
        <div className="menu-container">

            <h1>Menú Principal</h1>

            <div className="menu-buttons">

                <button>Usuarios</button>
                <button>Profesores</button>
                <button>Actividades</button>
                <button>Matrículas</button>
                <button className="logout" onClick={cerrarSesion}>
                    Cerrar sesión
                </button>

            </div>

        </div>
    );
}

export default Menu;
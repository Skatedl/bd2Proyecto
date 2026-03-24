import { Routes, Route } from "react-router-dom";
import Login from "./paginas/login";
import Home from "./paginas/home";
import { Perfil } from "./paginas/perfil";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/perfil" element ={<Perfil/>}/>
    </Routes>
  );
}

export default App;
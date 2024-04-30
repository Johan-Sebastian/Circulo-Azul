//Importaciones de react-router-dom
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//Hooks
import React, {useState} from 'react';

//Importación de componentes
import Mesas from "./components/mesas"; // Importa el componente Mesas desde el archivo "./components/mesas"
import Clientes from "./components/numeroClientes"; // Importa el componente Clientes desde el archivo "./components/numeroClientes"
import Total from "./components/total"; // Importa el componente Total desde el archivo "./components/total"
import Menu from "./components/menu1"; // Importa el componente Menu desde el archivo "./components/menu1"
import ListaMeseros from "./components/ListaMeseros"; // Importa el componente ListaMeseros desde el archivo "./components/ListaMeseros"
import ListaPlatillos from "./components/ListaPlatillos"; // Importa el componente ListaPlatillos desde el archivo "./components/ListaPlatillos"
import ListaBebidas from "./components/ListaBebidas"; // Importa el componente ListaBebidas desde el archivo "./components/ListaBebidas"
import ListaFrutas from "./components/ListaFrutas"; // Importa el componente ListaFrutas desde el archivo "./components/ListaFrutas"
import ConfirmarOrden from "./components/ordencorrecta"; // Importa el componente ConfirmarOrden desde el archivo "./components/ordencorrecta"
import Observaciones from "./components/Observaciones"; // Importa el componente Observaciones desde el archivo "./components/Observaciones"
import Login from "./components/Login"; // Importa el componente Login desde el archivo "./components/Login"
import Cocina from "./components/Cocina"; // Importa el componente Cocina desde el archivo "./components/Cocina"
import Docente from "./components/Docente"; // Importa el componente Docente desde el archivo "./components/Docente"

import { firebaseApp } from './firebase/firebaseConfig'; // Importa la variable firebaseApp desde el archivo "./firebase/firebaseConfig"
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Importa las funciones getAuth y onAuthStateChanged desde el módulo "firebase/auth"

import ListaPlatillosEdit from "./components/ListaPlatillosEdit"; // Importa el componente ListaPlatillosEdit desde el archivo "./components/ListaPlatillosEdit"
import ListaBebidasEdit from "./components/ListaBebidasEdit"; // Importa el componente ListaBebidasEdit desde el archivo "./components/ListaBebidasEdit"
import ListaFrutasEdit from "./components/ListaFrutasEdit"; // Importa el componente ListaFrutasEdit desde el archivo "./components/ListaFrutasEdit"

const auth = getAuth(firebaseApp); // Obtiene la instancia de autenticación con getAuth utilizando firebaseApp

function App() { // Define el componente App
  const [usuario, setUsuario] = useState(null); // Declara el estado usuario como null utilizando el hook useState
  
  // Ejecuta la función onAuthStateChanged cuando cambia el estado de la autenticación
  onAuthStateChanged(auth,(usuarioFirebase)=>{
    if(usuarioFirebase)
    { // Si hay un usuario autenticado
      setUsuario(usuarioFirebase); // Establece el estado usuario con el usuario autenticado
    }
    else
    { // Si no hay un usuario autenticado
      setUsuario(null); // Establece el estado usuario como null
    }
  });

  return <>
  {usuario ? 
  <Router>
      <Routes>
            {/* Ruta para la página de inicio */}
            <Route path="/" element={<Menu/>}/>
            {/* Ruta para la página de clientes */}
            <Route path="/Clientes" element={<Clientes/>} />
            {/* Ruta para la página de total */}
            <Route path="/Total" element={<Total/>} />
            {/* Ruta para la página de meseros */}
            <Route path="/Meseros" element={<ListaMeseros/>} />
            {/* Ruta para la página de mesas */}
            <Route path="/Mesas" element={<Mesas/>} />
            {/* Ruta para la página de platillos */}
            <Route path="/Platillos" element={<ListaPlatillos/>} />
            {/* Ruta para la página de bebidas */}
            <Route path="/Bebidas" element={<ListaBebidas/>} />
            {/* Ruta para la página de frutas */}
            <Route path="/Frutas" element={<ListaFrutas/>} />
            {/* Ruta para la página de edición de platillos */}
            <Route path="/PlatillosEdit" element={<ListaPlatillosEdit/>} />
            {/* Ruta para la página de edición de bebidas */}
            <Route path="/BebidasEdit" element={<ListaBebidasEdit/>} />
            {/* Ruta para la página de edición de frutas */}
            <Route path="/FrutasEdit" element={<ListaFrutasEdit/>} />
            {/* Ruta para la página de observaciones */}
            <Route path="/Observaciones" element={<Observaciones/>} />
            {/* Ruta para la página de confirmar orden */}
            <Route path="/ConfirmarOrden" element={<ConfirmarOrden/>} />
            {/* Ruta para la página de cocina */}
            <Route path="/Cocina" element={<Cocina />} />
            {/* Ruta para la página de docente */}
            <Route path="/Docente" element={<Docente />} />
      </Routes>
    </Router>
  :
  <Login/>
  }
    </>;
}
// Exporta el componente App para index
export default App;

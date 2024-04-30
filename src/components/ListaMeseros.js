import React from "react"; // Importa React
import { TarjetaMesero } from "./TarjetaMesero"; // Importa el componente TarjetaMesero
import ConsultaMeseros from "./ConsultaMeseros"; // Importa la función ConsultaMeseros para obtener la lista de meseros
import regresar from '../assets/images/regresar.png'; // Importa la imagen de regresar

import "../css/vistasBD.css" // Importa el archivo de estilos CSS

import { Link } from "react-router-dom"; // Importa el componente Link de react-router-dom para la navegación

export const ListaMeseros = () => { // Define el componente funcional ListaMeseros
  const meseros = ConsultaMeseros(); // Obtiene la lista de meseros utilizando la función ConsultaMeseros

  //Metodo para guardar el nombre del mesero en el LocalStorage
  function saveMesero(mesero, imagen){ 
    localStorage.setItem("Mesero", mesero); // Guarda el nombre del mesero en el LocalStorage con la clave "Mesero"
    localStorage.setItem("imgMesero", imagen) // Guarda la imagen del mesero en el LocalStorage con la clave "imgMesero"
  }

  // Retorna el JSX que representa la interfaz del componente
  return (
    <>
      <div className="content-items">
      {/* Enlace para regresar a la página principal */}
      <Link to="/" style={{ textDecoration: 'none' }}><img className="img_Regresar" src={regresar} /></Link>
        <h1>Selecciona tu nombre</h1> {/* Título */}
        <ul className="lista-items"> {/* Lista de elementos */}
            {/* Mapea cada mesero para mostrarlo en una lista */}
            {meseros.map((mesero) => (
              <li> {/* Enlace que guarda el mesero seleccionado y redirige a la página de mesas */}
                <Link onClick={() => saveMesero(mesero.Nombre)} to="/Mesas" style={{ textDecoration: 'none' }}><li><TarjetaMesero mesero={mesero} /></li></Link>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};
// Exporta el componente ListaMeseros por defecto
export default ListaMeseros;

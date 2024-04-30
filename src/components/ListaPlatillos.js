import React from "react"; // Importa React
import { ItemMenu } from "./ItemMenu"; // Importa el componente ItemMenu
import ConsultaMenu from "./ConsultaMenu"; // Importa la función ConsultaMenu para obtener la lista de platillos
import cancelar from '../assets/images/cancelar.png'; // Importa la imagen de cancelar
import ClienteActual from "./ClienteActual"; // Importa el componente ClienteActual

import "../css/vistasBD.css" // Importa el archivo de estilos CSS

import { Link } from "react-router-dom"; // Importa el componente Link de react-router-dom para la navegación

export const ListaPlatillos = () => { // Define el componente funcional ListaPlatillos
  const platillos = ConsultaMenu("platillos"); // Obtiene la lista de platillos utilizando la función ConsultaMenu

  //Metodo para guardar el platillo y su imagen en el LocalStorage
  function savePlatillo(nombre, imagen) {
    localStorage.setItem("Platillo", nombre) // Guarda el nombre del platillo en el LocalStorage con la clave "Platillo"
    localStorage.setItem("imgPlatillo", imagen) // Guarda la imagen del platillo en el LocalStorage con la clave "imgPlatillo"
  }

  // Retorna el JSX que representa la interfaz del componente
  return (
    <>
      <div className="content-items">
        {/* Enlace para cancelar y regresar a la página de meseros */}
        <Link to="/Meseros" style={{ textDecoration: 'none' }}><img className="img_cancelar_2" src={cancelar} /></Link>
        <h1>Selecciona un platillo</h1> {/* Título */}
        {/* Condición para mostrar el botón de retroceso si hay platillos disponibles */}
        {platillos.length > 0 && (
          <div>
              {/* Enlace para ir a la página de clientes */}
              <Link to="/Clientes" style={{ textDecoration: 'none' }}>
                  <button className="boton_Meseros_2">
                      🢀
                  </button>
              </Link>
          </div>
        )}
        <div class="flex-container"> {/* Contenedor de elementos */}
          <h1 className="cliente-actual">Cliente : <ClienteActual /></h1> {/* Muestra el cliente actual */}
          <ul className="lista-items"> {/* Lista de platillos */}
            {/* Mapea cada platillo para mostrarlo en una lista */}
            {platillos.map((platillo) => (
              <li> {/* Enlace que guarda el platillo seleccionado y redirige a la página de bebidas */}
                <Link onClick={() => savePlatillo(platillo.Nombre, platillo.Foto)} to="/Bebidas" style={{ textDecoration: 'none' }}><ItemMenu item={platillo} /></Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
// Exporta el componente ListaPlatillos por defecto
export default ListaPlatillos;
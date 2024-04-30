import React, {useState, useEffect} from "react"; // Importa React, useState y useEffect
import { ItemMenu } from "./ItemMenu"; // Importa el componente ItemMenu
import ConsultaMenu from "./ConsultaMenu"; // Importa la función ConsultaMenu
import cancelar from '../assets/images/cancelar.png'; // Importa la imagen de cancelar
import ClienteActual from "./ClienteActual"; // Importa el componente ClienteActual
import RecomendarFruta from "./CondPlaBebi"; // Importa la función RecomendarFruta

import "../css/vistasBD.css" // Importa el archivo CSS correspondiente

import { Link } from "react-router-dom"; // Importa el componente Link de react-router-dom

export const ListaFrutas = () => { // Define un componente de función llamado ListaFrutas
  // Uso de useState para el estado de la fruta recomendada
  const [frutaRecomendada, setFrutaRecomendada] = useState("");
  // Obtiene las frutas del menú
  const platillos = ConsultaMenu("fruta");

  // Método para guardar la fruta y su imagen en el LocalStorage
  function savePlatillo(nombre, imagen) {
    localStorage.setItem("Fruta", nombre)
    localStorage.setItem("imgFruta", imagen)
  }

  useEffect(() => {
    // Se obtienen la bebida y el platillo del LocalStorage
    var bebida = localStorage.getItem('Bebida');
    var platillo = localStorage.getItem('Platillo');

    // Se reduce el número de clientes y se recomienda una fruta
    var fruta = RecomendarFruta(platillo, bebida);
    console.log(fruta)
    setFrutaRecomendada(fruta)
  }, []);
  return (
    <>
      <div className="content-items"> {/* Renderiza el contenedor de elementos */}
        {/* Renderiza el botón de cancelar con un enlace */}
        <Link to="/Meseros" style={{ textDecoration: 'none' }}><img className="img_cancelar_2" src={cancelar} /></Link>
        <h1>Selecciona un postre</h1> {/* Renderiza un encabezado */}
        {/* Renderiza un bloque condicional si hay platillos disponibles */}
        {platillos.length > 0 && (
          <div>
              <Link to="/Bebidas" style={{ textDecoration: 'none' }}> {/* Renderiza un enlace para volver atrás */}
                  <button className="boton_Meseros_2">
                      🢀
                  </button>
              </Link>
          </div>
        )}
        <div class="flex-container"> {/* Renderiza un contenedor flexible */}
          {/* Renderiza un encabezado con el número de cliente actual */}
          <h1 className="cliente-actual">Cliente : <ClienteActual/></h1>
          <ul className="lista-items"> {/* Renderiza una lista de elementos */}
            {/* Renderiza cada fruta disponible */}
            {platillos.map((fruta) => (
              <li> {/* Renderiza un enlace con un ítem de menú dentro de la lista */}
                <Link onClick={() => savePlatillo(fruta.Nombre, fruta.Foto)} to="/Observaciones" style={{ textDecoration: 'none' }}><ItemMenu item={fruta} bandera={fruta.Nombre == frutaRecomendada ? true : false} /></Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
// Exporta el componente ListaFrutas
export default ListaFrutas;
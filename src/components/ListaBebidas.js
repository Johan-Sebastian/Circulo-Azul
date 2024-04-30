import React, {useState, useEffect} from "react"; // Importa React y los hooks useState y useEffect
import { ItemMenu } from "./ItemMenu"; // Importa el componente ItemMenu
import ConsultaMenu from "./ConsultaMenu"; // Importa la función ConsultaMenu
import cancelar from '../assets/images/cancelar.png'; // Importa la imagen de cancelar
import RecomendarBebida from "./CondicionesPlatillo"; // Importa la función RecomendarBebida
import ClienteActual from "./ClienteActual"; // Importa el componente ClienteActual

import "../css/vistasBD.css" // Importa el archivo CSS correspondiente

import { Link } from "react-router-dom"; // Importa el componente Link de react-router-dom

export const ListaBebidas = () => { // Define un componente de función llamado ListaBebidas
  // Uso de useState para el estado de la bebida recomendada
  const [bebidaRecomendada, setBebidaRecomendada] = useState("");
  // Obtiene las bebidas del menú
  const bebidas = ConsultaMenu("bebidas");

  // Método para guardar la bebida y su imagen en el LocalStorage
  function saveBebida(bebida, imagen) {
    localStorage.setItem("Bebida", bebida)
    localStorage.setItem("imgBebida", imagen)
  }

  useEffect(() => {
    //Se obtienen el platillo del LocalStorage
    var platillo = localStorage.getItem('Platillo');

    //Se reduce el número de clientes
    var bebida = RecomendarBebida(platillo);
    console.log(bebida)
    setBebidaRecomendada(bebida)
  }, []);

  return (
    <>
      <div className="content-items"> {/* Renderiza el contenedor de elementos */}
        {/* Renderiza el botón de cancelar con un enlace */}
        <Link to="/Meseros" style={{ textDecoration: 'none' }}><img className="img_cancelar_2" src={cancelar} /></Link>
        <h1>Selecciona una bebida</h1> {/* Renderiza un encabezado */}
        {/* Renderiza un fragmento condicional si hay bebidas */}
        {bebidas.length > 0 && ( 
          <div>
              <Link to="/Platillos" style={{ textDecoration: 'none' }}> {/* Renderiza un enlace */}
                  <button className="boton_Meseros_2"> {/* Renderiza un botón con un signo de flecha*/}
                      🢀
                  </button>
              </Link>
          </div>
        )} 
        <div class="flex-container"> {/* Renderiza un contenedor flexible */}
          <h1 className="cliente-actual">Cliente : <ClienteActual /></h1> {/* Renderiza un encabezado con el nombre del cliente actual */}
          <ul className="lista-items"> {/* Renderiza una lista de elementos */}
            {bebidas.map((bebida) => (
              <li> {/* Renderiza un enlace con un ítem de menú dentro de la lista */}
                <Link onClick={() => saveBebida(bebida.Nombre, bebida.Foto)} to="/Frutas" style={{ textDecoration: 'none' }}><ItemMenu item={bebida} bandera={bebida.Nombre == bebidaRecomendada ? true : false} /></Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
// Exporta el componente ListaBebidas
export default ListaBebidas;
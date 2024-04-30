import React, { useEffect, useState } from "react"; // Importa React, useEffect y useState
import { ItemMenu } from "./ItemMenu"; // Importa el componente ItemMenu
import ConsultaMenu from "./ConsultaMenu"; // Importa la función ConsultaMenu
import cancelar from '../assets/images/cancelar.png'; // Importa la imagen de cancelar
import ClienteActual from "./ClienteActual"; // Importa el componente ClienteActual
// Importa el archivo CSS correspondiente
import "../css/vistasBD.css"
// Importa el componente Link de react-router-dom
import { Link } from "react-router-dom"; 

export const ListaBebidas = () => { // Define un componente de función llamado ListaBebidas
    // Uso de useState para el estado de la bebida recomendada
    const [bebidaRecomendada, setBebidaRecomendada] = useState("");
    // Obtiene las bebidas del menú
    const bebidas = ConsultaMenu("bebidas");
    // Uso de useState para la dirección
    const [direccion, setDireccion] = useState("");

    // Método para guardar la bebida y su imagen en el LocalStorage
    function saveBebida(nombre, imagen) {
    // Se obtienen los demás parámetros guardados en el local storage
    const clienteActual1 = localStorage.getItem("clienteActual");
    const mesa1 = localStorage.getItem("Mesa");
    const noClientes1 = localStorage.getItem("NoClientes");
    const fruta1 = localStorage.getItem("Fruta");
    const imgFruta1 = localStorage.getItem("imgFruta");
    const platillo1 = localStorage.getItem("Platillo");
    const imgPlatillo1 = localStorage.getItem("imgPlatillo");
    const Mesero1 = localStorage.getItem("Mesero");
    const observacion1 = localStorage.getItem("Observacion");
    const ordenesListStorage = localStorage.getItem("ordenesList");

    // Se crea un objeto de lista
    const pedido = {
        clienteActual: clienteActual1,
        mesa: mesa1,
        noClientes: noClientes1,
        platillo: platillo1,
        imgPlatillo: imgPlatillo1,
        bebida: nombre,
        imgBebida: imagen,
        fruta: fruta1,
        imgFruta: imgFruta1,
        Mesero: Mesero1,
        observacion: observacion1,
    };

    // Se crea la lista y se busca si ya existe una lista para el cliente actual
    let ordenesList = JSON.parse(ordenesListStorage) || [];
    const existingIndex = ordenesList.findIndex((item) => item.clienteActual === clienteActual1);

    if (existingIndex !== -1) {
        // Si ya existe una lista para el cliente actual, se actualiza esa lista
        ordenesList[existingIndex] = pedido;
    } else {
        // Si no existe una lista para el cliente actual, se agrega una nueva lista
        ordenesList.push(pedido);
    }

    console.log(ordenesList);
    localStorage.setItem("ordenesList", JSON.stringify(ordenesList));
    }

    useEffect(() => {
    // Condición para asignar la dirección
    setDireccion("/ConfirmarOrden");
    }, []);
    // Obtiene el número del cliente actual
    const clienteActualValue = ClienteActual();
    const clienteActualMinusOne = clienteActualValue - 1;

  return (
    <>
      <div className="content-items"> {/* Renderiza el contenedor de elementos */}
      {/* Renderiza el botón de cancelar con un enlace */}
        <Link to="/Meseros" style={{ textDecoration: 'none' }}><img className="img_cancelar_2" src={cancelar} /></Link>
        <h1>Selecciona una bebida</h1> {/* Renderiza un encabezado */}
        <div class="flex-container"> {/* Renderiza un contenedor flexible */}
          {/* Renderiza un encabezado con el número del cliente actual */}
          <h1 className="cliente-actual">Cliente : {clienteActualMinusOne}</h1>
          <ul className="lista-items"> {/* Renderiza una lista de elementos */}
            {bebidas.map((bebida) => ( 
              <li> {/* Renderiza cada bebida */}
                {/* Renderiza un enlace con un ítem de menú dentro de la lista */}
                <Link onClick={() => saveBebida(bebida.Nombre, bebida.Foto)} to={direccion} style={{ textDecoration: 'none' }}><ItemMenu item={bebida} bandera={bebida.Nombre == bebidaRecomendada ? true : false} /></Link>
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
import React, { useEffect, useState } from "react"; // Importa React y los hooks useEffect y useState
import { ItemMenu } from "./ItemMenu"; // Importa el componente ItemMenu
import ConsultaMenu from "./ConsultaMenu"; // Importa la función ConsultaMenu para obtener la lista de platillos
import cancelar from '../assets/images/cancelar.png'; // Importa la imagen de cancelar
import ClienteActual from "./ClienteActual"; // Importa el componente ClienteActual

import "../css/vistasBD.css" // Importa el archivo de estilos CSS

import { Link } from "react-router-dom"; // Importa el componente Link de react-router-dom para la navegación

export const ListaPlatillos = () => { // Define el componente funcional ListaPlatillos
  const platillos = ConsultaMenu("platillos"); // Obtiene la lista de platillos utilizando la función ConsultaMenu
  // Uso de useState
  const [direccion, setDireccion] = useState(""); // Define el estado para la dirección de redirección

  // Método para guardar el platillo y su imagen en el LocalStorage
  function savePlatillo(nombre, imagen) {
    // Se obtienen los demás parámetros guardados en el local storage
    const clienteActual1 = localStorage.getItem("clienteActual"); // Obtiene el cliente actual del LocalStorage
    const mesa1 = localStorage.getItem("Mesa"); // Obtiene la mesa del LocalStorage
    const noClientes1 = localStorage.getItem("NoClientes"); // Obtiene el número de clientes del LocalStorage
    const bebida1 = localStorage.getItem("Bebida"); // Obtiene la bebida del LocalStorage
    const imgBebida1 = localStorage.getItem("imgBebida"); // Obtiene la imagen de la bebida del LocalStorage
    const fruta1 = localStorage.getItem("Fruta"); // Obtiene la fruta del LocalStorage
    const imgFruta1 = localStorage.getItem("imgFruta"); // Obtiene la imagen de la fruta del LocalStorage
    const Mesero1 = localStorage.getItem("Mesero"); // Obtiene el mesero del LocalStorage
    const observacion1 = localStorage.getItem("Observacion"); // Obtiene la observación del LocalStorage
    const ordenesListStorage = localStorage.getItem("ordenesList"); // Obtiene la lista de órdenes del LocalStorage

    // Se crea un objeto de lista con los datos obtenidos
    const pedido = {
      clienteActual: clienteActual1,
      mesa: mesa1,
      noClientes: noClientes1,
      platillo: nombre,
      imgPlatillo: imagen,
      bebida: bebida1,
      imgBebida: imgBebida1,
      fruta: fruta1,
      imgFruta: imgFruta1,
      Mesero: Mesero1,
      observacion: observacion1,
    };

    // Se crea la lista y se busca si ya existe una lista para el cliente actual
    let ordenesList = JSON.parse(ordenesListStorage) || []; // Parsea la lista de órdenes del LocalStorage o inicializa un array vacío si no existe
    const existingIndex = ordenesList.findIndex((item) => item.clienteActual === clienteActual1);// Busca si ya existe una lista para el cliente actual

    if (existingIndex !== -1) {
      // Si ya existe una lista para el cliente actual, se actualiza esa lista
      ordenesList[existingIndex] = pedido;
    } else {
      // Si no existe una lista para el cliente actual, se agrega una nueva lista
      ordenesList.push(pedido);
    }

    console.log(ordenesList); // Muestra la lista de órdenes en la consola
    localStorage.setItem("ordenesList", JSON.stringify(ordenesList)); // Guarda la lista de órdenes en el LocalStorage
  }

  useEffect(() => {
    // Condición para asignar la dirección
    setDireccion("/ConfirmarOrden"); // Asigna la dirección de redirección a la página de confirmación de órdenes
  }, []);

  // Obtiene el valor del cliente actual utilizando el componente ClienteActual
  const clienteActualValue = ClienteActual();
  // Resta 1 al valor del cliente actual para mostrarlo correctamente en la interfaz
  const clienteActualMinusOne = clienteActualValue - 1;

  // Retorna el JSX que representa la interfaz del componente
  return (
    <>
      <div className="content-items">
        <h1>Selecciona un platillo</h1> {/* Título */}
        <div class="flex-container"> {/* Contenedor de elementos */}
          <h1 className="cliente-actual">Cliente : {clienteActualMinusOne}</h1> {/* Muestra el cliente actual */}
          {/* Campo de observaciones */}
          <div id="txtObservacion" className="input-observaciones" name="textarea" placeholder=" "></div>
          <ul className="lista-items"> {/* Lista de platillos */}
            {/* Mapea cada platillo para mostrarlo en una lista */}
            {platillos.map((platillo) => (
              <li>
                <Link onClick={() => savePlatillo(platillo.Nombre, platillo.Foto)} to={direccion} style={{ textDecoration: 'none' }}>
                  <ItemMenu item={platillo} /> {/* Renderiza el componente ItemMenu para mostrar el platillo */}
                </Link>
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

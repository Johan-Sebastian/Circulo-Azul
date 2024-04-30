import React, { useEffect, useState } from "react"; // Importa React, useEffect y useState
import { ItemMenu } from "./ItemMenu"; // Importa el componente ItemMenu
import ConsultaMenu from "./ConsultaMenu"; // Importa la función ConsultaMenu
import cancelar from '../assets/images/cancelar.png'; // Importa la imagen de cancelar
import ClienteActual from "./ClienteActual"; // Importa el componente ClienteActual

import "../css/vistasBD.css" // Importa el archivo CSS correspondiente

import { Link } from "react-router-dom"; // Importa el componente Link de react-router-dom

export const ListaFrutas = () => { // Define un componente de función llamado ListaFrutas
    // Uso de useState para el estado de la fruta recomendada
    const [frutaRecomendada, setFrutaRecomendada] = useState("");
    // Obtiene las frutas del menú    
    const platillos = ConsultaMenu("fruta");
    // Uso de useState para la dirección
    const [direccion, setDireccion] = useState("");

    // Método para guardar la fruta y su imagen en el LocalStorage
    function savePlatillo(nombre, imagen) {
    // Se obtienen los demás parámetros guardados en el local storage
    const clienteActual1 = localStorage.getItem("clienteActual"); // Obtiene el valor de "clienteActual" del LocalStorage
    const mesa1 = localStorage.getItem("Mesa"); // Obtiene el valor de "Mesa" del LocalStorage
    const noClientes1 = localStorage.getItem("NoClientes"); // Obtiene el valor de "NoClientes" del LocalStorage
    const bebida1 = localStorage.getItem("Bebida"); // Obtiene el valor de "Bebida" del LocalStorage
    const imgBebida1 = localStorage.getItem("imgBebida"); // Obtiene el valor de "imgBebida" del LocalStorage
    const platillo1 = localStorage.getItem("Platillo"); // Obtiene el valor de "Platillo" del LocalStorage
    const imgPlatillo1 = localStorage.getItem("imgPlatillo"); // Obtiene el valor de "imgPlatillo" del LocalStorage
    const Mesero1 = localStorage.getItem("Mesero"); // Obtiene el valor de "Mesero" del LocalStorage
    const observacion1 = localStorage.getItem("Observacion"); // Obtiene el valor de "Observacion" del LocalStorage
    const ordenesListStorage = localStorage.getItem("ordenesList"); // Obtiene el valor de "ordenesList" del LocalStorage

    // Se crea un objeto de lista
    const pedido = {
        clienteActual: clienteActual1,
        mesa: mesa1,
        noClientes: noClientes1,
        platillo: platillo1,
        imgPlatillo: imgPlatillo1,
        bebida: bebida1,
        imgBebida: imgBebida1,
        fruta: nombre,
        imgFruta: imagen,
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
    // Obtiene el valor del cliente actual y resta uno
    const clienteActualValue = ClienteActual();
    const clienteActualMinusOne = clienteActualValue - 1;

    return (
        <>
            <div className="content-items"> {/* Renderiza el contenedor de elementos */}
            {/* Renderiza el botón de cancelar con un enlace */}
            <Link to="/Meseros" style={{ textDecoration: 'none' }}><img className="img_cancelar_2" src={cancelar} /></Link>
            <h1>Selecciona un postre</h1> {/* Renderiza un encabezado */}
            <div class="flex-container"> {/* Renderiza un contenedor flexible */}
                {/* Renderiza un encabezado con el número de cliente actual */}
                <h1 className="cliente-actual">Cliente : {clienteActualMinusOne}</h1> 
                <ul className="lista-items"> {/* Renderiza una lista de elementos */}
                {/* Renderiza cada fruta disponible */}
                {platillos.map((fruta) => (
                    <li> {/* Renderiza un enlace con un ítem de menú dentro de la lista */}
                        <Link onClick={() => savePlatillo(fruta.Nombre, fruta.Foto)} to={direccion} style={{ textDecoration: 'none' }}><ItemMenu item={fruta} /></Link>
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
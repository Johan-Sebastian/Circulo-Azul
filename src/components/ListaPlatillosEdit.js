import React, { useEffect, useState } from "react";
import { ItemMenu } from "./ItemMenu";
import ConsultaMenu from "./ConsultaMenu";
import cancelar from '../assets/images/cancelar.png';
import ClienteActual from "./ClienteActual";

import "../css/vistasBD.css"

import { Link } from "react-router-dom"; 

export const ListaPlatillos = () => {
  const platillos = ConsultaMenu("platillos");
  // Uso de useState
  const [direccion, setDireccion] = useState("");

  // Método para guardar el platillo y su imagen en el LocalStorage
  function savePlatillo(nombre, imagen) {
    // Se obtienen los demás parámetros guardados en el local storage
    const clienteActual1 = localStorage.getItem("clienteActual");
    const mesa1 = localStorage.getItem("Mesa");
    const noClientes1 = localStorage.getItem("NoClientes");
    const bebida1 = localStorage.getItem("Bebida");
    const imgBebida1 = localStorage.getItem("imgBebida");
    const fruta1 = localStorage.getItem("Fruta");
    const imgFruta1 = localStorage.getItem("imgFruta");
    const Mesero1 = localStorage.getItem("Mesero");
    const observacion1 = localStorage.getItem("Observacion");
    const ordenesListStorage = localStorage.getItem("ordenesList");

    // Se crea un objeto de lista
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

  const clienteActualValue = ClienteActual();
  const clienteActualMinusOne = clienteActualValue - 1;

  return (
    <>
      <div className="content-items">
        <h1>Selecciona un platillo</h1>
        <div class="flex-container">
          <h1 className="cliente-actual">Cliente : {clienteActualMinusOne}</h1>
          <div id="txtObservacion" className="input-observaciones" name="textarea" placeholder=" "></div>
          <ul className="lista-items">
            {platillos.map((platillo) => (
              <li>
                <Link onClick={() => savePlatillo(platillo.Nombre, platillo.Foto)} to={direccion} style={{ textDecoration: 'none' }}>
                  <ItemMenu item={platillo} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ListaPlatillos;

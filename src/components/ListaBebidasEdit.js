import React, { useEffect, useState } from "react";
import { ItemMenu } from "./ItemMenu";
import ConsultaMenu from "./ConsultaMenu";
import cancelar from '../assets/images/cancelar.png';
import ClienteActual from "./ClienteActual";

import "../css/vistasBD.css"

import { Link } from "react-router-dom"; 

export const ListaBebidas = () => {
    //Uso de useState
    const [bebidaRecomendada, setBebidaRecomendada] = useState("");

    const bebidas = ConsultaMenu("bebidas");
    // Uso de useState
    const [direccion, setDireccion] = useState("");

    // Método para guardar el platillo y su imagen en el LocalStorage
    function saveBebida(nombre, imagen) {
    // Se obtienen los demás parámetros guardados en el local storage
    const clienteActual1 = localStorage.getItem("clienteActual");
    const mesa1 = localStorage.getItem("Mesa");
    const noClientes1 = localStorage.getItem("NoClientes");
    const fruta1 = localStorage.getItem("Fruta");
    const imgFruta1 = localStorage.getItem("imgFruta");
    const platillo1 = localStorage.getItem("Platillo");
    const imgPlatillo1 = localStorage.getItem("imgPlatillo");
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

  return (
    <>
      <div className="content-items">
        <Link to="/Meseros" style={{ textDecoration: 'none' }}><img className="img_cancelar_2" src={cancelar} /></Link>
        <h1>Selecciona una bebida</h1>
        <div class="flex-container">
          <h1 className="cliente-actual">Cliente : <ClienteActual /></h1>
          <ul className="lista-items">
            {bebidas.map((bebida) => (
              <li><Link onClick={() => saveBebida(bebida.Nombre, bebida.Foto)} to={direccion} style={{ textDecoration: 'none' }}><ItemMenu item={bebida} bandera={bebida.Nombre == bebidaRecomendada ? true : false} /></Link></li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ListaBebidas;
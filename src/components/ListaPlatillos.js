import React from "react";
import { ItemMenu } from "./ItemMenu";
import ConsultaMenu from "./ConsultaMenu";
import cancelar from '../assets/images/cancelar.png';
import ClienteActual from "./ClienteActual";

import "../css/vistasBD.css"

import { Link } from "react-router-dom";

export const ListaPlatillos = () => {
  const platillos = ConsultaMenu("platillos");

  //Metodo para guardar el platillo y su imagen en el LocalStorage
  function savePlatillo(nombre, imagen) {
    localStorage.setItem("Platillo", nombre)
    localStorage.setItem("imgPlatillo", imagen)
  }

  return (
    <>
      <div className="content-items">
        <Link to="/Meseros" style={{ textDecoration: 'none' }}><img className="img-cancelar" src={cancelar} /></Link>
        <h1>Selecciona un platillo</h1>
        <h1 className="cliente-actual"><ClienteActual /></h1>
        <ul className="lista-items">
          {platillos.map((platillo) => (
            <li><Link onClick={() => savePlatillo(platillo.Nombre, platillo.Foto)} to="/Bebidas" style={{ textDecoration: 'none' }}><ItemMenu item={platillo} /></Link></li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ListaPlatillos;
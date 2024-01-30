import React from "react";
import { TarjetaMesero } from "./TarjetaMesero";
import ConsultaMeseros from "./ConsultaMeseros";
import regresar from '../assets/images/regresar.png';

import "../css/vistasBD.css"

import { Link } from "react-router-dom";

export const ListaMeseros = () => {
  const meseros = ConsultaMeseros();

  //Metodo para guardar el nombre del mesero en el LocalStorage
  function saveMesero(mesero, imagen){
    localStorage.setItem("Mesero", mesero);
    localStorage.setItem("imgMesero", imagen)
  }

  return (
    <>
      <div className="content-items">
      <Link to="/" style={{ textDecoration: 'none' }}><img className="img_Regresar" src={regresar} /></Link>
        <h1>Selecciona tu nombre</h1>
        <ul className="lista-items">
            {meseros.map((mesero) => (
              <li><Link onClick={() => saveMesero(mesero.Nombre)} to="/Mesas" style={{ textDecoration: 'none' }}><li><TarjetaMesero mesero={mesero} /></li></Link></li>
            ))}
        </ul>
      </div>
    </>
  );
};

export default ListaMeseros;

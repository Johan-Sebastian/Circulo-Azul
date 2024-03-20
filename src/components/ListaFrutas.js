import React, {useState, useEffect} from "react";
import { ItemMenu } from "./ItemMenu";
import ConsultaMenu from "./ConsultaMenu";
import cancelar from '../assets/images/cancelar.png';
import ClienteActual from "./ClienteActual"
import RecomendarFruta from "./CondPlaBebi";

import "../css/vistasBD.css"

import { Link } from "react-router-dom";

export const ListaFrutas = () => {
  //Uso de useState
  const [frutaRecomendada, setFrutaRecomendada] = useState("");

  const platillos = ConsultaMenu("fruta");

  //Metodo para guardar el platillo y su imagen en el LocalStorage
  function savePlatillo(nombre, imagen) {
    localStorage.setItem("Fruta", nombre)
    localStorage.setItem("imgFruta", imagen)
  }

  useEffect(() => {
    //Se obtienen el platillo del LocalStorage
    var bebida = localStorage.getItem('Bebida');
    var platillo = localStorage.getItem('Platillo');

    //Se reduce el número de clientes
    var fruta = RecomendarFruta(platillo, bebida);
    console.log(fruta)
    setFrutaRecomendada(fruta)
  }, []);
  return (
    <>
      <div className="content-items">
        <Link to="/Meseros" style={{ textDecoration: 'none' }}><img className="img_cancelar_2" src={cancelar} /></Link>
        <h1>Selecciona un postre</h1>
        {platillos.length > 0 && (
          <div>
              <Link to="/Bebidas" style={{ textDecoration: 'none' }}>
                  <button className="boton_Meseros_2">
                      🢀
                  </button>
              </Link>
          </div>
        )}
        <div class="flex-container">
          <h1 className="cliente-actual">Cliente : <ClienteActual/></h1>
          <ul className="lista-items">
            {platillos.map((fruta) => (
              <li><Link onClick={() => savePlatillo(fruta.Nombre, fruta.Foto)} to="/Observaciones" style={{ textDecoration: 'none' }}><ItemMenu item={fruta} bandera={fruta.Nombre == frutaRecomendada ? true : false} /></Link></li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ListaFrutas;
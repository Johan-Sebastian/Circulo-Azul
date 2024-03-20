import React, {useState, useEffect} from "react";
import { ItemMenu } from "./ItemMenu";
import ConsultaMenu from "./ConsultaMenu";
import cancelar from '../assets/images/cancelar.png';
import RecomendarBebida from "./CondicionesPlatillo";
import ClienteActual from "./ClienteActual";

import "../css/vistasBD.css"

import { Link } from "react-router-dom";

export const ListaBebidas = () => {
  //Uso de useState
  const [bebidaRecomendada, setBebidaRecomendada] = useState("");

  const bebidas = ConsultaMenu("bebidas");

  //Metodo para guardar la bebida y su imagen en el LocalStorage
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
      <div className="content-items">
        <Link to="/Meseros" style={{ textDecoration: 'none' }}><img className="img_cancelar_2" src={cancelar} /></Link>
        <h1>Selecciona una bebida</h1>
        {bebidas.length > 0 && (
          <div>
              <Link to="/Platillos" style={{ textDecoration: 'none' }}>
                  <button className="boton_Meseros_2">
                      🢀
                  </button>
              </Link>
          </div>
        )}
        <div class="flex-container">
          <h1 className="cliente-actual">Cliente : <ClienteActual /></h1>
          <ul className="lista-items">
            {bebidas.map((bebida) => (
              <li><Link onClick={() => saveBebida(bebida.Nombre, bebida.Foto)} to="/Frutas" style={{ textDecoration: 'none' }}><ItemMenu item={bebida} bandera={bebida.Nombre == bebidaRecomendada ? true : false} /></Link></li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ListaBebidas;
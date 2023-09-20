import React from "react";

import "../css/vistasBD.css";

export function ItemMenu({ item, bandera }) {
  var Clase = "contenedor-item"
  if (bandera == true){
    Clase = "contenedor-recomendado"
  }
  console.log(bandera);
  return (
    <>
      <div className={Clase} key={item.IdItem}>
        <img src={item.Foto} alt={item.Nombre} className="imagen-item" />
        <div className="contenedor-nombre">
          <p className="nombre-item">{item.Nombre}</p>
        </div>
      </div>
    </>
  );
}
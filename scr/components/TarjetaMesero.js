import React from "react";

import "../css/vistasBD.css";

export function TarjetaMesero({ mesero }) {
  return (
    <>
      <div className="contenedor-item" key={mesero.IdMesero}>
        <img src={mesero.Foto} alt={mesero.Nombre} className="imagen-item" />
        <div className="contenedor-nombre">
          <p className="nombre-item">{mesero.Nombre}</p>
        </div>
      </div>
    </>
  );
}

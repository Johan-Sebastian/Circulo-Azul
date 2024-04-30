import React from "react"; // Importa la biblioteca React

// Importa el archivo de estilos para las vistas de la base de datos
import "../css/vistasBD.css";

// Componente funcional TarjetaMesero para mostrar la información de un mesero
export function TarjetaMesero({ mesero }) {
  return (
    <>
      {/* Contenedor de la tarjeta del mesero */}
      <div className="contenedor-item" key={mesero.IdMesero}>
        {/* Imagen del mesero */}
        <img src={mesero.Foto} alt={mesero.Nombre} className="imagen-item" />
        {/* Contenedor del nombre del mesero */}
        <div className="contenedor-nombre">
          {/* Nombre del mesero */}
          <p className="nombre-item">{mesero.Nombre}</p>
        </div>
      </div>
    </>
  );
}

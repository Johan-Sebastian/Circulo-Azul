import React from "react";
import "../css/docente.css";
import TablaMesas from "./TablaMesas";

const Docente = () => {
  return (
    <div>
      <div className="header">
        <h1>Meseros Activos</h1>
        <div className="meseros">
          <div className="mesero">Mesero 1</div>
          <div className="mesero">Mesero 2</div>
          <div className="mesero">Mesero 3</div>
        </div>
      </div>

      <div className="content">
        <div className="cuadrante">
          <TablaMesas />
        </div>
        <div className="cuadrante">
          <TablaMesas />
        </div>
        <div className="cuadrante">
          <TablaMesas />
        </div>
        <div className="cuadrante">
          <TablaMesas />
        </div>
      </div>
    </div>
  );
};

export default Docente;

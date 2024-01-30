import React from "react";

const TablaMesas = () => {
  return (
    <div className="content_Docente">
      <div className="Mesas_Table_Docente">
        <h2>Mesas Simplificadas</h2>
        <table>
          <thead>
            <tr>
              <th>Mesa</th>
              <th>Disponibilidad</th>
              <th>No. de clientes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Disponible</td>
              <td>3</td>
            </tr>
            {/* Puedes agregar más filas según sea necesario */}
          </tbody>
        </table>
      </div>
      <div className="Mesas_Table_Docente">
        <h2>Mesas Detalladas</h2>
        <table>
          <thead>
            <tr>
              <th>Interacciones</th>
              <th>Comida</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>selecciono mesa 1</td>
              <td>Chilaquiles Verdes con Pollo - 2</td>
              <td>Correcto</td>
            </tr>
            {/* Puedes agregar más filas según sea necesario */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaMesas;

import React from "react"; // Importa la biblioteca React

// Component definition for rendering tables related to tables in the dining area
const TablaMesas = () => {
  return (
    <div className="content_Docente">
      {/* Tabla de mesas simplificadas */}
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
            {/* Fila de ejemplo de mesa simplificada */}
            <tr>
              <td>1</td>
              <td>Disponible</td>
              <td>3</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Tabla de mesas detalladas */}
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
            {/* Fila de ejemplo de mesa detallada */}
            <tr>
              <td>selecciono mesa 1</td>
              <td>Chilaquiles Verdes con Pollo - 2</td>
              <td>Correcto</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
// Exporta el componente TablaMesas
export default TablaMesas;

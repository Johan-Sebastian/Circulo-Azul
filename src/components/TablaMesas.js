import React from "react";

const TablaMesas = () => {
  return (
    <table className="mesas-table">
      <thead>
        <tr>
          <th>Mesa</th>
          <th>Disponibilidad</th>
          <th>No. de clientes</th>
          <th>Interacciones</th>
          <th>Comida</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Disponible</td>
          <td>3</td>
          <td>selecciono mesa 1</td>
          <td>Chilaquiles Verdes con Pollo - 2</td>
          <td>Correcto</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Ocupada</td>
          <td>2</td>
          <td>selecciono mesa 2</td>
          <td>Café - 1</td>
          <td>Entregado</td>
        </tr>
        {/* Puedes agregar más filas según sea necesario */}
      </tbody>
    </table>
  );
};

export default TablaMesas;
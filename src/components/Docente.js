// Docente.js
import React from "react";
import "../css/docente.css"; // Asegúrate de tener este archivo de estilos

const Docente = () => {
  return (
    <tbody>
      <div class="header">
          <h1>Meseros Activos</h1>
          <div class="meseros">
              <div class="mesero">Mesero 1</div>
              <div class="mesero">Mesero 2</div>
              <div class="mesero">Mesero 3</div>
          </div>
      </div>

      <div class="content">
          <table class="mesas-table">
              <tr>
                  <th>Mesa</th>
                  <th>Interacciones</th>
                  <th>Estado</th>
                  <td>Comida</td>
              </tr>
              <tr>
                  <td>1</td>
                  <td>selecciono mesa 1</td>
                  <td>Correcto</td>
                  <td>Entregado</td>
                  <td><div class="observacion">
                      <textarea placeholder="Ingrese observaciones"></textarea>
                  </div></td>
                  
              </tr>
              <tr>
                  <td>1</td>
                  <td>Eligio 3 personas</td>
                  <td>Correcto</td>
                  <td>Entregado</td>
                  <td><div class="observacion">
                      <textarea placeholder="Ingrese observaciones"></textarea>
                  </div></td>
              </tr>
              <tr>
                  <td>1</td>
                  <td>Selecciona un platillo - Chilaquiles Verdes con Pollo - 2</td>
                  <td>Incorrecto</td>
                  <td>Entregado</td>
                  <td><div class="observacion">
                      <textarea placeholder="Ingrese observaciones"></textarea>
                  </div></td>
              </tr>
              <tr>
                  <td>1</td>
                  <td>Selecciona una bebida - Café - 1</td>
                  <td>Incorrecto</td>
                  <td>Preparando</td>
                  <td><div class="observacion">
                      <textarea placeholder="Ingrese observaciones"></textarea>
                  </div></td>
              </tr>
              <tr>
                  <td>1</td>
                  <td>Selecciona un postre - Melones con Cotege - 2</td>
                  <td>Pendiente</td>
                  <td>En cola</td>
                  <td><div class="observacion">
                      <textarea placeholder="Ingrese observaciones"></textarea>
                  </div></td>
              </tr>
              <tr>
                  <td>2</td>
                  <td>selecciono mesa 2</td>
                  <td>Pendiente</td>
                  <td>En cola</td>
                  <td><div class="observacion">
                      <textarea placeholder="Ingrese observaciones"></textarea>
                  </div></td>
              </tr>
          </table>
          
          <div class="observaciones">
              <h2>Observaciones</h2>
              <div class="observacion">
                  <h3>Observaciones para Mesa 1:</h3>
                  <textarea placeholder="Ingrese observaciones aquí"></textarea>
              </div>
              <div class="observacion">
                  <h3>Observaciones para Mesa 2:</h3>
                  <textarea placeholder="Ingrese observaciones aquí"></textarea>
              </div>
          <table class="Producto cobrados - Entregados">
              <tr>
              </tr>
          </table>
          

          <div class="cocineros-status">
          </div>
        </div>
      </div>
    </tbody>
  );
};

export default Docente;

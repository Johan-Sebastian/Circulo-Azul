import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import "../css/docente.css";
import regresar from '../assets/images/regresar.png';
import { Link } from "react-router-dom";

const Docente = () => {
  const [mesasActivas, setMesasActivas] = useState([]);

  useEffect(() => {
    console.log("Ejecutando useEffect para Mesas Activas");

    const unsubscribeMesas = onSnapshot(collection(db, "pedidos"), (querySnapshot) => {
      const mesasActivasTemp = [];

      querySnapshot.forEach((pedidoDoc) => {
        const pedidosArray = Object.values(pedidoDoc.data().pedido);

        pedidosArray.forEach((platilloPedido) => {
          const mesa = platilloPedido.mesa;
          const estadoOrden = platilloPedido.estadoOrden;

          if (estadoOrden !== "liberado" && mesa) {
            const mesaExistente = mesasActivasTemp.find((mesaActiva) => mesaActiva.numeroMesa === mesa);

            if (mesaExistente) {
              mesaExistente.numComensales += 1; // Incrementa el número de comensales si la mesa ya existe
            } else {
              mesasActivasTemp.push({
                numeroMesa: mesa,
                disponibilidad: estadoOrden,
                numComensales: 1,
              });
            }
          }
        });
      });

      console.log("Mesas Activas recuperadas:", mesasActivasTemp);
      setMesasActivas(mesasActivasTemp);
    });

    return () => unsubscribeMesas();
  }, []);

  return (
    <React.Fragment>
      <div className="header_Line">
        <hr className="line" />
        <h2 className="page_Title">Mi Circulo-Azul</h2>
      </div>
      <Link to="/" style={{ textDecoration: 'none' }}><img className="img_Regresar_Cocina" src={regresar} /></Link>
      <div>
        <div className="header_Docente">
          <h1>Estado de mesas.</h1>
          <div className="meseros"></div>
        </div>

        <div className="content">
          <div className="cuadrante">
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
                    {mesasActivas.map((mesaActiva) => (
                      <tr key={mesaActiva.numeroMesa}>
                        <td>{mesaActiva.numeroMesa}</td>
                        <td>{mesaActiva.disponibilidad}</td>
                        <td>{mesaActiva.numComensales}</td>
                      </tr>
                    ))}
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
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Docente;

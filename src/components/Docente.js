import React, { useState, useEffect } from "react"; // Importa React y los hooks useState y useEffect
import { db } from "../firebase/firebaseConfig"; // Importa la instancia de la base de datos desde Firebase
import { collection, onSnapshot } from "firebase/firestore"; // Importa funciones de Firestore para consultar y suscribirse a cambios en colecciones
import "../css/docente.css"; // Importa estilos CSS para el componente Docente
import regresar from '../assets/images/regresar.png'; // Importa la imagen para el botón de regresar
import { Link } from "react-router-dom"; // Importa el componente Link para la navegación

// Definición del componente funcional Docente
const Docente = () => {
  // Define el estado para almacenar la información de las mesas activas
  const [mesasActivas, setMesasActivas] = useState([]);

  // Efecto que se ejecuta al montar el componente para suscribirse a cambios en la colección "pedidos"
  useEffect(() => {
    console.log("Ejecutando useEffect para Mesas Activas");

    // Función para obtener y actualizar las mesas activas en tiempo real
    const unsubscribeMesas = onSnapshot(collection(db, "pedidos"), (querySnapshot) => {
      const mesasActivasTemp = [];

      // Itera sobre cada documento en la colección de pedidos
      querySnapshot.forEach((pedidoDoc) => {
        const pedidosArray = Object.values(pedidoDoc.data().pedido);

        // Itera sobre cada pedido dentro del documento
        pedidosArray.forEach((platilloPedido) => {
          const mesa = platilloPedido.mesa;
          const estadoOrden = platilloPedido.estadoOrden;

          // Verifica si la mesa está ocupada y actualiza el estado de las mesas activas
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

      // Actualiza el estado de las mesas activas con los datos obtenidos
      console.log("Mesas Activas recuperadas:", mesasActivasTemp);
      setMesasActivas(mesasActivasTemp);
    });
    // Retorna una función de limpieza para cancelar la suscripción a los cambios en la colección "pedidos"
    return () => unsubscribeMesas();
  }, []); // El efecto se ejecuta solo una vez al montar el componente

  // Retorna la estructura JSX del componente Docente
  return (
    <React.Fragment>
      <div className="header_Line">
        {/* Línea divisoria */}
        <hr className="line" />
        {/* Título de la página */}
        <h2 className="page_Title">Mi Circulo-Azul</h2>
      </div>
      {/* Enlace para regresar */}
      <Link to="/" style={{ textDecoration: 'none' }}><img className="img_Regresar_Cocina" src={regresar} /></Link>
      <div>
        <div className="header_Docente">
          {/* Título de la sección */}
          <h1>Estado de mesas.</h1>
          {/* Contenedor para meseros (vacío en esta versión) */}
          <div className="meseros"></div>
        </div>

        <div className="content">
          <div className="cuadrante">
            <div className="content_Docente">
              <div className="Mesas_Table_Docente">
                {/* Título de la tabla */}
                <h2>Mesas Simplificadas</h2>
                <table>
                  <thead>
                    <tr>
                      {/* Encabezados de la tabla */}
                      <th>Mesa</th>
                      <th>Disponibilidad</th>
                      <th>No. de clientes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Iteración sobre las mesas activas */}
                    {mesasActivas.map((mesaActiva) => (
                      <tr key={mesaActiva.numeroMesa}>
                        {/* Datos de cada mesa */}
                        <td>{mesaActiva.numeroMesa}</td>
                        <td>{mesaActiva.disponibilidad}</td>
                        <td>{mesaActiva.numComensales}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="Mesas_Table_Docente">
                {/* Título de la segunda tabla */}
                <h2>Mesas Detalladas</h2>
                <table>
                  <thead>
                    <tr>
                      {/* Encabezados de la tabla */}
                      <th>Interacciones</th>
                      <th>Comida</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Ejemplo de fila detallada (puedes agregar más según sea necesario) */}
                    <tr>
                      <td>selecciono mesa 1</td>
                      <td>Chilaquiles Verdes con Pollo - 2</td>
                      <td>Correcto</td>
                    </tr>
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
// Exporta el componente Docente para App
export default Docente;

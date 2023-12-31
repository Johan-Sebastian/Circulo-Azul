import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { initializeApp } from 'firebase/app';
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { query, where, getDocs, getDoc, runTransaction} from 'firebase/firestore';
import "../css/cocina.css";


const Cocina = () => {
  const [platillosSolicitados, setPlatillosSolicitados] = useState([]);
  const [ordenesPendientes, setOrdenesPendientes] = useState({});
  const [ordenesEnPreparacion, setOrdenesEnPreparacion] = useState({});
  const [ordenesFinalizadas, setOrdenesFinalizadas] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "pedidos"), (querySnapshot) => {
      const contadorPedidos = {};
      const ordenesPendientesTemp = {};
      const ordenesEnPreparacionTemp = {};
      const ordenesFinalizadasTemp = {};

      querySnapshot.forEach((pedidoDoc) => {
        const pedidoData = pedidoDoc.data();
        const pedidosArray = Object.values(pedidoData.pedido);
  
        pedidosArray.forEach((platilloPedido) => {
          const nombrePedido = platilloPedido.platillo;
          const mesa = platilloPedido.mesa;

          contadorPedidos[nombrePedido] = (contadorPedidos[nombrePedido] || 0) + 1;

          // Filtra las órdenes según su estado
          if (platilloPedido.estadoOrden === "pendiente") {
            agregarOrden(ordenesPendientesTemp, mesa, nombrePedido, platilloPedido);
          } else if (platilloPedido.estadoOrden === "preparacion") {
            agregarOrden(ordenesEnPreparacionTemp, mesa, nombrePedido, platilloPedido);
          } else if (platilloPedido.estadoOrden === "finalizado") {
            agregarOrden(ordenesFinalizadasTemp, mesa, nombrePedido, platilloPedido);
          }
        });
      });

      // Construye la lista de platillos con información de conteo
      const platillosEnPedidos = Object.keys(contadorPedidos).map((nombrePedido) => {
        const platillosPedido = querySnapshot.docs
          .flatMap((pedidoDoc) => pedidoDoc.data().pedido)
          .filter((platilloPedido) => platilloPedido.platillo === nombrePedido && platilloPedido.estadoOrden !== "liberado");
      
        if (platillosPedido.length > 0) {
          return {
            contador: `${contadorPedidos[nombrePedido]}`,
            nombre: `${nombrePedido}`,
            imagen: platillosPedido[0].imgPlatillo || "URL_POR_DEFECTO",
          };
        } else {
          return null;
        }
      }).filter(Boolean);

      setPlatillosSolicitados(platillosEnPedidos);
      setOrdenesPendientes(ordenesPendientesTemp);
      setOrdenesEnPreparacion(ordenesEnPreparacionTemp);
      setOrdenesFinalizadas(ordenesFinalizadasTemp);
    });

    return () => unsubscribe();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

   // Función para agregar una orden a la lista correspondiente
   const agregarOrden = (ordenes, mesa, nombrePedido, platilloPedido) => {
    if (!ordenes[mesa]) {
      ordenes[mesa] = [];
    }

    const platilloExistente = ordenes[mesa].find((orden) => orden.nombrePedido === nombrePedido);

    if (platilloExistente) {
      platilloExistente.numeroOrden += 1;
    } else {
      ordenes[mesa].push({
        numeroOrden: 1,
        nombrePedido,
        imagenPlatillo: platilloPedido.imgPlatillo || "URL_POR_DEFECTO",
      });
    }
  };






  const actualizarEstado = async (NumeroMesa, estadoActual, nuevoEstado) => {
    try {
      const pedidosSnapshot = await getDocs(collection(db, "pedidos"));
  
      // Filtra los documentos que tienen el mismo número de NumeroMesa y el mismo estadoOrden
      const documentosFiltrados = pedidosSnapshot.docs.filter((doc) => {
        const pedidos = doc.data().pedido;
        return pedidos.some(
          (platilloPedido) =>
            platilloPedido.mesa === NumeroMesa && platilloPedido.estadoOrden === estadoActual
        );
      });
  
      // Actualiza cada documento que cumple con la condición
      await Promise.all(
        documentosFiltrados.map(async (doc) => {
          const pedidoId = doc.id;
          const pedidoData = doc.data();
          const pedidos = pedidoData.pedido;
  
          // Filtra los platillos específicos que cumplen con la condición
          const platillosFiltrados = pedidos.filter(
            (platilloPedido) =>
              platilloPedido.mesa === NumeroMesa && platilloPedido.estadoOrden === estadoActual
          );
  
          // Actualiza el estado de todos los platillos que cumplen con la condición
          platillosFiltrados.forEach((platillo) => {
            platillo.estadoOrden = nuevoEstado;
          });
  
          // Actualiza el documento con el nuevo array de pedidos
          await updateDoc(doc.ref, { pedido: pedidos });
        })
      );
  
      console.log(`Actualizando estado de la mesa: ${NumeroMesa}`);
      console.log(`Actualizando estado a: ${nuevoEstado}`);
      console.log(`Estado actualizado correctamente.`);
    } catch (error) {
      console.error("Error al actualizar el estado de la orden:", error);
    }
  };



  return (
    <React.Fragment>
      <div className="header_Line">
          <hr className="line" />
          <h2 className="page_Title">Mi Circulo-Azul</h2>
      </div>
      <div class="Ordenes_Cocina">
        <div className="Orden_Menu_Cocina">
          <h2>Platillos Solicitados</h2>
          {platillosSolicitados.map((platillo, index) => (
            <div class="Cuadro_Izquierda_Cocina" key={index}>
              <tr class="no_padding_Vertical">
                <td class="No_border_right_width">
                  <div class="Texto_Cocina">
                    {platillo.contador}
                  </div>
                </td>
                <td>
                  <b>{platillo.nombre}</b>
                </td>
              </tr>
              <tr>
                <th colspan="2">
                  <img
                    className="imagen_recortada"
                    src={platillo.imagen}
                    alt={`Platillo ${platillo.nombre}`}
                  />
                </th>
              </tr>
              {/* Puedes agregar más información según la estructura de tu platillo */}
            </div>
          ))}
        </div>

        <div className="seccionesMenuCocina">
          
            <div >
              <div className="section_Cocina">
                <h2>Órdenes Pendientes</h2>
              </div>


              <div className="Numero_Mesa_Cocina">
              {Object.entries(ordenesPendientes).map(([mesa, ordenesPorMesaArray]) => (
                <div className="displey_Cocina" key={mesa}>
                  <td className="Quitar_Borde_Cocina">
                    {ordenesPorMesaArray.map((orden, index) => (
                      <div className="table_Cocina" key={index}>
                        <tr>
                          <th colSpan="2">{orden.nombrePedido}</th>
                        </tr>
                        <tr className="no_padding_Cocina">
                          <td className="No_border_right_width">{orden.numeroOrden}</td>
                          <td className="No_border_laterals_width">
                            <img className="imagen_recortada" src={orden.imagenPlatillo} alt={orden.nombrePedido} />
                          </td>
                        </tr>
                      </div>
                    ))}
                  </td>
                  <div rowSpan="2" className="Cubrir_Alto_Cocina" key={mesa}>
                    <div class="Ajustar_Texto_Cocina"><h2>{mesa}</h2></div>
                  </div>
                  <div className="contenedor_vertical_Cocina">
                  <button className="boton_Cocina" onClick={() => actualizarEstado(mesa, "pendiente", "preparacion")}>
                      ⇓
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="section_Cocina">
                <h2>Órdenes en Preparación</h2>
            </div>
          </div>






          <div className="Numero_Mesa_Cocina">
            {Object.entries(ordenesEnPreparacion).map(([mesa, ordenesPorMesaArray]) => (
                  <div className="displey_Cocina">
                    <td className="Quitar_Borde_Cocina">
                      {ordenesPorMesaArray.map((orden, index) => (
                        <div className="table_Cocina" key={index}>
                          <tr>
                            <th colSpan="2">{orden.nombrePedido}</th>
                          </tr>

                          <tr className="no_padding_Cocina">
                            <td className="No_border_right_width">{orden.numeroOrden}</td>

                            <td className="No_border_laterals_width">
                              <img className="imagen_recortada" src={orden.imagenPlatillo} alt={orden.nombrePedido} />
                            </td>
                          </tr>
                          
                        </div>
                      ))}
                    </td>
                    <div rowSpan="2" className="Cubrir_Alto_Cocina" key={mesa}>
                      <div class="Ajustar_Texto_Cocina"><h2>{mesa}</h2></div>
                      
                    </div>
                    <div className="contenedor_vertical_Cocina">
                      <button className="boton_Cocina" onClick={() => actualizarEstado(mesa, "preparacion", "pendiente")}>
                        ⇑
                      </button>
                      <button className="boton_Cocina" onClick={() => actualizarEstado(mesa, "preparacion", "finalizado")}>
                        ⇓
                      </button>
                    </div>
                  </div>
                ))}
              </div>

          

          <div>
            <div className="section_Cocina">
                <h2>Órdenes Finalizadas</h2>
            </div>



            <div className="Numero_Mesa_Cocina">
              {Object.entries(ordenesFinalizadas).map(([mesa, ordenesPorMesaArray]) => (
                  <div className="displey_Cocina">
                    <td className="Quitar_Borde_Cocina">
                      {ordenesPorMesaArray.map((orden, index) => (
                        <div className="table_Cocina" key={index}>
                          <tr>
                            <th colSpan="2">{orden.nombrePedido}</th>
                          </tr>

                          <tr className="no_padding_Cocina">
                            <td className="No_border_right_width">{orden.numeroOrden}</td>

                            <td className="No_border_laterals_width">
                              <img className="imagen_recortada" src={orden.imagenPlatillo} alt={orden.nombrePedido} />
                            </td>
                          </tr>
                          
                        </div>
                      ))}
                    </td>
                    <div rowSpan="2" className="Cubrir_Alto_Cocina" key={mesa}>
                      <div class="Ajustar_Texto_Cocina"><h2>{mesa}</h2></div>
                      
                    </div>
                    <div className="contenedor_vertical_Cocina">
                      <button className="boton_Cocina" onClick={() => actualizarEstado(mesa, "finalizado", "preparacion")}>
                        ⇑
                      </button>
                      <button className="boton_Cocina" onClick={() => actualizarEstado(mesa, "finalizado", "liberado")}>
                      ⊗
                      </button>
                    </div>
                  </div>
                ))}
              </div>



          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Cocina;
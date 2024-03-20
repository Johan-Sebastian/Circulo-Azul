import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot, getDocs, updateDoc } from "firebase/firestore";
import "../css/cocina.css";
import regresar from '../assets/images/regresar.png';
import { Link } from "react-router-dom";

import PDF from './PDF'

const Cocina = () => {
  const pdfMethods = PDF();


  const [mesasDB, setMesasDB] = useState([]);
  console.log("Mesas cargadas:", mesasDB);
  
  const [mostrarCapa, setMostrarCapa] = useState(false);
  console.log("Estado de mostrarCapaA:", mostrarCapa);
  const [mesasSeleccionadas, setMesasSeleccionadas] = useState([]);

  
  const [platillosSolicitados, setPlatillosSolicitados] = useState([]);
  const [frutasSolicitadas, setFrutasSolicitadas] = useState([]);
  const [bebidasSolicitadas, setBebidasSolicitadas] = useState([]);

  const [ordenesPendientes, setOrdenesPendientes] = useState({});
  const [ordenesEnPreparacion, setOrdenesEnPreparacion] = useState({});
  const [ordenesFinalizadas, setOrdenesFinalizadas] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "pedidos"), (querySnapshot) => {
      const contadorPlatillos = {};
      const contadorFrutas = {};
      const contadorBebidas = {};
      const ordenesPendientesTemp = {};
      const ordenesEnPreparacionTemp = {};
      const ordenesFinalizadasTemp = {};

      querySnapshot.forEach((pedidoDoc) => {
        const pedidoData = pedidoDoc.data();
        const pedidosArray = Object.values(pedidoData.pedido);

        pedidosArray.forEach((platilloPedido) => {
          const nombrePedido = platilloPedido.platillo;
          const nombreFruta = platilloPedido.fruta;
          const nombreBebida = platilloPedido.bebida;
          const mesa = platilloPedido.mesa;

          if (platilloPedido.estadoOrden !== "liberado") {
            if (platilloPedido.estadoOrden === "pendiente") {
              agregarOrden(
                ordenesPendientesTemp,
                mesa,
                platilloPedido.platillo,
                platilloPedido.imgPlatillo || "URL_POR_DEFECTO"
              );
            }
            if (platilloPedido.estadoOrden === "preparacion") {
              agregarOrden(
                ordenesEnPreparacionTemp,
                mesa,
                platilloPedido.platillo,
                platilloPedido.imgPlatillo || "URL_POR_DEFECTO"
              );
            }
            if (platilloPedido.estadoOrden === "finalizado") {
              agregarOrden(
                ordenesFinalizadasTemp,
                mesa,
                platilloPedido.platillo,
                platilloPedido.imgPlatillo || "URL_POR_DEFECTO"
              );
            }
          }

          // Verifica si es una fruta y no tiene estado "liberado"
          if (nombrePedido && platilloPedido.estadoOrden !== "liberado") {
            contadorPlatillos[nombrePedido] = (contadorPlatillos[nombrePedido] || 0) + 1;
          }
          if (nombreFruta && platilloPedido.estadoOrden !== "liberado") {
            contadorFrutas[nombreFruta] = (contadorFrutas[nombreFruta] || 0) + 1;
          }
          // Verifica si es una bebida y no tiene estado "liberado"
          if (nombreBebida && platilloPedido.estadoOrden !== "liberado") {
            contadorBebidas[nombreBebida] = (contadorBebidas[nombreBebida] || 0) + 1;
          }
        });

        pedidosArray.forEach((platilloPedido) => {
          const mesa = platilloPedido.mesa;

          if (platilloPedido.estadoOrden === "pendiente") {
            agregarOrden(
              ordenesPendientesTemp,
              mesa,
              platilloPedido.fruta,
              platilloPedido.imgFruta || "URL_POR_DEFECTO"
            );
          }
          if (platilloPedido.estadoOrden === "preparacion") {
            agregarOrden(
              ordenesEnPreparacionTemp,
              mesa,
              platilloPedido.fruta,
              platilloPedido.imgFruta || "URL_POR_DEFECTO"
            );
          }
          if (platilloPedido.estadoOrden === "finalizado") {
            agregarOrden(
              ordenesFinalizadasTemp,
              mesa,
              platilloPedido.fruta,
              platilloPedido.imgFruta || "URL_POR_DEFECTO"
            );
          }
        });
        
        pedidosArray.forEach((platilloPedido) => {
          const mesa = platilloPedido.mesa;

          if (platilloPedido.estadoOrden === "pendiente") {
            agregarOrden(
              ordenesPendientesTemp,
              mesa,
              platilloPedido.bebida,
              platilloPedido.imgBebida || "URL_POR_DEFECTO"
            );
          }
          if (platilloPedido.estadoOrden === "preparacion") {
            agregarOrden(
              ordenesEnPreparacionTemp,
              mesa,
              platilloPedido.bebida,
              platilloPedido.imgBebida || "URL_POR_DEFECTO"
            );
          }
          if (platilloPedido.estadoOrden === "finalizado") {
            agregarOrden(
              ordenesFinalizadasTemp,
              mesa,
              platilloPedido.bebida,
              platilloPedido.imgBebida || "URL_POR_DEFECTO"
            );
          }
        });
      });

      // Construye la lista de platillos con información de conteo
      const platillosEnPedidos = Object.keys(contadorPlatillos).map((nombrePedido) => {
        return {
          contador: `${contadorPlatillos[nombrePedido]}`,
          nombre: `${nombrePedido}`,
          imgPlatillo: querySnapshot.docs
            .find((pedidoDoc) => pedidoDoc.data().pedido.some((platilloPedido) => platilloPedido.platillo === nombrePedido))
            .data().pedido.find((platilloPedido) => platilloPedido.platillo === nombrePedido)?.imgPlatillo || "URL_POR_DEFECTO",
        };
      });
  
      const frutasEnPedidos = Object.keys(contadorFrutas).map((nombreFruta) => {
        return {
          contador: `${contadorFrutas[nombreFruta]}`,
          nombre: `${nombreFruta}`,
          imgFruta: querySnapshot.docs
            .find((pedidoDoc) => pedidoDoc.data().pedido.some((platilloPedido) => platilloPedido.fruta === nombreFruta))
            .data().pedido.find((platilloPedido) => platilloPedido.fruta === nombreFruta)?.imgFruta || "URL_POR_DEFECTO",
        };
      });
  
      const bebidasEnPedidos = Object.keys(contadorBebidas).map((nombreBebida) => {
        return {
          contador: `${contadorBebidas[nombreBebida]}`,
          nombre: `${nombreBebida}`,
          imgBebida: querySnapshot.docs
            .find((pedidoDoc) => pedidoDoc.data().pedido.some((platilloPedido) => platilloPedido.bebida === nombreBebida))
            .data().pedido.find((platilloPedido) => platilloPedido.bebida === nombreBebida)?.imgBebida || "URL_POR_DEFECTO",
        };
      });

      console.log("Platillos Solicitados:", platillosEnPedidos);
      console.log("Frutas Solicitadas:", frutasEnPedidos);
      console.log("Bebidas Solicitadas:", bebidasEnPedidos);

      setPlatillosSolicitados(platillosEnPedidos);
      setFrutasSolicitadas(frutasEnPedidos);
      setBebidasSolicitadas(bebidasEnPedidos);
      setOrdenesPendientes(ordenesPendientesTemp);
      setOrdenesEnPreparacion(ordenesEnPreparacionTemp);
      setOrdenesFinalizadas(ordenesFinalizadasTemp);
    });

    

    return () => unsubscribe();
  }, []);

  const agregarOrden = (ordenes, mesa, nombrePedido, imagenPlatillo) => {
    if (!ordenes[mesa]) {
      ordenes[mesa] = [];
    }
  
    // Verifica que el platillo tenga un nombre y no esté en estado "liberado"
    if (nombrePedido && nombrePedido.trim() !== "" && nombrePedido !== "liberado") {
      const platilloExistente = ordenes[mesa].find(
        (orden) => orden.nombrePedido === nombrePedido
      );
  
      if (platilloExistente) {
        platilloExistente.numeroOrden += 1;
      } else {
        ordenes[mesa].push({
          numeroOrden: 1,
          nombrePedido,
          imagenPlatillo: imagenPlatillo || "URL_POR_DEFECTO",
        });
      }
    }
  };

  const actualizarEstado = async (NumeroMesa, estadoActual, nuevoEstado) => {
    try {
      const horaFechaActual = new Date().toISOString(); // Obtiene la hora y fecha actual
  
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
  
          // Registra la hora y fecha en la ubicación deseada
          const horaFechaKey = `horaFecha${nuevoEstado.charAt(0).toUpperCase()}${nuevoEstado.slice(1)}`; // Construye la clave para la hora y fecha
          await updateDoc(doc.ref, { pedido: pedidos, [horaFechaKey]: horaFechaActual }); // Actualiza la hora y fecha en la base de datos
        })
      );
  
      console.log(`Actualizando estado de la mesa: ${NumeroMesa}`);
      console.log(`Actualizando estado a: ${nuevoEstado}`);
      console.log(`Estado actualizado correctamente.`);
    } catch (error) {
      console.error("Error al actualizar el estado de la orden:", error);
    }
  };

  const [mostrarImagenes, setMostrarImagenes] = useState({});// Usamos un objeto para almacenar el estado por mesa
  
  return (
    <React.Fragment>
      <div className="header_Line">
          <hr className="line" />
          <h2 className="page_Title">Mi Circulo-Azul</h2>
      </div>

      <Link to="/" style={{ textDecoration: 'none' }}><img className="img_Regresar_Cocina" src={regresar} /></Link>


      <div>
        <button className="Boton_PDF_Cocina" onClick={pdfMethods.toggleCapa}>
          {pdfMethods.botonComandaText}
        </button>
        {pdfMethods.mostrarCapa && pdfMethods.renderCapaSeleccion()}
      </div>
      
      <div class="Ordenes_Cocina">
        <div className="Orden_Menu_Cocina">
          <h2>Platillos Solicitados</h2>

          {platillosSolicitados.map((platillo, index) => (
            <div className="Cuadro_Izquierda_Cocina" key={index}>
              <tr className="no_padding_Vertical">
                <td className="No_border_right_width">
                  <div className="Texto_Cocina">{platillo.contador}</div>
                </td>
                <td>
                  <b>{platillo.nombre}</b>
                </td>
              </tr>
              <tr>
                <th colSpan="2">
                  <img
                    className="imagen_recortada"
                    src={platillo.imgPlatillo}
                    alt={`Platillo ${platillo.nombre}`}
                  />
                </th>
              </tr>
            </div>
          ))}

          {frutasSolicitadas.map((fruta, index) => (
            <div className="Cuadro_Izquierda_Cocina" key={index}>
              <tr className="no_padding_Vertical">
                <td className="No_border_right_width">
                  <div className="Texto_Frutas">{fruta.contador}</div>
                </td>
                <td>
                  <b>{fruta.nombre}</b>
                </td>
              </tr>
              <tr>
                <th colSpan="2">
                  <img
                    className="imagen_recortada"
                    src={fruta.imgFruta}
                    alt={`Fruta ${fruta.nombre}`}
                  />
                </th>
              </tr>
            </div>
          ))}

          {bebidasSolicitadas.map((bebida, index) => (
            <div className="Cuadro_Izquierda_Cocina" key={index}>
              <tr className="no_padding_Vertical">
                <td className="No_border_right_width">
                  <div className="Texto_Frutas">{bebida.contador}</div>
                </td>
                <td>
                  <b>{bebida.nombre}</b>
                </td>
              </tr>
              <tr>
                <th colSpan="2">
                  <img
                    className="imagen_recortada"
                    src={bebida.imgBebida}
                    alt={`Bebida ${bebida.nombre}`}
                  />
                </th>
              </tr>
            </div>
          ))}

        </div>
        <div className="seccionesMenuCocina">
          <div>
            <div className="section_Cocina">
              <h2>Órdenes Pendientes</h2>
            </div>

            <div className="Numero_Mesa_Cocina">
              {Object.entries(ordenesPendientes).map(([mesa, ordenesPorMesaArray]) => (
                <div className="displey_Cocina" key={mesa}>
                    <div className="contenedor_vertical_Cocina">
                      <button className="boton_2_Cocina" onClick={() => setMostrarImagenes(prevState => ({ ...prevState, [mesa]: !prevState[mesa] }))}>
                        {mostrarImagenes[mesa] ? "︾︽" : "︽︾"}
                      </button>
                    </div>
                    <td className="Quitar_Borde_Cocina">
                      {ordenesPorMesaArray.map((orden, index) => (
                        <div className="table_Cocina" key={index}>
                          {mostrarImagenes[mesa] ? (
                            <React.Fragment>
                              <tr>
                                <th colSpan="2">{orden.nombrePedido}</th>
                              </tr>
                              <tr className="no_padding_Cocina">
                                <td className="No_border_right_width">{orden.numeroOrden}</td>
                                <td className="No_border_laterals_width">
                                  <img
                                    className="imagen_recortada"
                                    src={orden.imagenPlatillo}
                                    alt={orden.nombrePedido}
                                  />
                                </td>
                              </tr>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <td className="tabla_Cocina">
                                <div className="No_border_right_width">{orden.numeroOrden}</div>
                              </td>
                              <td className="tabla_Texto_Cocina">{orden.nombrePedido}</td>
                            </React.Fragment>
                          )}
                        </div>
                      ))}
                    </td>
                  <div rowSpan="2" className="Cubrir_Alto_Cocina" key={mesa}>
                    <div class="Ajustar_Texto_Cocina">
                      <h2>{mesa}</h2>
                    </div>
                  </div>
                  <div className="contenedor_vertical_Cocina">
                    <button className="boton_Cocina" onClick={() => actualizarEstado(mesa, "pendiente", "preparacion")}>
                      ⇓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="section_Cocina">
                <h2>Órdenes en Preparación</h2>
            </div>

            <div className="Numero_Mesa_Cocina">
              {Object.entries(ordenesEnPreparacion).map(([mesa, ordenesPorMesaArray]) => (
                <div className="displey_Cocina" key={mesa}>
                  <div className="contenedor_vertical_Cocina">
                      <button className="boton_2_Cocina"onClick={() => setMostrarImagenes(prevState => ({ ...prevState, [mesa]: !prevState[mesa] }))}>
                        {mostrarImagenes[mesa] ? "︾︽" : "︽︾"}
                      </button>
                    </div>
                    <td className="Quitar_Borde_Cocina">
                      {ordenesPorMesaArray.map((orden, index) => (
                        <div className="table_Cocina" key={index}>
                          {mostrarImagenes[mesa] ? (
                            <React.Fragment>
                              <tr>
                                <th colSpan="2">{orden.nombrePedido}</th>
                              </tr>
                              <tr className="no_padding_Cocina">
                                <td className="No_border_right_width">{orden.numeroOrden}</td>
                                <td className="No_border_laterals_width">
                                  <img
                                    className="imagen_recortada"
                                    src={orden.imagenPlatillo}
                                    alt={orden.nombrePedido}
                                  />
                                </td>
                              </tr>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <td className="tabla_Cocina">
                                <div className="No_border_right_width">{orden.numeroOrden}</div>
                              </td>
                              <td className="tabla_Texto_Cocina">{orden.nombrePedido}</td>
                            </React.Fragment>
                          )}
                        </div>
                      ))}
                    </td>
                  <div rowSpan="2" className="Cubrir_Alto_Cocina" key={mesa}>
                    <div class="Ajustar_Texto_Cocina">
                      <h2>{mesa}</h2>
                    </div>
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
          </div>
          <div>
          <div className="section_Cocina">
                <h2>Órdenes Finalizadas</h2>
            </div>
            <div className="Numero_Mesa_Cocina">
              {Object.entries(ordenesFinalizadas).map(([mesa, ordenesPorMesaArray]) => (
                <div className="displey_Cocina" key={mesa}>
                  <div className="contenedor_vertical_Cocina">
                      <button className="boton_2_Cocina"onClick={() => setMostrarImagenes(prevState => ({ ...prevState, [mesa]: !prevState[mesa] }))}>
                        {mostrarImagenes[mesa] ? "︾︽" : "︽︾"}
                      </button>
                    </div>
                    <td className="Quitar_Borde_Cocina">
                      {ordenesPorMesaArray.map((orden, index) => (
                        <div className="table_Cocina" key={index}>
                          {mostrarImagenes[mesa] ? (
                            <React.Fragment>
                              <tr>
                                <th colSpan="2">{orden.nombrePedido}</th>
                              </tr>
                              <tr className="no_padding_Cocina">
                                <td className="No_border_right_width">{orden.numeroOrden}</td>
                                <td className="No_border_laterals_width">
                                  <img
                                    className="imagen_recortada"
                                    src={orden.imagenPlatillo}
                                    alt={orden.nombrePedido}
                                  />
                                </td>
                              </tr>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <td className="tabla_Cocina">
                                <div className="No_border_right_width">{orden.numeroOrden}</div>
                              </td>
                              <td className="tabla_Texto_Cocina">{orden.nombrePedido}</td>
                            </React.Fragment>
                          )}
                        </div>
                      ))}
                    </td>
                  <div rowSpan="2" className="Cubrir_Alto_Cocina" key={mesa}>
                    <div class="Ajustar_Texto_Cocina">
                      <h2>{mesa}</h2>
                    </div>
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
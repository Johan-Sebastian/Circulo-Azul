import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot, getDocs, updateDoc } from "firebase/firestore";
import "../css/cocina.css";
import regresar from '../assets/images/regresar.png';
import { Link } from "react-router-dom";

import jsPDF from "jspdf";
import "jspdf-autotable";

import pdfjs from 'pdfjs-dist';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Cocina = () => {

  const [mesasConsecutivas, setMesasConsecutivas] = useState(Array.from({ length: 10 }, (_, i) => i + 1));
  const LoadingIndicator = () => <div>Loading...</div>;
  const [mesasDB, setMesasDB] = useState([]);
  const [mesasLoaded, setMesasLoaded] = useState(false);

  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [rangoFechas, setRangoFechas] = useState([null, null]);

  
  
  const [meseros, setMeseros] = useState(['Mesero1', 'Mesero2', 'Mesero3']);
  const [mostrarCapa, setMostrarCapa] = useState(false);
  const [mesasSeleccionadas, setMesasSeleccionadas] = useState([]);
  const [meserosSeleccionados, setMeserosSeleccionados] = useState([]);
  const [seleccion, setSeleccion] = useState('mesas');
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

    const obtenerMesasDB = async () => {
      try {
        const pedidosSnapshot = await getDocs(collection(db, "pedidos"));
    
        // Extraer mesas de los documentos de pedidos
        const mesasDesdeDB = pedidosSnapshot.docs.reduce((mesas, doc) => {
          const pedidoData = doc.data().pedido;
          const mesasEnPedido = pedidoData.map((platilloPedido) => platilloPedido.mesa);
          return [...mesas, ...mesasEnPedido];
        }, []);
    
        // Eliminar duplicados y ordenar las mesas
        const mesasUnicas = Array.from(new Set(mesasDesdeDB)).sort();
    
        setMesasDB(mesasUnicas);
      } catch (error) {
        console.error("Error al obtener las mesas desde la base de datos:", error);
      }
    };
    obtenerMesasDB();

    return () => unsubscribe();
  }, []);
  console.log("Mesas cargadas:", mesasDB);

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
          platillosFiltrados.forEach((fruta) => {
            fruta.estadoOrden = nuevoEstado;
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

  const [mostrarImagenes, setMostrarImagenes] = useState({});// Usamos un objeto para almacenar el estado por mesa
  const [botonComandaText, setBotonComandaText] = useState("Generar Comanda");

  const handleCheckboxChange = (mesa) => {
    const mesasSeleccionadasActualizadas = [...mesasSeleccionadas];

    if (mesasSeleccionadas.includes(mesa)) {
      // Si la mesa está seleccionada, quitarla de la lista
      const index = mesasSeleccionadasActualizadas.indexOf(mesa);
      mesasSeleccionadasActualizadas.splice(index, 1);
    } else {
      // Si la mesa no está seleccionada, agregarla a la lista
      mesasSeleccionadasActualizadas.push(mesa);
    }

    setMesasSeleccionadas(mesasSeleccionadasActualizadas);
  };

  const handleMeseroCheckboxChange = (mesero) => {
    const meserosSeleccionadosActualizados = [...meserosSeleccionados];

    if (meserosSeleccionados.includes(mesero)) {
      // Si el mesero está seleccionado, quitarlo de la lista
      const index = meserosSeleccionadosActualizados.indexOf(mesero);
      meserosSeleccionadosActualizados.splice(index, 1);
    } else {
      // Si el mesero no está seleccionado, agregarlo a la lista
      meserosSeleccionadosActualizados.push(mesero);
    }

    setMeserosSeleccionados(meserosSeleccionadosActualizados);
  };
  
  const generarComanda = () => {
    // Crear un nuevo objeto jsPDF
    const pdf = new jsPDF();
    const now = new Date();
  
    // Obtener la fecha y hora actual
    const fecha = now.getDate() + '_' + (now.getMonth() + 1) + '_' + now.getFullYear();
    const hora = now.getHours() + ';' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    const horas = now.getHours();
    const minutos = now.getMinutes();
  
    const mesa = localStorage.getItem('Mesa');
    const noClientes = localStorage.getItem('NoClientes');
    const platillos = JSON.parse(localStorage.getItem('ordenesList')) || [];
  
    // Nombre del archivo con la fecha y hora
    const nombreArchivo = `orden-${fecha}-${hora}.pdf`;
  
    // Agregar encabezado con información general
    pdf.text(`Fecha: ${fecha}  Hora: ${hora}`, 10, 10);
    pdf.text(`Mesa: ${mesa}  Número de Clientes: ${noClientes}`, 10, 20);
  
    // Agregar mesa seleccionada al título
    pdf.text(`Mesa Seleccionada: ${mesa}`, 10, 30);
  
    // Agregar tabla con platillos
    const platillosData = platillos.map((platillo) => {
      const cantidad = platillo.cantidad || 0;
      const precio = platillo.precio || 0;
  
      return [platillo.platillo || '', cantidad, precio.toFixed(2), cantidad * precio];
    });
  
    const headers = ['Platillo', 'Cantidad Total', 'Precio Unitario', 'Precio Total'];
  
    pdf.autoTable({
      startY: 40, // Ajusta la posición Y para evitar superposición con el título
      head: [headers],
      body: platillosData,
    });
  
    // Calcular y agregar el total
    const total = platillos.reduce((acc, platillo) => acc + platillo.cantidad * platillo.precio, 0);
    pdf.text(`Total: $${total.toFixed(2)}`, 10, pdf.autoTable.previous.finalY + 10);
  
    // Guardar o mostrar el PDF
    pdf.save(nombreArchivo);
  };

  const toggleCapa = () => {
    setMostrarCapa(!mostrarCapa);
    setMesasSeleccionadas([]);
    setMeserosSeleccionados([]);
    setBotonComandaText((prevText) => (prevText === "Generar Comanda" ? "Cerrar Comanda" : "Generar Comanda"));
  };
  const handleSelectAll = (tipo) => {
    if (tipo === 'mesas') {
      // Si hay mesas seleccionadas, deseleccionar todas, de lo contrario, seleccionar todas
      setMesasSeleccionadas((mesasSeleccionadas) => (mesasSeleccionadas.length === mesasDB.length ? [] : mesasDB));
    } else if (tipo === 'meseros') {
      // Si hay meseros seleccionados, deseleccionar todos, de lo contrario, seleccionar todos
      setMeserosSeleccionados((meserosSeleccionados) => (meserosSeleccionados.length === meseros.length ? [] : meseros));
    }
  };

  const renderCapaSeleccion = () => {
    console.log("Mesas en renderCapaSeleccion:", mesasDB);
    return (
      <div className="PDF_BackGround">
        <div className="PDF_Seleccion">
          <button
            className={`PDF_Button ${seleccion === 'mesas' ? 'seleccionado' : ''}`}
            onClick={() => setSeleccion('mesas')}
          >
            Mesas
          </button>
          <button
            className={`PDF_Button ${seleccion === 'meseros' ? 'seleccionado' : ''}`}
            onClick={() => setSeleccion('meseros')}
          >
            Meseros
          </button>
        </div>
        <h2 className="PDF_Title">Selecciona {seleccion === 'mesas' ? 'mesas' : 'meseros'}:</h2>
  
        {/* Agrega la opción de seleccionar todos */}
        <div className="PDF_Check_2">
          <label>
            <input
              type="checkbox" className="PDF_checkbox"
              checked={seleccion === 'mesas' ? mesasSeleccionadas.length === mesasDB.length : meserosSeleccionados.length === meseros.length}
              onChange={() => handleSelectAll(seleccion)}
            />
            Seleccionar Todos
          </label>
        </div>

        <div className="PDF_Fecha">
          <DatePicker
            selected={rangoFechas.startDate}
            onChange={(date) => setRangoFechas({ ...rangoFechas, startDate: date })}
            selectsStart
            startDate={rangoFechas.startDate}
            endDate={rangoFechas.endDate}
            dateFormat="dd/MM/yyyy"
            placeholderText="Fecha inicial"
          />
          <span> - </span>
          <DatePicker
            selected={rangoFechas.endDate}
            onChange={(date) => setRangoFechas({ ...rangoFechas, endDate: date })}
            selectsEnd
            startDate={rangoFechas.startDate}
            endDate={rangoFechas.endDate}
            minDate={rangoFechas.startDate}
            dateFormat="dd/MM/yyyy"
            placeholderText="Fecha Final"
          />
        </div>
        <div className="PDF_Title_2">
          {seleccion === 'mesas' ? (
            mesasDB.map((mesa) => (
              <div key={mesa}>
                <label className="PDF_Check">
                  <input
                    type="checkbox" className="PDF_checkbox"
                    value={mesa}
                    checked={mesasSeleccionadas.includes(mesa)}
                    onChange={() => handleCheckboxChange(mesa)}
                  />
                  Mesa {mesa}
                </label>
              </div>
            ))
          ) : (
            meseros.map((mesero) => (
              <div key={mesero} className="PDF_Check">
                <label>
                  <input
                    type="checkbox" className="PDF_checkbox"
                    value={mesero}
                    checked={meserosSeleccionados.includes(mesero)}
                    onChange={() => handleMeseroCheckboxChange(mesero)}
                  />
                  {mesero}
                </label>
              </div>
            ))
          )}
        </div>
        <button className="PDF_Button" onClick={generarComanda}>Generar Comanda</button>
      </div>
    );
  };
  const mesasFiltradas = mesasDB.filter((mesa) => {
    if (rangoFechas[0] && rangoFechas[1]) {
      const fechaMesa = new Date(mesa.fecha);
      return (
        mesasSeleccionadas.includes(mesa) &&
        fechaMesa >= rangoFechas[0] &&
        fechaMesa <= rangoFechas[1]
      );
    } else {
      return mesasSeleccionadas.includes(mesa);
    }
  });

  return (
    <React.Fragment>
      <div className="header_Line">
          <hr className="line" />
          <h2 className="page_Title">Mi Circulo-Azul</h2>
      </div>

      <Link to="/" style={{ textDecoration: 'none' }}><img className="img_Regresar_Cocina" src={regresar} /></Link>


      <div>
        <button className="Boton_PDF_Cocina" onClick={toggleCapa}>
          {botonComandaText}
        </button>
      </div>

      {mostrarCapa && renderCapaSeleccion()}



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
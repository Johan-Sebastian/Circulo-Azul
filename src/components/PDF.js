import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot, getDocs, getDoc, doc } from "firebase/firestore";
import "../css/cocina.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const getProductosPorIDPDF = (IDSeleccionadas, querySnapshot, tipoProducto) => {
  const contadorProductos = {};
  const productosEnPedidos = [];

  querySnapshot.forEach((pedidoDoc) => {
    const pedidoData = pedidoDoc.data();
    const pedidosArray = pedidoData.pedido;

    pedidosArray.forEach((platilloPedido) => {
      const nombreProducto = platilloPedido[tipoProducto];
      const idPedido = pedidoDoc.id;

      if (IDSeleccionadas.includes(idPedido) && nombreProducto) {
        contadorProductos[nombreProducto] = (contadorProductos[nombreProducto] || 0) + 1;
      }
    });
  });

  productosEnPedidos.push(
    ...Object.keys(contadorProductos).map((nombreProducto) => {
      return {
        contador: `${contadorProductos[nombreProducto]}`,
        nombre: `${nombreProducto}`,
        imgProducto: querySnapshot.docs
          .find((pedidoDoc) => pedidoDoc.data().pedido.some((platilloPedido) => platilloPedido[tipoProducto] === nombreProducto))
          .data().pedido.find((platilloPedido) => platilloPedido[tipoProducto] === nombreProducto)?.[`img${tipoProducto.charAt(0).toUpperCase() + tipoProducto.slice(1)}`] || "URL_POR_DEFECTO",
      };
    })
  );

  return productosEnPedidos;
};

const PDF = () => {

  const [idDB, setidDB] = useState([]);
  const [rangoFechas, setRangoFechas] = useState([null, null]);
  const [mesasDB, setMesasDB] = useState([]);
  const [MeserosDB, setMeserosDB] = useState([]);
  const [meserosSeleccionados, setMeserosSeleccionados] = useState([]);
  const [seleccion, setSeleccion] = useState('mesas');
  const [botonComandaText, setBotonComandaText] = useState("Generar Comanda");
  const [IDSeleccionadas, setIDSeleccionadas] = useState([]);
  const [mesasSeleccionadas, setMesasSeleccionadas] = useState([]);
  const [mostrarCapa, setMostrarCapa] = useState(false);
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [IDsPorFechaSeleccionados, setIDsPorFechaSeleccionados] = useState([]);
  const [IDsSeleccionadosI, setIDsSeleccionadosI] = useState([]);

  const alternarOrden = () => {
    setOrdenAscendente((prevOrden) => !prevOrden);
    setIDSeleccionadas([]);
    setMesasSeleccionadas([]);
    setMeserosSeleccionados([]);
  };

  const ordenarIDs = (IDs) => {
    return ordenAscendente ? IDs.sort((a, b) => b.localeCompare(a)) : IDs.sort((a, b) => a.localeCompare(b));
  };

  useEffect(() => {
    const obtenerIDDB = async () => {
      try {
        const pedidosSnapshot = await getDocs(collection(db, "pedidos"));
        let IDDesdeDB = pedidosSnapshot.docs.map(doc => doc.id);
  
        // Ordenar los IDs según la dirección del ordenamiento
        IDDesdeDB = ordenarIDs(IDDesdeDB);
  
        setidDB(IDDesdeDB);
      } catch (error) {
        console.error("Error al obtener las IDs desde la base de datos:", error);
      }
    };
    
  
    const obtenerDatosDB = async () => { // ya
      try {
        // Suscribirse a cambios en la colección "pedidos"
        const unsubscribe = onSnapshot(collection(db, "pedidos"), (querySnapshot) => {
          // Crear objetos para almacenar las mesas y meseros con sus respectivos IDs
          const mesasConIDs = {};
          const MeserosConIDs = {};
  
          // Iterar sobre los documentos de pedidos
          querySnapshot.forEach((doc) => {
            const pedidoData = doc.data().pedido;
  
            // Iterar sobre los pedidos en cada documento
            pedidoData.forEach((platilloPedido) => {
              const mesa = platilloPedido.mesa;
              const Mesero = platilloPedido.Mesero;
              const idPedido = doc.id;
  
              // Procesar mesas
              if (mesasConIDs[mesa]) {
                mesasConIDs[mesa].push(idPedido);
              } else {
                mesasConIDs[mesa] = [idPedido];
              }
  
              // Procesar meseros
              if (MeserosConIDs[Mesero]) {
                MeserosConIDs[Mesero].push(idPedido);
              } else {
                MeserosConIDs[Mesero] = [idPedido];
              }
            });
          });
  
          // Convertir los objetos a arrays de objetos con la estructura { mesa/Mesero: [IDs] }
          const mesasArray = Object.entries(mesasConIDs).map(([mesa, IDs]) => ({ mesa, IDs }));
          const MeserosArray = Object.entries(MeserosConIDs).map(([Mesero, IDs]) => ({ Mesero, IDs }));
  
          console.log("Mesas con IDs cargadas desde la base de datos:", mesasArray);
          console.log("Meseros con IDs cargadas desde la base de datos:", MeserosArray);
  
          // Actualizar el estado de mesasDB y MeserosDB con los datos obtenidos de la base de datos
          setMesasDB(mesasArray);
          setMeserosDB(MeserosArray);
        });
  
        // Retornar una función de limpieza para dejar de escuchar los cambios en la colección "pedidos"
        return () => unsubscribe();
      } catch (error) {
        console.error("Error al obtener datos desde la base de datos:", error);
      }
    };
  
    obtenerIDDB();
    obtenerDatosDB();
  }, [ordenAscendente]);
  
  const obtenerInfoPedidoPorID = async (idPedido, info) => {
    try {
      const pedidoDocRef = doc(db, "pedidos", idPedido);
      const pedidoDoc = await getDoc(pedidoDocRef);
  
      switch (info) {
        case 'numClientes':
          return parseInt(pedidoDoc.data().pedido[0].noClientes, 10) || 0;
        case 'mesero':
          return pedidoDoc.data().pedido[0].Mesero || "N/A";
        case 'fechaHoraCreacion':
          const fechaHoraCreacion = pedidoDoc.data().fechaHora.toDate();
          const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short'
          };
          return new Intl.DateTimeFormat('es-ES', options).format(fechaHoraCreacion);
        default:
          throw new Error('Información de pedido no válida');
      }
    } catch (error) {
      console.error("Error al obtener información del pedido:", error);
      return "N/A";
    }
  };

  const obtenerCostoPorPedido = async () => {
    try {
      // Obtener el documento de la colección "Costo" con un ID específico
      const costoDocRef = doc(db, "Costo", "MXN$");
      const costoDocSnap = await getDoc(costoDocRef);
      
      // Verificar si el documento existe y contiene el campo "CostoPorPedido"
      if (costoDocSnap.exists()) {
        const costoPorPedido = costoDocSnap.data().CostoPorPedido;
        return costoPorPedido;
      } else {
        console.log("El documento no existe o no contiene el campo 'CostoPorPedido'.");
        return 0;
      }
    } catch (error) {
      console.error("Error al obtener el costo por pedido:", error);
      return 0;
    }
  };
  
  // Función para filtrar los IDs de pedidos por fecha
  const filtrarIDsPorFecha = async (fechaInicio, fechaFin) => {
    try {
      const pedidosSnapshot = await getDocs(collection(db, "pedidos"));
      const IDsFiltrados = [];
      const fechaFinDiaSiguiente = new Date(fechaFin); // Clonar la fecha final para asegurarse de no modificar el estado
    
      // Establecer la fecha final para incluir todo el día seleccionado
      fechaFinDiaSiguiente.setDate(fechaFinDiaSiguiente.getDate() + 1);
      fechaFinDiaSiguiente.setHours(0, 0, 0, 0); // Establecer a la medianoche del día siguiente
    
      pedidosSnapshot.forEach((doc) => {
        const fechaPedido = doc.data().fechaHora.toDate(); // Suponiendo que la fechaHora se almacena como un objeto Date en Firestore
        if (fechaPedido >= fechaInicio && fechaPedido < fechaFinDiaSiguiente) {
          IDsFiltrados.push(doc.id);
        }
      });
    
      return IDsFiltrados;
    } catch (error) {
      console.error("Error al filtrar los IDs de pedidos por fecha:", error);
      return [];
    }
  };
  
  const generarComanda = async (mostrarIDsPorFecha) => {
    const pdf = new jsPDF();
    const now = new Date();
    const fecha = now.getDate() + '_' + (now.getMonth() + 1) + '_' + now.getFullYear();
    const hora = now.getHours() + ';' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    const nombreArchivo = `orden-${fecha}-${hora}.pdf`;
    const IDsFiltradosPorFecha = await filtrarIDsPorFecha(rangoFechas[0], rangoFechas[1]);
    
    const tryCatchWrapper = async (callback) => {
      try {
        await callback();
      } catch (error) {
        console.error("Error al generar la comanda:", error);
      }
    };
  
    const ordenarPorNumeroMesa = (a, b) => {
      const mesaA = mesasDB.find((mesaItem) => mesaItem.IDs.includes(a))?.mesa || "";
      const mesaB = mesasDB.find((mesaItem) => mesaItem.IDs.includes(b))?.mesa || "";
      return mesaA.localeCompare(mesaB);
    };
  
    const ordenarPorNombreMesero = (a, b) => {
      const meseroA = MeserosDB.find((meseroItem) => meseroItem.IDs.includes(a))?.Mesero || "";
      const meseroB = MeserosDB.find((meseroItem) => meseroItem.IDs.includes(b))?.Mesero || "";
      return meseroA.localeCompare(meseroB);
    };
    
    const MesasOrdenadas = mostrarIDsPorFecha ? IDsPorFechaSeleccionados.slice().sort(seleccion === 'mesas' ? ordenarPorNumeroMesa : ordenarPorNombreMesero) : IDSeleccionadas.slice().sort(seleccion === 'mesas' ? ordenarPorNumeroMesa : ordenarPorNombreMesero);

    const agregarTablaPDF = (pdf, allData) => {
      const startY = 48;
      pdf.autoTable({
        startY: startY,
        head: [allData[0]],
        body: allData.slice(1),
        headStyles: {
          fillColor: [200, 220, 255],
          textColor: [82, 80, 80],
        },
      });
    };
    
    const obtenerDatosComanda = async (ID) => {
      const querySnapshot = await getDocs(collection(db, "pedidos"));
  
      // Verificar si la fecha inicial y la fecha final no son null
      const filtroPorFecha = rangoFechas[0] !== null && rangoFechas[1] !== null;
      
      // Verificar si el ID del pedido está dentro del rango de fechas (o no hay filtro de fecha)
      if (!filtroPorFecha || IDsFiltradosPorFecha.includes(ID)) {
        const platillosEnID = getProductosPorIDPDF([ID], querySnapshot, 'platillo');
        const frutasEnID = getProductosPorIDPDF([ID], querySnapshot, 'fruta');
        const bebidasEnID = getProductosPorIDPDF([ID], querySnapshot, 'bebida');
  
        // Agrupar los pedidos por ID
        const pedidosPorID = querySnapshot.docs.reduce((agrupados, doc) => {
          const pedidoData = doc.data().pedido;
          const pedidoID = doc.id;
  
          pedidoData.forEach((platilloPedido) => {
            if (platilloPedido.ID === ID) {
              agrupados[pedidoID] = agrupados[pedidoID] || [];
              agrupados[pedidoID].push(platilloPedido);
            }
          });
  
          return agrupados;
        }, {});
  
        // Crear una tabla separada para cada ID de pedido
        const tables = Object.entries(pedidosPorID).map(([pedidoID, platillosPedido]) => {
          return [
            { content: `Pedido ID: ${pedidoID}`, colSpan: 2, styles: { fontStyle: 'bold', fillColor: [200, 220, 255] } },
            {},
            ...platillosPedido.map((platilloPedido) => {
              return [platilloPedido.platillo || '', platilloPedido.cantidad || 0];
            }),
          ];
        });
  
        return [
          ['Platillo', 'Cantidad Total'],
          ...platillosEnID.map((platillo) => [platillo.nombre || '', platillo.contador || 0]),
          [{ content: 'Frutas', styles: { fontStyle: 'bold', fillColor: [200, 220, 255] } }, { content: 'Cantidad Total', styles: { fontStyle: 'bold', fillColor: [200, 220, 255] } }],
          ...frutasEnID.map((fruta) => [fruta.nombre || '', fruta.contador || 0]),
          [{ content: 'Bebidas', styles: { fontStyle: 'bold', fillColor: [200, 220, 255] } }, { content: 'Cantidad Total', styles: { fontStyle: 'bold', fillColor: [200, 220, 255] } }],
          ...bebidasEnID.map((bebida) => [bebida.nombre || '', bebida.contador || 0]),
          ...tables,
        ];
      } else {
        return null; // Retornar null si el ID está fuera del rango de fechas y hay filtro de fecha
      }
    };
    
    pdf.text(`Fecha: ${fecha}  Hora: ${hora}`, 10, 10);
    let contenidoAgregado = false; // Variable para controlar si se ha agregado contenido en la página actual
    for (const ID of MesasOrdenadas) {
      await tryCatchWrapper(async () => {
        const costoPorPedido = await obtenerCostoPorPedido();
        const numClientes = await obtenerInfoPedidoPorID(ID, 'numClientes');
        const mesero = await obtenerInfoPedidoPorID(ID, 'mesero');
        const fechaHoraCreacion = await obtenerInfoPedidoPorID(ID, 'fechaHoraCreacion');
        const numMesa = mesasDB.find((mesaItem) => mesaItem.IDs.includes(ID))?.mesa || "N/A"; // Obtener el número de mesa
        const allData = await obtenerDatosComanda(ID);

        if (allData) { // Solo agregar la tabla si hay datos disponibles
          if (!contenidoAgregado) {
            contenidoAgregado = true; // Se ha agregado contenido a la página actual
          } else {
            pdf.addPage(); // Agregar una nueva página si se ha agregado contenido previamente
          }
  
          pdf.text(`Mesa: ${numMesa}  Número de Clientes: ${numClientes || 0}`, 10, 20);
          pdf.text(`Fecha y hora: ${fechaHoraCreacion || 'N/A'}`, 10, 28); // Mostrar fechaHora después de "Número de Clientes"
          pdf.text(`Costo de la Orden: ${costoPorPedido * numClientes}`, 10, 36);
          pdf.text(`Mesero: ${mesero} `, 10, 44);
  
          agregarTablaPDF(pdf, allData);
        }
      });
    }

    const botonGenerarComanda = document.getElementById('boton-generar-comanda');
    if (contenidoAgregado) {
      botonGenerarComanda.disabled = false;
      botonGenerarComanda.innerText = "Generar Comanda";
      botonGenerarComanda.classList.remove('disabled'); // Remover la clase 'disabled'
      pdf.save(nombreArchivo);
    } else {
      botonGenerarComanda.disabled = true;
      botonGenerarComanda.innerText = "No hay datos disponibles";
      botonGenerarComanda.classList.add('disabled'); // Agregar la clase 'disabled'
    }
  };
  
  const toggleCapa = () => {
    console.log("Toggle Capa");
    setMostrarCapa(!mostrarCapa);
    setIDSeleccionadas([]);
    setMeserosSeleccionados([]);
    setBotonComandaText((prevText) => (prevText === "Generar Comanda" ? "Cerrar Comanda" : "Generar Comanda"));
  };

  const cambiarSeccion = (nuevaSeccion) => {
    // Limpiar las selecciones al cambiar de sección
    setIDSeleccionadas([]);
    setMesasSeleccionadas([]);
    setMeserosSeleccionados([]);
  
    // Establecer la nueva sección
    setSeleccion(nuevaSeccion);
  };

  const Reboot = () =>
  {
    const botonGenerarComanda = document.getElementById('boton-generar-comanda');
    botonGenerarComanda.disabled = false;
    botonGenerarComanda.innerText = "Generar Comanda";
    botonGenerarComanda.classList.remove('disabled');
  }

  const handleCheckboxChange = async (item, tipo) => {
    Reboot();
    // Copiar el array de IDs seleccionados
    let IDSeleccionadasActualizadas = [...IDSeleccionadas];
    let meserosSeleccionadosActualizadas = [...meserosSeleccionados];
  
    // Buscar el elemento seleccionado según el tipo
    const elementoSeleccionado = tipo === 'mesas' ? mesasDB.find((i) => i.mesa === item) : MeserosDB.find((i) => i.Mesero === item);
  
    if (elementoSeleccionado) {
      // Ordenar los IDs según la dirección del ordenamiento
      elementoSeleccionado.IDs = ordenarIDs(elementoSeleccionado.IDs);
  
      // Verificar si todos los IDs del elemento están seleccionados
      const todosSeleccionados = elementoSeleccionado.IDs.every((id) => IDSeleccionadasActualizadas.includes(id));
  
      // Si todos están seleccionados, deseleccionarlos; de lo contrario, seleccionarlos
      if (todosSeleccionados) {
        elementoSeleccionado.IDs.forEach((id) => {
          const index = IDSeleccionadasActualizadas.indexOf(id);
          if (index !== -1) {
            IDSeleccionadasActualizadas.splice(index, 1);
          }
        });
      } else {
        elementoSeleccionado.IDs.forEach((id) => {
          if (!IDSeleccionadasActualizadas.includes(id)) {
            IDSeleccionadasActualizadas.push(id);
          }
        });
      }
    }
  
    // Actualizar el estado de IDSeleccionadas con los IDs actualizados
    setIDSeleccionadas(IDSeleccionadasActualizadas);
  
    // Actualizar el estado de meserosSeleccionados
    if (tipo === 'mesas') {
      const mesasSeleccionadasActualizadas = [...mesasSeleccionadas];
      if (mesasSeleccionadas.includes(item)) {
        // Si el elemento está seleccionado, quitarlo de la lista
        const index = mesasSeleccionadasActualizadas.indexOf(item);
        mesasSeleccionadasActualizadas.splice(index, 1);
      } else {
        // Si el elemento no está seleccionado, agregarlo a la lista
        mesasSeleccionadasActualizadas.push(item);
      }
      setMesasSeleccionadas(mesasSeleccionadasActualizadas);
    } else { // Si el tipo es meseros
      if (meserosSeleccionados.includes(item)) {
        // Si el mesero está seleccionado, quitarlo de la lista
        const index = meserosSeleccionadosActualizadas.indexOf(item);
        meserosSeleccionadosActualizadas.splice(index, 1);
      } else {
        // Si el mesero no está seleccionado, agregarlo a la lista
        meserosSeleccionadosActualizadas.push(item);
      }
      setMeserosSeleccionados(meserosSeleccionadosActualizadas);
    }
  };
  
  const limpiarRangoFechas = () => {
    window.rebootTriggered = false; // Indica que limpiarRangoFechas se está llamando
    setRangoFechas([null, null]);
  
    // Activar Reboot() si hay al menos una opción seleccionada
    if (IDSeleccionadas.length > 0 || mesasSeleccionadas.length > 0 || meserosSeleccionados.length > 0) {
      Reboot();
    }
  };

  const handleDateRangeChange = (dates) => {
    const [fechaInicio, fechaFin] = dates;
    // Verificar si se seleccionó una fecha inicial y una fecha final
    if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
      setRangoFechas([fechaInicio, null]); // Ve si la fecha inicial supera a la fecha final
    } else if (fechaInicio && !fechaFin) {
      setRangoFechas([fechaInicio, fechaInicio]); // Establecer la fecha final como la misma fecha inicial
    } else {
      setRangoFechas(dates); // Si no hay problemas con las fechas, actualizar el estado normalmente
    }
  
    // Verificar si la función fue llamada por limpiarRangoFechas o si no hay casillas seleccionadas
    if (typeof window.rebootTriggered !== "undefined" && window.rebootTriggered === false) {
      return;
    }
  
    // Activar Reboot() solo si fue llamado por una selección normal de fecha
    if (IDSeleccionadas.length > 0 || mesasSeleccionadas.length > 0 || meserosSeleccionados.length > 0) {
      Reboot();
    }
  };

  const handleSelectAll = (tipo) => {
    Reboot();
    let IDsSeleccionadosActualizados = [...IDSeleccionadas];
    let elementosSeleccionadosActualizados = [];
  
    // Determinar qué tipo de elementos se están seleccionando
    const elementos = tipo === 'mesas' ? mesasDB : MeserosDB;
  
    // Verificar si todos los elementos ya están seleccionados
    const todosSeleccionados = elementos.every(elemento => IDSeleccionadas.includes(...elemento.IDs));
  
    if (todosSeleccionados) {
      // Deseleccionar todos los elementos
      elementos.forEach(elemento => {
        elemento.IDs.forEach(id => {
          const index = IDsSeleccionadosActualizados.indexOf(id);
          if (index !== -1) {
            IDsSeleccionadosActualizados.splice(index, 1);
          }
        });
      });
    } else {
      // Seleccionar todos los elementos
      elementos.forEach(elemento => {
        // Ordenar los IDs según la dirección del ordenamiento
        elemento.IDs = ordenarIDs(elemento.IDs);
  
        elemento.IDs.forEach(id => {
          if (!IDsSeleccionadosActualizados.includes(id)) {
            IDsSeleccionadosActualizados.push(id);
          }
        });
        elementosSeleccionadosActualizados.push(elemento[tipo === 'mesas' ? 'mesa' : 'Mesero']);
      });
    }
  
    // Eliminar duplicados de los elementos seleccionados
    elementosSeleccionadosActualizados = [...new Set(elementosSeleccionadosActualizados)];
  
    // Actualizar los estados de las selecciones
    setIDSeleccionadas(IDsSeleccionadosActualizados);
    tipo === 'mesas' ? setMesasSeleccionadas(elementosSeleccionadosActualizados) : setMeserosSeleccionados(elementosSeleccionadosActualizados);
  };

  const handleIDsPorFechaChange = async (id) => {
    let IDsPorFechaSeleccionadosActualizados = [...IDsPorFechaSeleccionados];
  
    // Obtener la fechaHora del pedido correspondiente al ID
    const fechaHoraPedido = await obtenerInfoPedidoPorID(id, 'fechaHoraCreacion');
  
    if (IDsPorFechaSeleccionados.includes(id)) {
      IDsPorFechaSeleccionadosActualizados = IDsPorFechaSeleccionadosActualizados.filter(item => item !== id);
    } else {
      IDsPorFechaSeleccionadosActualizados.push(id);
    }
  
    setIDsPorFechaSeleccionados(IDsPorFechaSeleccionadosActualizados);
  };
  
  useEffect(() => {
    setIDsPorFechaSeleccionados([...IDSeleccionadas]);
    setIDsSeleccionadosI([...IDSeleccionadas]);
  }, [IDSeleccionadas]);

  useEffect(() => {
    const obtenerIDsPorFecha = async () => {
      if (rangoFechas[0] && rangoFechas[1]) {
        const IDsFiltrados = await filtrarIDsPorFecha(rangoFechas[0], rangoFechas[1]);
        setIDsPorFechaSeleccionados([...IDSeleccionadas].filter(id => IDsFiltrados.includes(id)));
        setIDsSeleccionadosI([...IDSeleccionadas].filter(id => IDsFiltrados.includes(id)));
      }
    };
  
    obtenerIDsPorFecha();
  }, [IDSeleccionadas, rangoFechas]);

  const renderCapaSeleccion = () => {
    console.log("Mesas en renderCapaSeleccion:", idDB);
    const meserosOrdenados = MeserosDB.slice().sort((a, b) => a.Mesero.localeCompare(b.Mesero));
    const mostrarIDsPorFecha = rangoFechas[0] && rangoFechas[1] &&
      rangoFechas[0].toDateString() === rangoFechas[1].toDateString() &&
      ((mesasSeleccionadas.length === 1 && seleccion === 'mesas') || (meserosSeleccionados.length === 1 && seleccion === 'meseros'));

    
    console.log("Mostrar IDs por fecha:", IDSeleccionadas);
    console.log("Mostrar IDs por fecha:", IDsPorFechaSeleccionados);
    return (
      <div className="PDF_BackGround">
        <div className="PDF_Seleccion">
          <button
            className={`PDF_Button ${seleccion === 'mesas' ? 'disabled' : ''}
            ${seleccion !== 'mesas' ? 'PDF_Button' : ''}`}
            onClick={() => cambiarSeccion('mesas')}
          >
            Mesas
          </button>
          <button
            className={`PDF_Button ${seleccion === 'meseros' ? 'disabled' : ''} 
            ${seleccion !== 'meseros' ? 'PDF_Button' : ''}`}
            onClick={() => cambiarSeccion('meseros')}
          >
            Meseros
          </button>
        </div>
        <h2 className="PDF_Title">Selecciona {seleccion === 'mesas' ? 'mesas' : 'meseros'}:</h2>
  
        <div>
          <button onClick={alternarOrden} className="PDF_Orden">
            {ordenAscendente ? 'Orden Descendente v' : 'Orden Ascendente ʌ'}
          </button>
        </div>

        {/* Agrega la opción de seleccionar todos */}
        <div className="PDF_Check_2">
          <label>
          <input
            type="checkbox"
            className="PDF_checkbox"
            checked={seleccion === 'mesas' ? mesasSeleccionadas.length === mesasDB.length : meserosSeleccionados.length === MeserosDB.length}
            onChange={() => handleSelectAll(seleccion)}
          />
            Seleccionar Todos
          </label>
        </div>

        <div className="PDF_Fecha">
          <DatePicker
            selected={rangoFechas[0]}
            onChange={(date) => handleDateRangeChange([date, rangoFechas[1]])}
            selectsStart
            startDate={rangoFechas[0]}
            endDate={rangoFechas[1]}
            dateFormat="dd/MM/yyyy"
            placeholderText="Fecha inicial"
          />
          <span> - </span>
          <DatePicker
            selected={rangoFechas[1]}
            onChange={(date) => handleDateRangeChange([rangoFechas[0], date])}
            selectsEnd
            startDate={rangoFechas[0]}
            endDate={rangoFechas[1]}
            minDate={rangoFechas[0]}
            dateFormat="dd/MM/yyyy"
            placeholderText="Fecha Final"
          />
        </div>

        <div>
          <button onClick={limpiarRangoFechas} className="PDF_ClearData">
            limpiar fechas
          </button>
        </div>

        {mostrarIDsPorFecha && (
    <div className="PDF_OneDay">
      <h2 className="PDF_OneDay_Title">IDs en el rango de fechas seleccionado:</h2>
      {IDsSeleccionadosI.map(id => {
        // Extraer la parte de la fecha y hora del ID
        const fechaHoraParte = id.substring(0, 14); // Los primeros 14 caracteres son la fecha y hora
        // Formatear la fecha y hora en un formato legible
        const fechaHoraFormateada = `${fechaHoraParte.substring(0, 4)}-${fechaHoraParte.substring(4, 6)}-${fechaHoraParte.substring(6, 8)} ${fechaHoraParte.substring(8, 10)}:${fechaHoraParte.substring(10, 12)}:${fechaHoraParte.substring(12, 14)}`;
        return (
          <div key={id}>
            <label>
              <input
                type="checkbox"
                checked={IDsPorFechaSeleccionados.includes(id)} // Verificar si el ID está en el estado IDsPorFechaSeleccionados
                onChange={() => handleIDsPorFechaChange(id)}
              />
              Fecha y hora: {fechaHoraFormateada}
            </label>
          </div>
        );
      })}
    </div>
  )}
        
        <div className="PDF_Title_2">
          {seleccion === 'mesas' ? (
            mesasDB.map((mesaItem) => (
              <div key={mesaItem.mesa}>
                <label className="PDF_Check">
                  <input
                    type="checkbox"
                    className="PDF_checkbox"
                    value={mesaItem.mesa}
                    checked={IDSeleccionadas.some((id) => mesaItem.IDs.includes(id))}
                    onChange={() => handleCheckboxChange(mesaItem.mesa, 'mesas')}
                  />
                  Mesa {mesaItem.mesa}
                </label>
              </div>
            ))
          ) : (
            meserosOrdenados.map((MeseroItem) => (
              <div key={MeseroItem.Mesero}>
                <label className="PDF_Check">
                  <input
                    type="checkbox"
                    className="PDF_checkbox"
                    value={MeseroItem.Mesero}
                    checked={IDSeleccionadas.some((id) => MeseroItem.IDs.includes(id))}
                    onChange={() => handleCheckboxChange(MeseroItem.Mesero, 'meseros')}
                  />
                  - {MeseroItem.Mesero}
                </label>
              </div>
            ))
          )}
        </div>
        <button 
          id="boton-generar-comanda"
          className={`PDF_Button ${IDSeleccionadas.length === 0 && 
          meserosSeleccionados.length === 0 ? 'disabled' : ''}`} 
          onClick={generarComanda} 
          disabled={IDSeleccionadas.length === 0 && meserosSeleccionados.length === 0}
        >
          Generar Comanda
        </button>
      </div>
    );
  };
  
  console.log("Rango de fechas seleccionado:", rangoFechas);

  return {
    botonComandaText,
    mostrarCapa,
    renderCapaSeleccion,
    toggleCapa,
  };
}
export default PDF;
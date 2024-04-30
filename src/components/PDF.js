import React, { useState, useEffect } from "react"; // Importa React y los hooks useState y useEffect
import { db } from "../firebase/firebaseConfig"; // Importa la instancia de Firestore (db)
import { collection, onSnapshot, getDocs, getDoc, doc } from "firebase/firestore"; // Importa funciones de Firestore para acceder a colecciones y documentos
import "../css/cocina.css"; // Importa el archivo CSS asociado a la cocina
import jsPDF from "jspdf"; // Importa la librería jsPDF para generar archivos PDF
import "jspdf-autotable"; // Importa un plugin de jsPDF para generar tablas automáticamente
import DatePicker from 'react-datepicker'; // Importa el componente DatePicker de react-datepicker
import 'react-datepicker/dist/react-datepicker.css'; // Importa los estilos CSS predeterminados de react-datepicker

// Declara una función llamada getProductosPorIDPDF que toma como argumentos un array de IDs seleccionadas, un snapshot de consulta y el tipo de producto
export const getProductosPorIDPDF = (IDSeleccionadas, querySnapshot, tipoProducto) => {
  const contadorProductos = {}; // Inicializa un objeto para contar productos
  const productosEnPedidos = []; // Inicializa un array para almacenar productos en pedidos

  querySnapshot.forEach((pedidoDoc) => { // Itera sobre cada documento del snapshot de consulta
    const pedidoData = pedidoDoc.data(); // Obtiene los datos del pedido
    const pedidosArray = pedidoData.pedido; // Obtiene el array de pedidos dentro del documento

    pedidosArray.forEach((platilloPedido) => { // Itera sobre cada pedido dentro del array de pedidos
      const nombreProducto = platilloPedido[tipoProducto]; // Obtiene el nombre del producto según el tipo especificado
      const idPedido = pedidoDoc.id; // Obtiene el ID del pedido

      // Verifica si el ID del pedido está incluido en las IDs seleccionadas y si el nombre del producto existe
      if (IDSeleccionadas.includes(idPedido) && nombreProducto) {
        // Incrementa el contador de productos para el nombre del producto
        contadorProductos[nombreProducto] = (contadorProductos[nombreProducto] || 0) + 1;
      }
    });
  });

  productosEnPedidos.push( // Agrega al array de productos en pedidos
    ...Object.keys(contadorProductos).map((nombreProducto) => { // Mapea sobre las claves del objeto contadorProductos
      return { // Retorna un objeto con las propiedades contador, nombre e imgProducto
        contador: `${contadorProductos[nombreProducto]}`, // Asigna el contador de productos para el nombre del producto
        nombre: `${nombreProducto}`, // Asigna el nombre del producto
        imgProducto: querySnapshot.docs // Obtiene la URL de la imagen del producto
          // Busca el documento que contiene el producto
          .find((pedidoDoc) => pedidoDoc.data().pedido.some((platilloPedido) => platilloPedido[tipoProducto] === nombreProducto))
          // Obtiene la URL de la imagen del producto o utiliza una URL por defecto si no se encuentra
          .data().pedido.find((platilloPedido) => platilloPedido[tipoProducto] === nombreProducto)?.[`img${tipoProducto.charAt(0).toUpperCase() + tipoProducto.slice(1)}`] || "URL_POR_DEFECTO",
      };
    })
  );
  // Retorna el array de productos en pedidos
  return productosEnPedidos;
};

const PDF = () => { // Declara un componente funcional llamado PDF

  const [idDB, setidDB] = useState([]); // Define el estado para almacenar IDs desde la base de datos
  const [rangoFechas, setRangoFechas] = useState([null, null]); // Define el estado para el rango de fechas
  const [mesasDB, setMesasDB] = useState([]); // Define el estado para almacenar mesas con sus respectivos IDs
  const [MeserosDB, setMeserosDB] = useState([]); // Define el estado para almacenar meseros con sus respectivos IDs
  const [meserosSeleccionados, setMeserosSeleccionados] = useState([]); // Define el estado para almacenar los meseros seleccionados
  const [seleccion, setSeleccion] = useState('mesas'); // Define el estado para la opción de selección ('mesas' o 'meseros')
  const [botonComandaText, setBotonComandaText] = useState("Generar Comanda"); // Define el estado para el texto del botón de comanda
  const [IDSeleccionadas, setIDSeleccionadas] = useState([]); // Define el estado para las IDs seleccionadas
  const [mesasSeleccionadas, setMesasSeleccionadas] = useState([]); // Define el estado para las mesas seleccionadas
  const [mostrarCapa, setMostrarCapa] = useState(false); // Define el estado para controlar la visibilidad de una capa
  const [ordenAscendente, setOrdenAscendente] = useState(true); // Define el estado para el orden ascendente o descendente
  const [IDsPorFechaSeleccionados, setIDsPorFechaSeleccionados] = useState([]); // Define el estado para las IDs seleccionadas por fecha
  const [IDsSeleccionadosI, setIDsSeleccionadosI] = useState([]); // Define el estado para las IDs seleccionadas

  const alternarOrden = () => { // Define una función para alternar el orden ascendente o descendente
    setOrdenAscendente((prevOrden) => !prevOrden); // Cambia el estado de ordenAscendente invirtiendo su valor
    setIDSeleccionadas([]); // Restablece las IDs seleccionadas
    setMesasSeleccionadas([]); // Restablece las mesas seleccionadas
    setMeserosSeleccionados([]); // Restablece los meseros seleccionados
  };

  const ordenarIDs = (IDs) => { // Define una función para ordenar las IDs
    // Ordena las IDs según el orden ascendente o descendente
    return ordenAscendente ? IDs.sort((a, b) => b.localeCompare(a)) : IDs.sort((a, b) => a.localeCompare(b));
  };

  useEffect(() => { // Define un efecto que se ejecuta después de cada actualización del componente
    const obtenerIDDB = async () => { // Define una función asincrónica para obtener IDs desde la base de datos
      try {
        const pedidosSnapshot = await getDocs(collection(db, "pedidos")); // Obtiene un snapshot de la colección "pedidos"
        let IDDesdeDB = pedidosSnapshot.docs.map(doc => doc.id); // Extrae los IDs de los documentos del snapshot
  
        // Ordenar los IDs según la dirección del ordenamiento
        IDDesdeDB = ordenarIDs(IDDesdeDB);

        // Actualiza el estado con los IDs obtenidos de la base de datos
        setidDB(IDDesdeDB);
      } catch (error) { // Maneja cualquier error ocurrido durante la obtención de IDs
        console.error("Error al obtener las IDs desde la base de datos:", error);
      }
    };
    
    // Define una función asincrónica para obtener datos desde la base de datos
    const obtenerDatosDB = async () => {
      try { // Establece una suscripción a los cambios en la colección "pedidos"
        const unsubscribe = onSnapshot(collection(db, "pedidos"), (querySnapshot) => {
          // Crear objetos para almacenar las mesas y meseros con sus respectivos IDs
          const mesasConIDs = {}; // Objeto para almacenar mesas con sus IDs
          const MeserosConIDs = {}; // Objeto para almacenar meseros con sus IDs
  
          // Iterar sobre los documentos de pedidos
          querySnapshot.forEach((doc) => { // Obtiene los datos del pedido del documento
            const pedidoData = doc.data().pedido;
  
            // Iterar sobre los pedidos en cada documento
            pedidoData.forEach((platilloPedido) => {
              const mesa = platilloPedido.mesa; // Obtiene el número de mesa del pedido
              const Mesero = platilloPedido.Mesero; // Obtiene el nombre del mesero del pedido
              const idPedido = doc.id; // Obtiene el ID del pedido
  
              // Procesar mesas
              if (mesasConIDs[mesa]) { // Verifica si la mesa ya está en el objeto mesasConIDs
                mesasConIDs[mesa].push(idPedido); // Agrega el ID del pedido a la lista de IDs de la mesa
              } else { // Inicializa la lista de IDs de la mesa con el ID del pedido
                mesasConIDs[mesa] = [idPedido];
              }
  
              // Procesar meseros
              if (MeserosConIDs[Mesero]) { // Verifica si el mesero ya está en el objeto MeserosConIDs
                MeserosConIDs[Mesero].push(idPedido); // Agrega el ID del pedido a la lista de IDs del mesero
              } else {
                MeserosConIDs[Mesero] = [idPedido]; // Inicializa la lista de IDs del mesero con el ID del pedido
              }
            });
          });
  
          // Convertir los objetos a arrays de objetos con la estructura { mesa/Mesero: [IDs] }
          const mesasArray = Object.entries(mesasConIDs).map(([mesa, IDs]) => ({ mesa, IDs }));
          // Convierte el objeto MeserosConIDs en un array de objetos
          const MeserosArray = Object.entries(MeserosConIDs).map(([Mesero, IDs]) => ({ Mesero, IDs }));
  
          console.log("Mesas con IDs cargadas desde la base de datos:", mesasArray);
          console.log("Meseros con IDs cargadas desde la base de datos:", MeserosArray);
  
          // Actualizar el estado de mesasDB y MeserosDB con los datos obtenidos de la base de datos
          setMesasDB(mesasArray); // Actualiza el estado con las mesas y sus IDs
          setMeserosDB(MeserosArray); // Actualiza el estado con los meseros y sus IDs
        });
  
        // Retornar una función de limpieza para dejar de escuchar los cambios en la colección "pedidos"
        return () => unsubscribe();
      } catch (error) {
        console.error("Error al obtener datos desde la base de datos:", error);
      }
    };
  
    obtenerIDDB(); // Invoca la función para obtener IDs desde la base de datos
    obtenerDatosDB(); // Invoca la función para obtener datos desde la base de datos
  }, [ordenAscendente]); // Establece las dependencias del efecto
  
  // Define una función asincrónica para obtener información de un pedido por su ID
  const obtenerInfoPedidoPorID = async (idPedido, info) => {
    try {
      const pedidoDocRef = doc(db, "pedidos", idPedido); // Obtiene una referencia al documento del pedido con el ID específico
      const pedidoDoc = await getDoc(pedidoDocRef); // Obtiene el documento del pedido
  
      switch (info) { // Evalúa la información requerida
        case 'numClientes': // Si se requiere el número de clientes
          return parseInt(pedidoDoc.data().pedido[0].noClientes, 10) || 0; // Retorna el número de clientes del primer pedido del documento
        case 'mesero': // Si se requiere el nombre del mesero
        // Retorna el nombre del mesero del primer pedido del documento o "N/A" si no está definido
          return pedidoDoc.data().pedido[0].Mesero || "N/A";
        case 'fechaHoraCreacion': // Si se requiere la fecha y hora de creación
          const fechaHoraCreacion = pedidoDoc.data().fechaHora.toDate(); // Obtiene la fecha y hora de creación del pedido
          const options = { // Define las opciones de formato de fecha y hora
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short'
          };
          // Retorna la fecha y hora de creación formateada según las opciones definidas
          return new Intl.DateTimeFormat('es-ES', options).format(fechaHoraCreacion);
        default: // Si la información requerida no es válida
          // Lanza un error indicando que la información de pedido no es válida
          throw new Error('Información de pedido no válida');
      }
    } catch (error) { // Maneja cualquier error ocurrido durante la obtención de información del pedido
      console.error("Error al obtener información del pedido:", error); // Registra el error en la consola
      return "N/A"; // Retorna "N/A" como valor por defecto en caso de error
    }
  };

  const obtenerCostoPorPedido = async () => { // Define una función asincrónica para obtener el costo por pedido
    try {
      // Obtener el documento de la colección "Costo" con un ID específico
      const costoDocRef = doc(db, "Costo", "MXN$"); // Obtiene una referencia al documento de costo con el ID "MXN$"
      const costoDocSnap = await getDoc(costoDocRef); // Obtiene el documento de costo
      
      // Verificar si el documento existe y contiene el campo "CostoPorPedido"
      if (costoDocSnap.exists()) { // Si el documento existe
        const costoPorPedido = costoDocSnap.data().CostoPorPedido; // Obtiene el valor del campo "CostoPorPedido" del documento
        return costoPorPedido; // Retorna el costo por pedido obtenido
      } else { // Si el documento no existe o no contiene el campo "CostoPorPedido"
        // Registra un mensaje en la consola indicando que el documento no existe o no contiene el campo "CostoPorPedido"
        console.log("El documento no existe o no contiene el campo 'CostoPorPedido'.");
        return 0; // Retorna 0 como valor por defecto
      }
    } catch (error) { // Maneja cualquier error ocurrido durante la obtención del costo por pedido
      console.error("Error al obtener el costo por pedido:", error); // Registra el error en la consola
      return 0; // Retorna 0 en caso de error
    }
  };
  
  // Función para filtrar los IDs de pedidos por fecha
  const filtrarIDsPorFecha = async (fechaInicio, fechaFin) => { // Define una función asincrónica para filtrar los IDs de pedidos por fecha
    try {
      const pedidosSnapshot = await getDocs(collection(db, "pedidos")); // Obtiene una instantánea de todos los documentos en la colección "pedidos"
      const IDsFiltrados = []; // Inicializa un array para almacenar los IDs filtrados
      const fechaFinDiaSiguiente = new Date(fechaFin); // Clonar la fecha final para asegurarse de no modificar el estado
    
      // Establecer la fecha final para incluir todo el día seleccionado
      fechaFinDiaSiguiente.setDate(fechaFinDiaSiguiente.getDate() + 1); // Añade un día a la fecha final
      fechaFinDiaSiguiente.setHours(0, 0, 0, 0); // Establecer a la medianoche del día siguiente
    
      pedidosSnapshot.forEach((doc) => { // Itera sobre cada documento en la instantánea de pedidos
        const fechaPedido = doc.data().fechaHora.toDate(); // Suponiendo que la fechaHora se almacena como un objeto Date en Firestore
        if (fechaPedido >= fechaInicio && fechaPedido < fechaFinDiaSiguiente) { // Comprueba si la fecha del pedido está dentro del rango seleccionado
          IDsFiltrados.push(doc.id); // Agrega el ID del pedido al array de IDs filtrados
        }
      });
    
      return IDsFiltrados; // Retorna los IDs filtrados por fecha
    } catch (error) { // Maneja cualquier error ocurrido durante el filtrado de los IDs por fecha
      console.error("Error al filtrar los IDs de pedidos por fecha:", error); // Registra el error en la consola
      return []; // Retorna un array vacío en caso de error
    }
  };
  
  const generarComanda = async (mostrarIDsPorFecha) => {
    const pdf = new jsPDF();
    const now = new Date();
    const fecha = now.getDate() + '_' + (now.getMonth() + 1) + '_' + now.getFullYear();
    const hora = now.getHours() + ';' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    const nombreArchivo = `orden-${fecha}-${hora}.pdf`;
    // Filtrar los IDs por fecha si se proporciona un rango de fechas válido
    const IDsFiltradosPorFecha = await filtrarIDsPorFecha(rangoFechas[0], rangoFechas[1]);
    // Función auxiliar para envolver las llamadas asincrónicas en un bloque try-catch
    const tryCatchWrapper = async (callback) => {
      try {
        await callback();
      } catch (error) {
        console.error("Error al generar la comanda:", error);
      }
    };
    // Funciones de ordenamiento personalizadas para mesas y meseros
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
    // Ordenar los IDs seleccionados según el tipo de selección (mesas o meseros)
    const MesasOrdenadas = mostrarIDsPorFecha ? IDsPorFechaSeleccionados.slice().sort(seleccion === 'mesas' ? ordenarPorNumeroMesa : ordenarPorNombreMesero) : IDSeleccionadas.slice().sort(seleccion === 'mesas' ? ordenarPorNumeroMesa : ordenarPorNombreMesero);
    // Función para agregar una tabla al PDF
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
    // Función para obtener los datos de la comanda para un ID específico
    const obtenerDatosComanda = async (ID) => {
      // Obtener los pedidos desde la colección de Firestore
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
          // Iterar sobre cada platillo del pedido
          pedidoData.forEach((platilloPedido) => {
            // Verificar si el ID del platillo coincide con el ID del pedido
            if (platilloPedido.ID === ID) {
              agrupados[pedidoID] = agrupados[pedidoID] || [];
              agrupados[pedidoID].push(platilloPedido);
            }
          });
          // Retornar el objeto agrupados actualizado
          return agrupados;
        }, {});
  
        // Crear una tabla separada para cada ID de pedido
        const tables = Object.entries(pedidosPorID).map(([pedidoID, platillosPedido]) => {
          return [
            // Primera fila de la tabla con información sobre el ID del pedido
            { content: `Pedido ID: ${pedidoID}`, colSpan: 2, styles: { fontStyle: 'bold', fillColor: [200, 220, 255] } },
            {}, // Segunda celda vacía
            // Resto de las filas con los platillos y sus cantidades del pedido
            ...platillosPedido.map((platilloPedido) => {
              return [platilloPedido.platillo || '', platilloPedido.cantidad || 0];
            }),
          ];
        });
        // Construir la estructura de la tabla de la comanda
        return [
          // Encabezado de la tabla con las columnas "Platillo" y "Cantidad Total"
          ['Platillo', 'Cantidad Total'],
          // Filas para cada platillo y su cantidad, obtenidos de la lista de platillosEnID
          ...platillosEnID.map((platillo) => [platillo.nombre || '', platillo.contador || 0]),
          // Encabezado para la sección de frutas
          [{ content: 'Frutas', styles: { fontStyle: 'bold', fillColor: [200, 220, 255] } }, { content: 'Cantidad Total', styles: { fontStyle: 'bold', fillColor: [200, 220, 255] } }],
          // Filas para cada fruta y su cantidad, obtenidos de la lista de frutasEnID
          ...frutasEnID.map((fruta) => [fruta.nombre || '', fruta.contador || 0]),
          // Encabezado para la sección de bebidas
          [{ content: 'Bebidas', styles: { fontStyle: 'bold', fillColor: [200, 220, 255] } }, { content: 'Cantidad Total', styles: { fontStyle: 'bold', fillColor: [200, 220, 255] } }],
          // Filas para cada bebida y su cantidad, obtenidos de la lista de bebidasEnID
          ...bebidasEnID.map((bebida) => [bebida.nombre || '', bebida.contador || 0]),
          ...tables, // Agregar las tablas generadas previamente para cada ID de pedido
        ];
      } else {
        return null; // Retornar null si el ID está fuera del rango de fechas y hay filtro de fecha
      }
    };
    // Iniciar la creación del PDF
    pdf.text(`Fecha: ${fecha}  Hora: ${hora}`, 10, 10);
    let contenidoAgregado = false; // Variable para controlar si se ha agregado contenido en la página actual
    // Iterar sobre cada ID de mesa ordenada
    for (const ID of MesasOrdenadas) {
      await tryCatchWrapper(async () => {
        // Obtener información relevante del pedido
        const costoPorPedido = await obtenerCostoPorPedido();
        const numClientes = await obtenerInfoPedidoPorID(ID, 'numClientes');
        const mesero = await obtenerInfoPedidoPorID(ID, 'mesero');
        const fechaHoraCreacion = await obtenerInfoPedidoPorID(ID, 'fechaHoraCreacion');
        const numMesa = mesasDB.find((mesaItem) => mesaItem.IDs.includes(ID))?.mesa || "N/A"; // Obtener el número de mesa
        const allData = await obtenerDatosComanda(ID);
        // Agregar la información del pedido al PDF si hay datos disponibles
        if (allData) { // Solo agregar la tabla si hay datos disponibles
          if (!contenidoAgregado) {
            contenidoAgregado = true; // Se ha agregado contenido a la página actual
          } else {
            pdf.addPage(); // Agregar una nueva página si se ha agregado contenido previamente
          }
          // Agregar información del pedido al PDF
          pdf.text(`Mesa: ${numMesa}  Número de Clientes: ${numClientes || 0}`, 10, 20);
          pdf.text(`Fecha y hora: ${fechaHoraCreacion || 'N/A'}`, 10, 28); // Mostrar fechaHora después de "Número de Clientes"
          pdf.text(`Costo de la Orden: ${costoPorPedido * numClientes}`, 10, 36);
          pdf.text(`Mesero: ${mesero} `, 10, 44);
          // Agregar la tabla de la comanda al PDF
          agregarTablaPDF(pdf, allData);
        }
      });
    }
    // Finalizar la generación del PDF y manejar el botón de generación de comandas
    const botonGenerarComanda = document.getElementById('boton-generar-comanda');
    // Verificar si se ha agregado contenido a la página actual para generar la comanda
    if (contenidoAgregado) {
      botonGenerarComanda.disabled = false; // Si hay contenido, habilitar el botón "Generar Comanda"
      botonGenerarComanda.innerText = "Generar Comanda"; // Cambiar el texto del botón a "Generar Comanda"
      botonGenerarComanda.classList.remove('disabled'); // Remover la clase 'disabled'
      pdf.save(nombreArchivo); // Guardar el PDF generado con el nombre especificado
    } else {
      botonGenerarComanda.disabled = true; // Si no hay contenido, deshabilitar el botón "Generar Comanda"
      botonGenerarComanda.innerText = "No hay datos disponibles"; // Cambiar el texto del botón a "No hay datos disponibles"
      botonGenerarComanda.classList.add('disabled'); // Agregar la clase 'disabled'
    }
  };
  
  const toggleCapa = () => { // Define una función para alternar la visibilidad de una capa y actualizar el texto del botón
    console.log("Toggle Capa"); // Registra en la consola un mensaje indicando que se ha activado el interruptor de la capa
    setMostrarCapa(!mostrarCapa); // Alterna el estado de visibilidad de la capa
    setIDSeleccionadas([]); // Limpia las selecciones de IDs
    setMeserosSeleccionados([]); // Limpia las selecciones de meseros
    // Actualiza el texto del botón alternativamente entre "Generar Comanda" y "Cerrar Comanda"
    setBotonComandaText((prevText) => (prevText === "Generar Comanda" ? "Cerrar Comanda" : "Generar Comanda"));
  };

  const cambiarSeccion = (nuevaSeccion) => { // Define una función para cambiar la sección de la vista
    // Limpiar las selecciones al cambiar de sección
    setIDSeleccionadas([]); // Limpia las selecciones de IDs
    setMesasSeleccionadas([]); // Limpia las selecciones de mesas
    setMeserosSeleccionados([]); // Limpia las selecciones de meseros
  
    // Establecer la nueva sección
    setSeleccion(nuevaSeccion); // Actualiza la sección seleccionada con la nueva sección proporcionada como argumento
  };

  const Reboot = () => // Define una función para reiniciar
  {
    const botonGenerarComanda = document.getElementById('boton-generar-comanda'); // Obtiene el botón de "Generar Comanda" mediante su ID
    botonGenerarComanda.disabled = false; // Habilita el botón de "Generar Comanda"
    botonGenerarComanda.innerText = "Generar Comanda"; // Restaura el texto del botón a "Generar Comanda"
    botonGenerarComanda.classList.remove('disabled'); // Elimina la clase 'disabled' del botón
  }

  const handleCheckboxChange = async (item, tipo) => { // Define una función para manejar el cambio de estado del checkbox
    Reboot(); // Reinicia el estado del botón de "Generar Comanda"
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
  
  const limpiarRangoFechas = () => { // Define una función para limpiar el rango de fechas seleccionado
    window.rebootTriggered = false; // Indica que limpiarRangoFechas se está llamando
    setRangoFechas([null, null]); // Establece el rango de fechas como nulo
  
    // Activar Reboot() si hay al menos una opción seleccionada
    if (IDSeleccionadas.length > 0 || mesasSeleccionadas.length > 0 || meserosSeleccionados.length > 0) {
      Reboot(); // Llama a la función Reboot() para reiniciar el estado del botón
    }
  };

  const handleDateRangeChange = (dates) => { // Define una función para manejar el cambio en el rango de fechas
    const [fechaInicio, fechaFin] = dates; // Extrae la fecha inicial y la fecha final del rango seleccionado
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
      return; // Si limpiarRangoFechas llamó a esta función o no hay selecciones, no hace nada más
    }
  
    // Activar Reboot() solo si fue llamado por una selección normal de fecha
    if (IDSeleccionadas.length > 0 || mesasSeleccionadas.length > 0 || meserosSeleccionados.length > 0) {
      Reboot(); // Llama a la función Reboot() para reiniciar el estado del botón
    }
  };

  const handleSelectAll = (tipo) => { // Define una función para manejar la selección de todos los elementos
    Reboot(); // Llama a la función Reboot() para reiniciar el estado del botón "Generar Comanda"
    let IDsSeleccionadosActualizados = [...IDSeleccionadas]; // Crea una copia del array de IDs seleccionados
    let elementosSeleccionadosActualizados = []; // Inicializa un array para almacenar los elementos seleccionados
  
    // Determinar qué tipo de elementos se están seleccionando
    const elementos = tipo === 'mesas' ? mesasDB : MeserosDB;
  
    // Verificar si todos los elementos ya están seleccionados
    const todosSeleccionados = elementos.every(elemento => IDSeleccionadas.includes(...elemento.IDs));
  
    if (todosSeleccionados) { // Si todos los elementos están seleccionados
      // Deseleccionar todos los elementos
      elementos.forEach(elemento => {
        elemento.IDs.forEach(id => {
          const index = IDsSeleccionadosActualizados.indexOf(id);
          if (index !== -1) {
            // Elimina el ID de la lista de IDs seleccionados
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
            // Agrega el ID a la lista de IDs seleccionados
            IDsSeleccionadosActualizados.push(id);
          }
        });
        // Agrega el nombre del elemento seleccionado a la lista de elementos seleccionados
        elementosSeleccionadosActualizados.push(elemento[tipo === 'mesas' ? 'mesa' : 'Mesero']);
      });
    }
  
    // Eliminar duplicados de los elementos seleccionados
    elementosSeleccionadosActualizados = [...new Set(elementosSeleccionadosActualizados)];
  
    // Actualizar los estados de las selecciones
    setIDSeleccionadas(IDsSeleccionadosActualizados);
    // Actualiza los elementos seleccionados
    tipo === 'mesas' ? setMesasSeleccionadas(elementosSeleccionadosActualizados) : setMeserosSeleccionados(elementosSeleccionadosActualizados);
  };

  const handleIDsPorFechaChange = async (id) => { // Define una función para manejar el cambio en los IDs seleccionados por fecha
    let IDsPorFechaSeleccionadosActualizados = [...IDsPorFechaSeleccionados]; // Crea una copia del array de IDs seleccionados por fecha
  
    // Obtener la fechaHora del pedido correspondiente al ID
    const fechaHoraPedido = await obtenerInfoPedidoPorID(id, 'fechaHoraCreacion');
  
    if (IDsPorFechaSeleccionados.includes(id)) { // Verifica si el ID ya está seleccionado por fecha
      // Si está seleccionado, lo quita de la lista de IDs seleccionados por fecha
      IDsPorFechaSeleccionadosActualizados = IDsPorFechaSeleccionadosActualizados.filter(item => item !== id);
    } else { // Si no está seleccionado, lo agrega a la lista de IDs seleccionados por fecha
      IDsPorFechaSeleccionadosActualizados.push(id);
    }
    // Actualiza el estado de los IDs seleccionados por fecha
    setIDsPorFechaSeleccionados(IDsPorFechaSeleccionadosActualizados);
  };
  // Actualiza los IDs seleccionados por fecha cuando cambia la selección general de IDs
  useEffect(() => {
    setIDsPorFechaSeleccionados([...IDSeleccionadas]); // Establece los IDs seleccionados por fecha como los IDs seleccionados actualmente
    setIDsSeleccionadosI([...IDSeleccionadas]); // Establece otra lista de IDs seleccionados como los IDs seleccionados actualmente
  }, [IDSeleccionadas]);

  useEffect(() => {
    const obtenerIDsPorFecha = async () => {
      if (rangoFechas[0] && rangoFechas[1]) { // Verifica si se ha seleccionado un rango de fechas válido
        const IDsFiltrados = await filtrarIDsPorFecha(rangoFechas[0], rangoFechas[1]); // Filtra los IDs por el rango de fechas seleccionado
        // Actualiza los IDs seleccionados por fecha basados en los IDs filtrados y los IDs seleccionados generalmente
        setIDsPorFechaSeleccionados([...IDSeleccionadas].filter(id => IDsFiltrados.includes(id)));
        setIDsSeleccionadosI([...IDSeleccionadas].filter(id => IDsFiltrados.includes(id)));
      }
    };
  
    obtenerIDsPorFecha(); // Llama a la función para obtener los IDs por fecha
  }, [IDSeleccionadas, rangoFechas]); // Ejecuta esta operación cuando cambian los IDs seleccionados o el rango de fechas

  const renderCapaSeleccion = () => {
    console.log("Mesas en renderCapaSeleccion:", idDB); // Imprime en la consola las mesas disponibles
    // Ordenar los meseros alfabéticamente
    const meserosOrdenados = MeserosDB.slice().sort((a, b) => a.Mesero.localeCompare(b.Mesero));
    // Determinar si se deben mostrar los IDs por fecha
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
        {/* Mostrar IDs por fecha seleccionada */}
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
        {/* Mostrar mesas o meseros según la selección */}
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
        {/* Botón para generar la comanda */}
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
  // Imprime en la consola el rango de fechas seleccionado
  console.log("Rango de fechas seleccionado:", rangoFechas);

  return {
    botonComandaText, // Retorna el texto del botón de comanda
    mostrarCapa, // Retorna un booleano que indica si se debe mostrar la capa
    renderCapaSeleccion, // Retorna la función para renderizar la capa de selección
    toggleCapa, // Retorna la función para alternar la visibilidad de la capa
  };
}
// Exporta el componente PDF
export default PDF;
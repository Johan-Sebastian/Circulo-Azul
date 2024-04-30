// Importa React y los hooks useState, useEffect y useRef desde la biblioteca 'react'
import React, { useState, useEffect, useRef } from "react";
// Importa la referencia a la base de datos 'db' desde la configuración de Firebase
import { db } from "../firebase/firebaseConfig";
// Importa funciones específicas de Firestore desde la biblioteca 'firebase/firestore'
import { collection, onSnapshot, getDocs, updateDoc } from "firebase/firestore";
// Importa el archivo CSS para este componente
import "../css/cocina.css";
// Importa una imagen como un componente React
import regresar from '../assets/images/regresar.png';
// Importa el componente Link desde 'react-router-dom'
import { Link } from "react-router-dom";
// Importa el componente PDF
import PDF from './PDF'

// Define el componente Cocina como una función de React
const Cocina = () => {
	// Inicializa el componente PDF
	const pdfMethods = PDF();

	// Define un estado para almacenar las mesas de la base de datos
	const [mesasDB, setMesasDB] = useState([]);
	// Imprime en la consola el estado de las mesas cargadas
	console.log("Mesas cargadas:", mesasDB);
	
	// Define un estado para controlar si se muestra una capa o no
	const [mostrarCapa, setMostrarCapa] = useState(false);
	// Imprime en la consola el estado de mostrarCapa
	console.log("Estado de mostrarCapaA:", mostrarCapa);

	// Estado para almacenar los platillos solicitados y función para actualizarlo
  const [platillosSolicitados, setPlatillosSolicitados] = useState([]);
  // Estado para almacenar las frutas solicitadas y función para actualizarlo
  const [frutasSolicitadas, setFrutasSolicitadas] = useState([]);
  // Estado para almacenar las bebidas solicitadas y función para actualizarlo
  const [bebidasSolicitadas, setBebidasSolicitadas] = useState([]);
  // Estado para almacenar las órdenes pendientes y función para actualizarlo
  const [ordenesPendientes, setOrdenesPendientes] = useState({});
  // Estado para almacenar las órdenes en preparación y función para actualizarlo
  const [ordenesFinalizadas, setOrdenesFinalizadas] = useState({});
  // Estado para almacenar las órdenes finalizadas y función para actualizarlo
  const [ordenesEnPreparacion, setOrdenesEnPreparacion] = useState({});

	// Este efecto se ejecuta cuando el componente se monta
  useEffect(() => {
  // Escucha los cambios en la colección "pedidos" de la base de datos
  const unsubscribe = onSnapshot(collection(db, "pedidos"), (querySnapshot) => {
      // Inicializa objetos para contar platillos, frutas y bebidas
      const contadorPlatillos = {}; // Objeto para contar platillos
      const contadorFrutas = {}; // Objeto para contar frutas
      const contadorBebidas = {}; // Objeto para contar bebidas
      const ordenesPendientesTemp = {}; // Objeto temporal para almacenar órdenes pendientes
      const ordenesEnPreparacionTemp = {}; // Objeto temporal para almacenar órdenes en preparación
      const ordenesFinalizadasTemp = {}; // Objeto temporal para almacenar órdenes finalizadas

			// Itera sobre cada documento en la colección "pedidos"
			querySnapshot.forEach((pedidoDoc) => {
				// Obtiene los datos del pedido
				const pedidoData = pedidoDoc.data();
				// Obtiene el array de pedidos del documento
				const pedidosArray = Object.values(pedidoData.pedido);

				// Itera sobre cada pedido en el array de pedidos
        pedidosArray.forEach((platilloPedido) => {
          // Obtiene el nombre del platillo, fruta, bebida y la mesa del pedido
          const nombrePedido = platilloPedido.platillo; // Nombre del platillo del pedido actual
          const nombreFruta = platilloPedido.fruta; // Nombre de la fruta del pedido actual
          const nombreBebida = platilloPedido.bebida; // Nombre de la bebida del pedido actual
          const mesa = platilloPedido.mesa; // Número de mesa del pedido actual

          // Verifica el estado del pedido y agrega la orden correspondiente al estado
          if (platilloPedido.estadoOrden !== "liberado") 
          { // Si el pedido no está liberado
            if (platilloPedido.estadoOrden === "pendiente") { // Si el estado del pedido es "pendiente"
              // Agrega el pedido a las ordenes pendientes
              agregarOrden(
                  ordenesPendientesTemp, // Objeto temporal para almacenar las órdenes pendientes
                  mesa, // Número de mesa del pedido
                  platilloPedido.platillo, // Nombre del platillo del pedido
                  platilloPedido.imgPlatillo || "URL_POR_DEFECTO" // Imagen del platillo o una URL por defecto si no se proporciona
              );
            }
            if (platilloPedido.estadoOrden === "preparacion") { // Si el estado del pedido es "preparacion"
              // Agrega el pedido a las ordenes en preparación
              agregarOrden(
                  ordenesEnPreparacionTemp, // Objeto temporal para almacenar las órdenes en preparación
                  mesa, // Número de mesa del pedido
                  platilloPedido.platillo, // Nombre del platillo del pedido
                  platilloPedido.imgPlatillo || "URL_POR_DEFECTO" // Imagen del platillo o una URL por defecto si no se proporciona
              );
            }
            if (platilloPedido.estadoOrden === "finalizado") { // Si el estado del pedido es "finalizado"
              // Agrega el pedido a las ordenes finalizadas
              agregarOrden(
                  ordenesFinalizadasTemp, // Objeto temporal para almacenar las órdenes finalizadas
                  mesa, // Número de mesa del pedido
                  platilloPedido.platillo, // Nombre del platillo del pedido
                  platilloPedido.imgPlatillo || "URL_POR_DEFECTO" // Imagen del platillo o una URL por defecto si no se proporciona
              );
            }            
          }

          // Verifica si es un platillo y no tiene estado "liberado", luego cuenta el platillo
          if (nombrePedido && platilloPedido.estadoOrden !== "liberado") {
              contadorPlatillos[nombrePedido] = (contadorPlatillos[nombrePedido] || 0) + 1; // Incrementa el contador de platillos
          }
          // Verifica si es una fruta y no tiene estado "liberado", luego cuenta la fruta
          if (nombreFruta && platilloPedido.estadoOrden !== "liberado") {
              contadorFrutas[nombreFruta] = (contadorFrutas[nombreFruta] || 0) + 1; // Incrementa el contador de frutas
          }
          // Verifica si es una bebida y no tiene estado "liberado", luego cuenta la bebida
          if (nombreBebida && platilloPedido.estadoOrden !== "liberado") {
              contadorBebidas[nombreBebida] = (contadorBebidas[nombreBebida] || 0) + 1; // Incrementa el contador de bebidas
          }
        });


				// Itera sobre cada pedido para frutas
        pedidosArray.forEach((platilloPedido) => {
          const mesa = platilloPedido.mesa; // Número de mesa del pedido

          // Verifica si el estado del pedido es "pendiente" y agrega la fruta correspondiente a las ordenes pendientes
          if (platilloPedido.estadoOrden === "pendiente") {
              agregarOrden(
                  ordenesPendientesTemp, // Objeto temporal para almacenar las órdenes pendientes
                  mesa, // Número de mesa del pedido
                  platilloPedido.fruta, // Nombre de la fruta del pedido
                  platilloPedido.imgFruta || "URL_POR_DEFECTO" // Imagen de la fruta o una URL por defecto si no se proporciona
              );
          }

          // Verifica si el estado del pedido es "preparacion" y agrega la fruta correspondiente a las ordenes en preparación
          if (platilloPedido.estadoOrden === "preparacion") {
              agregarOrden(
                  ordenesEnPreparacionTemp, // Objeto temporal para almacenar las órdenes en preparación
                  mesa, // Número de mesa del pedido
                  platilloPedido.fruta, // Nombre de la fruta del pedido
                  platilloPedido.imgFruta || "URL_POR_DEFECTO" // Imagen de la fruta o una URL por defecto si no se proporciona
              );
          }

          // Verifica si el estado del pedido es "finalizado" y agrega la fruta correspondiente a las ordenes finalizadas
          if (platilloPedido.estadoOrden === "finalizado") {
              agregarOrden(
                  ordenesFinalizadasTemp, // Objeto temporal para almacenar las órdenes finalizadas
                  mesa, // Número de mesa del pedido
                  platilloPedido.fruta, // Nombre de la fruta del pedido
                  platilloPedido.imgFruta || "URL_POR_DEFECTO" // Imagen de la fruta o una URL por defecto si no se proporciona
              );
          }
        });
				
				// Itera sobre cada pedido para bebidas
        pedidosArray.forEach((platilloPedido) => {
          const mesa = platilloPedido.mesa; // Número de mesa del pedido

					// Verifica si el estado del pedido es "pendiente" y agrega la bebida correspondiente a las ordenes pendientes
          if (platilloPedido.estadoOrden === "pendiente") {
            agregarOrden(
                ordenesPendientesTemp, // Objeto temporal para almacenar las órdenes pendientes
                mesa, // Número de mesa del pedido
                platilloPedido.bebida, // Nombre de la bebida del pedido
                platilloPedido.imgBebida || "URL_POR_DEFECTO" // Imagen de la bebida o una URL por defecto si no se proporciona
            );
          }
					// Verifica si el estado del pedido es "preparacion" y agrega la bebida correspondiente a las ordenes en preparación
          if (platilloPedido.estadoOrden === "preparacion") {
            agregarOrden(
                ordenesEnPreparacionTemp, // Objeto temporal para almacenar las órdenes en preparación
                mesa, // Número de mesa del pedido
                platilloPedido.bebida, // Nombre de la bebida del pedido
                platilloPedido.imgBebida || "URL_POR_DEFECTO" // Imagen de la bebida o una URL por defecto si no se proporciona
            );
          }
          // Verifica si el estado del pedido es "finalizado" y agrega la bebida correspondiente a las ordenes finalizadas
          if (platilloPedido.estadoOrden === "finalizado") {
              agregarOrden(
                  ordenesFinalizadasTemp, // Objeto temporal para almacenar las órdenes finalizadas
                  mesa, // Número de mesa del pedido
                  platilloPedido.bebida, // Nombre de la bebida del pedido
                  platilloPedido.imgBebida || "URL_POR_DEFECTO" // Imagen de la bebida o una URL por defecto si no se proporciona
              );
          }
				});
			});

			// Construye la lista de platillos con información de conteo
      const platillosEnPedidos = Object.keys(contadorPlatillos).map((nombrePedido) => {
        return {
            contador: `${contadorPlatillos[nombrePedido]}`, // Contador de veces que se ha pedido este platillo
            nombre: `${nombrePedido}`, // Nombre del platillo
            imgPlatillo: querySnapshot.docs
                .find((pedidoDoc) => pedidoDoc.data().pedido.some((platilloPedido) => platilloPedido.platillo === nombrePedido))
                // Imagen del platillo o una URL por defecto si no se encuentra la imagen
                .data().pedido.find((platilloPedido) => platilloPedido.platillo === nombrePedido)?.imgPlatillo || "URL_POR_DEFECTO",
        };
      });

      // Construye la lista de frutas con información de conteo
      const frutasEnPedidos = Object.keys(contadorFrutas).map((nombreFruta) => {
        return {
            contador: `${contadorFrutas[nombreFruta]}`, // Contador de veces que se ha pedido esta fruta
            nombre: `${nombreFruta}`, // Nombre de la fruta
            imgFruta: querySnapshot.docs
                .find((pedidoDoc) => pedidoDoc.data().pedido.some((platilloPedido) => platilloPedido.fruta === nombreFruta))
                // Imagen de la fruta o una URL por defecto si no se encuentra la imagen
                .data().pedido.find((platilloPedido) => platilloPedido.fruta === nombreFruta)?.imgFruta || "URL_POR_DEFECTO",
        };
      });

      // Construye la lista de bebidas con información de conteo
      const bebidasEnPedidos = Object.keys(contadorBebidas).map((nombreBebida) => {
        return {
            contador: `${contadorBebidas[nombreBebida]}`, // Contador de veces que se ha pedido esta bebida
            nombre: `${nombreBebida}`, // Nombre de la bebida
            imgBebida: querySnapshot.docs
                .find((pedidoDoc) => pedidoDoc.data().pedido.some((platilloPedido) => platilloPedido.bebida === nombreBebida))
                // Imagen de la bebida o una URL por defecto si no se encuentra la imagen
                .data().pedido.find((platilloPedido) => platilloPedido.bebida === nombreBebida)?.imgBebida || "URL_POR_DEFECTO",
        };
      });

			// Imprime en la consola los platillos, frutas y bebidas solicitadas
			console.log("Platillos Solicitados:", platillosEnPedidos); // Muestra en la consola los platillos solicitados con su información de conteo
			console.log("Frutas Solicitadas:", frutasEnPedidos); // Muestra en la consola las frutas solicitadas con su información de conteo
			console.log("Bebidas Solicitadas:", bebidasEnPedidos); // Muestra en la consola las bebidas solicitadas con su información de conteo

			// Establece los estados de platillos, frutas, bebidas y órdenes
			setPlatillosSolicitados(platillosEnPedidos); // Establece el estado de los platillos solicitados con la información de conteo
      setFrutasSolicitadas(frutasEnPedidos); // Establece el estado de las frutas solicitadas con la información de conteo
      setBebidasSolicitadas(bebidasEnPedidos); // Establece el estado de las bebidas solicitadas con la información de conteo
      setOrdenesPendientes(ordenesPendientesTemp); // Establece el estado de las órdenes pendientes
      setOrdenesEnPreparacion(ordenesEnPreparacionTemp); // Establece el estado de las órdenes en preparación
      setOrdenesFinalizadas(ordenesFinalizadasTemp); // Establece el estado de las órdenes finalizadas
		});

		// Devuelve una función de limpieza que detiene la escucha de cambios en la base de datos
		return () => unsubscribe();
	}, []); // El segundo argumento es un array vacío, lo que significa que este efecto solo se ejecutará una vez al montar el componente

  // Función para agregar un pedido a la lista de órdenes
  const agregarOrden = (ordenes, mesa, nombrePedido, imagenPlatillo) => {
    // Verifica si no existe una lista de órdenes para la mesa y la inicializa si es necesario
    if (!ordenes[mesa]) {
        ordenes[mesa] = [];
    }

    // Verifica que el nombre del pedido no esté vacío ni sea "liberado"
    if (nombrePedido && nombrePedido.trim() !== "" && nombrePedido !== "liberado") {
        // Busca si ya existe el platillo en la lista de órdenes para la mesa
        const platilloExistente = ordenes[mesa].find((orden) => orden.nombrePedido === nombrePedido);

        // Si el platillo ya existe, incrementa el número de órdenes
        if (platilloExistente) {
            platilloExistente.numeroOrden += 1;
        } else { // Si no existe, agrega el nuevo platillo a la lista de órdenes
            ordenes[mesa].push({
                numeroOrden: 1, // Número de órdenes del platillo
                nombrePedido, // Nombre del platillo
                imagenPlatillo: imagenPlatillo || "URL_POR_DEFECTO", // Imagen del platillo o una URL por defecto si no se proporciona
            });
        }
    }
  };

  // Función asincrónica para actualizar el estado de los pedidos
  const actualizarEstado = async (NumeroMesa, estadoActual, nuevoEstado) => {
    try {
        const horaFechaActual = new Date().toISOString(); // Obtiene la hora y fecha actual en formato ISO

        // Obtiene los documentos de la colección "pedidos"
        const pedidosSnapshot = await getDocs(collection(db, "pedidos"));

        // Filtra los documentos de la colección "pedidos" para encontrar aquellos que tienen el mismo número de mesa y el mismo estado actual
        const documentosFiltrados = pedidosSnapshot.docs.filter((doc) => {
          // Obtiene los pedidos del documento
          const pedidos = doc.data().pedido;
          // Retorna true si al menos un pedido dentro de los pedidos del documento tiene el mismo número de mesa y estado actual, de lo contrario retorna false
          return pedidos.some(
            // Verifica si el número de mesa del pedido y el estado del pedido son iguales a los parámetros del pedido
            (platilloPedido) =>
                platilloPedido.mesa === NumeroMesa && platilloPedido.estadoOrden === estadoActual
          );
        });
	
			// Ejecuta todas las promesas en paralelo para actualizar el estado de los platillos filtrados en todos los documentos filtrados
      await Promise.all(
        documentosFiltrados.map(async (doc) => {
            // Obtiene el ID del pedido, los datos del pedido y los pedidos del documento
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

            // Construye la clave para la hora y fecha de acuerdo al nuevo estado
            const horaFechaKey = `horaFecha${nuevoEstado.charAt(0).toUpperCase()}${nuevoEstado.slice(1)}`;
            
            // Actualiza la base de datos con los pedidos actualizados y la hora y fecha actualizada
            await updateDoc(doc.ref, { pedido: pedidos, [horaFechaKey]: horaFechaActual });
        })
      );
      // Imprime un mensaje indicando que se está actualizando el estado de la mesa
			console.log(`Actualizando estado de la mesa: ${NumeroMesa}`);
      // Imprime un mensaje indicando el nuevo estado al que se está actualizando
			console.log(`Actualizando estado a: ${nuevoEstado}`);
      // Imprime un mensaje indicando que el estado se ha actualizado correctamente
			console.log(`Estado actualizado correctamente.`);
		} catch (error) {
      // Imprime un mensaje indicando un Error al actualizar el estado
			console.error("Error al actualizar el estado de la orden:", error);
		}
	};
  // Declara un estado para controlar la visibilidad de imágenes por mesa, utilizando un objeto para almacenar el estado por mesa
  const [mostrarImagenes, setMostrarImagenes] = useState({});// Usar un objeto para almacenar el estado por mesa
  
  //Renderiza la pagina en un formato HTML
  return (
    <React.Fragment>
      {/* Divisor horizontal */}
      <div className="header_Line">
        <hr className="line" />
        {/* Título de la página */}
        <h2 className="page_Title">Mi Circulo-Azul</h2>
      </div>

      {/* Enlace para regresar a la página principal */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        {/* Imagen del botón de regreso */}
        <img className="img_Regresar_Cocina" src={regresar} />
      </Link>

      {/* Botón y capa para mostrar el PDF */}
      <div>
        {/* Botón que activa/desactiva la capa para mostrar el PDF */}
        <button className="Boton_PDF_Cocina" onClick={pdfMethods.toggleCapa}>
          {/* Texto del botón obtenido de pdfMethods */}
          {pdfMethods.botonComandaText}
        </button>
        {/* Renderizado condicional de la capa para seleccionar el PDF */}
        {pdfMethods.mostrarCapa && pdfMethods.renderCapaSeleccion()}
      </div>
      
      {/* Contenedor principal de las órdenes en la cocina */}
      <div class="Ordenes_Cocina">
        {/* Contenedor para el menú de órdenes */}
        <div className="Orden_Menu_Cocina">
          {/* Título de la sección de platillos solicitados */}
          <h2>Platillos Solicitados</h2>

          {/* Mapeo de los platillos solicitados */}
          {platillosSolicitados.map((platillo, index) => (
            <div className="Cuadro_Izquierda_Cocina" key={index}>
              {/* Fila para mostrar el contador del platillo */}
              <tr className="no_padding_Vertical">
                <td className="No_border_right_width">
                  {/* Contador del platillo */}
                  <div className="Texto_Cocina">{platillo.contador}</div>
                </td>
                {/* Nombre del platillo */}
                <td>
                  <b>{platillo.nombre}</b>
                </td>
              </tr>
              {/* Fila para mostrar la imagen del platillo */}
              <tr>
                <th colSpan="2">
                  {/* Imagen del platillo */}
                  <img
                    className="imagen_recortada"
                    src={platillo.imgPlatillo}
                    alt={`Platillo ${platillo.nombre}`}
                  />
                </th>
              </tr>
            </div>
          ))}

          {/* Mapeo de las frutas solicitadas */}
          {frutasSolicitadas.map((fruta, index) => (
            <div className="Cuadro_Izquierda_Cocina" key={index}>
              {/* Fila para mostrar el contador de la fruta */}
              <tr className="no_padding_Vertical">
                <td className="No_border_right_width">
                  {/* Contador de la fruta */}
                  <div className="Texto_Frutas">{fruta.contador}</div>
                </td>
                {/* Nombre de la fruta */}
                <td>
                  <b>{fruta.nombre}</b>
                </td>
              </tr>
              {/* Fila para mostrar la imagen de la fruta */}
              <tr>
                <th colSpan="2">
                  {/* Imagen de la fruta */}
                  <img
                    className="imagen_recortada"
                    src={fruta.imgFruta}
                    alt={`Fruta ${fruta.nombre}`}
                  />
                </th>
              </tr>
            </div>
          ))}

          {/* Mapeo de las bebidas solicitadas */}
          {bebidasSolicitadas.map((bebida, index) => (
            <div className="Cuadro_Izquierda_Cocina" key={index}>
              {/* Fila para mostrar el contador de la bebida */}
              <tr className="no_padding_Vertical">
                <td className="No_border_right_width">
                  {/* Contador de la bebida */}
                  <div className="Texto_Frutas">{bebida.contador}</div>
                </td>
                {/* Nombre de la bebida */}
                <td>
                  <b>{bebida.nombre}</b>
                </td>
              </tr>
              {/* Fila para mostrar la imagen de la bebida */}
              <tr>
                <th colSpan="2">
                  {/* Imagen de la bebida */}
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
            {/* Sección de órdenes pendientes */}
            <div className="section_Cocina">
              <h2>Órdenes Pendientes</h2>
            </div>

            {/* Contenedor para mostrar las órdenes pendientes por mesa */}
            <div className="Numero_Mesa_Cocina">
              {/* Mapeo de las órdenes pendientes por mesa */}
              {Object.entries(ordenesPendientes).map(([mesa, ordenesPorMesaArray]) => (
                <div className="displey_Cocina" key={mesa}>
                  {/* Contenedor para el botón de expandir/cerrar */}
                  <div className="contenedor_vertical_Cocina">
                    <button className="boton_2_Cocina" onClick={() => setMostrarImagenes(prevState => ({ ...prevState, [mesa]: !prevState[mesa] }))}>
                      {/* Icono para expandir/cerrar */}
                      {mostrarImagenes[mesa] ? "︾︽" : "︽︾"}
                    </button>
                  </div>
                  {/* Contenedor para las órdenes pendientes */}
                  <td className="Quitar_Borde_Cocina">
                    {/* Mapeo de las órdenes pendientes para la mesa actual */}
                    {ordenesPorMesaArray.map((orden, index) => (
                      <div className="table_Cocina" key={index}>
                        {/* Condicional para mostrar la imagen de la orden si está expandida */}
                        {mostrarImagenes[mesa] ? (
                          <React.Fragment>
                            <tr>
                              <th colSpan="2">{orden.nombrePedido}</th>
                            </tr>
                            <tr className="no_padding_Cocina">
                              <td className="No_border_right_width">{orden.numeroOrden}</td>
                              <td className="No_border_laterals_width">
                                {/* Imagen de la orden */}
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
                            {/* Contenedor para mostrar el número de orden y el nombre */}
                            <td className="tabla_Cocina">
                              <div className="No_border_right_width">{orden.numeroOrden}</div>
                            </td>
                            <td className="tabla_Texto_Cocina">{orden.nombrePedido}</td>
                          </React.Fragment>
                        )}
                      </div>
                    ))}
                  </td>
                  {/* Contenedor para mostrar el número de mesa */}
                  <div rowSpan="2" className="Cubrir_Alto_Cocina" key={mesa}>
                    {/* Número de mesa */}
                    <div class="Ajustar_Texto_Cocina">
                      <h2>{mesa}</h2>
                    </div>
                  </div>
                  {/* Contenedor para el botón de actualizar estado */}
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
            {/* Sección de órdenes en preparación */}
            <div className="section_Cocina">
              <h2>Órdenes en Preparación</h2>
            </div>

            {/* Contenedor para mostrar las órdenes en preparación por mesa */}
            <div className="Numero_Mesa_Cocina">
              {/* Mapeo de las órdenes en preparación por mesa */}
              {Object.entries(ordenesEnPreparacion).map(([mesa, ordenesPorMesaArray]) => (
                <div className="displey_Cocina" key={mesa}>
                  {/* Contenedor para el botón de expandir/cerrar */}
                  <div className="contenedor_vertical_Cocina">
                    <button className="boton_2_Cocina"onClick={() => setMostrarImagenes(prevState => ({ ...prevState, [mesa]: !prevState[mesa] }))}>
                      {/* Icono para expandir/cerrar */}
                      {mostrarImagenes[mesa] ? "︾︽" : "︽︾"}
                    </button>
                  </div>
                  {/* Contenedor para las órdenes en preparación */}
                  <td className="Quitar_Borde_Cocina">
                    {/* Mapeo de las órdenes en preparación para la mesa actual */}
                    {ordenesPorMesaArray.map((orden, index) => (
                      <div className="table_Cocina" key={index}>
                        {/* Condicional para mostrar la imagen de la orden si está expandida */}
                        {mostrarImagenes[mesa] ? (
                          <React.Fragment>
                            <tr>
                              <th colSpan="2">{orden.nombrePedido}</th>
                            </tr>
                            <tr className="no_padding_Cocina">
                              <td className="No_border_right_width">{orden.numeroOrden}</td>
                              <td className="No_border_laterals_width">
                                {/* Imagen de la orden */}
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
                            {/* Contenedor para mostrar el número de orden y el nombre */}
                            <td className="tabla_Cocina">
                              <div className="No_border_right_width">{orden.numeroOrden}</div>
                            </td>
                            <td className="tabla_Texto_Cocina">{orden.nombrePedido}</td>
                          </React.Fragment>
                        )}
                      </div>
                    ))}
                  </td>
                  {/* Contenedor para mostrar el número de mesa */}
                  <div rowSpan="2" className="Cubrir_Alto_Cocina" key={mesa}>
                    {/* Número de mesa */}
                    <div class="Ajustar_Texto_Cocina">
                      <h2>{mesa}</h2>
                    </div>
                  </div>
                  {/* Contenedor para los botones de actualizar estado */}
                  <div className="contenedor_vertical_Cocina">
                    {/* Botón para cambiar el estado a "pendiente" */}
                    <button className="boton_Cocina" onClick={() => actualizarEstado(mesa, "preparacion", "pendiente")}>
                      ⇑
                    </button>
                    {/* Botón para cambiar el estado a "finalizado" */}
                    <button className="boton_Cocina" onClick={() => actualizarEstado(mesa, "preparacion", "finalizado")}>
                      ⇓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            {/* Sección de órdenes finalizadas */}
            <div className="section_Cocina">
              <h2>Órdenes Finalizadas</h2>
            </div>
            {/* Contenedor para mostrar las órdenes finalizadas por mesa */}
            <div className="Numero_Mesa_Cocina">
              {/* Mapeo de las órdenes finalizadas por mesa */}
              {Object.entries(ordenesFinalizadas).map(([mesa, ordenesPorMesaArray]) => (
                <div className="displey_Cocina" key={mesa}>
                  {/* Contenedor para el botón de expandir/cerrar */}
                  <div className="contenedor_vertical_Cocina">
                    <button className="boton_2_Cocina"onClick={() => setMostrarImagenes(prevState => ({ ...prevState, [mesa]: !prevState[mesa] }))}>
                      {/* Icono para expandir/cerrar */}
                      {mostrarImagenes[mesa] ? "︾︽" : "︽︾"}
                    </button>
                  </div>
                  {/* Contenedor para las órdenes finalizadas */}
                  <td className="Quitar_Borde_Cocina">
                    {/* Mapeo de las órdenes finalizadas para la mesa actual */}
                    {ordenesPorMesaArray.map((orden, index) => (
                      <div className="table_Cocina" key={index}>
                        {/* Condicional para mostrar la imagen de la orden si está expandida */}
                        {mostrarImagenes[mesa] ? (
                          <React.Fragment>
                            <tr>
                              <th colSpan="2">{orden.nombrePedido}</th>
                            </tr>
                            <tr className="no_padding_Cocina">
                              <td className="No_border_right_width">{orden.numeroOrden}</td>
                              <td className="No_border_laterals_width">
                                {/* Imagen de la orden */}
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
                            {/* Contenedor para mostrar el número de orden y el nombre */}
                            <td className="tabla_Cocina">
                              <div className="No_border_right_width">{orden.numeroOrden}</div>
                            </td>
                            <td className="tabla_Texto_Cocina">{orden.nombrePedido}</td>
                          </React.Fragment>
                        )}
                      </div>
                    ))}
                  </td>
                  {/* Contenedor para mostrar el número de mesa */}
                  <div rowSpan="2" className="Cubrir_Alto_Cocina" key={mesa}>
                    {/* Número de mesa */}
                    <div class="Ajustar_Texto_Cocina">
                      <h2>{mesa}</h2>
                    </div>
                  </div>
                  {/* Contenedor para los botones de actualizar estado */}
                  <div className="contenedor_vertical_Cocina">
                    {/* Botón para cambiar el estado a "preparación" */}
                    <button className="boton_Cocina" onClick={() => actualizarEstado(mesa, "finalizado", "preparacion")}>
                      ⇑
                    </button>
                    {/* Botón para cambiar el estado a "liberado" */}
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
// Exporta el componente Cocina para App
export default Cocina;
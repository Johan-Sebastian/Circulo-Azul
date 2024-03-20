import { db } from "../firebase/firebaseConfig";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

function registrarPedido(pedido) {
  const registrar = async () => {
    const timestamp = serverTimestamp();

    // Obtener la fecha y hora actual
    const now = new Date();

    // Formatear la fecha y hora según el formato deseado
    const anio = now.getFullYear().toString();
    const mes = (now.getMonth() + 1).toString().padStart(2, '0');
    const dia = now.getDate().toString().padStart(2, '0');
    const hora = now.getHours().toString().padStart(2, '0');
    const minutos = now.getMinutes().toString().padStart(2, '0');
    const segundos = now.getSeconds().toString().padStart(2, '0');

    // Generar 8 dígitos aleatorios
    const randomDigits = Math.floor(10000000 + Math.random() * 80000000);
    const DA = "A";
    // Construir el ID utilizando el formato especificado
    const idPedido = `${anio}${mes}${dia}${hora}${minutos}${segundos}${DA}${randomDigits}`;

    // Añadir el campo "estadoOrden" al pedido
    const pedidosConEstado = pedido.map((pedidoIndividual) => {
      return { 
        ...pedidoIndividual, 
        estadoOrden: "pendiente" 
      };
    });

    try {
      // Utiliza la función doc para obtener una referencia al documento con el ID personalizado
      const pedidoRef = doc(db, "pedidos", idPedido);

      // Utiliza la función setDoc para crear un nuevo documento con el ID personalizado y los datos del pedido
      const pedidoData = { 
        pedido: pedidosConEstado, 
        fechaHora: timestamp 
      };

      // Añadir la hora y fecha de pendiente después de la fechaHora y antes de horaFechaPendiente
      pedidoData[`horaFechaPendiente`] = timestamp;

      await setDoc(pedidoRef, pedidoData);

      // Imprime en la consola el ID del documento recién creado
      console.log("Documento creado con ID:", idPedido);
    } catch (error) {
      console.error("Error al agregar el pedido a la base de datos:", error);
    }
    
    pedido.forEach((elemento, indice) => {
      console.log(`Elemento en la posición ${indice}:`, elemento);
    });
    console.log("Mesero escrito con ID: ", pedido.mesero);
  };

  // Llama a la función asincrónica registrar
  registrar();
}

export default registrarPedido;

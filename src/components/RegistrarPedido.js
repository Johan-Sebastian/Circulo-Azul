import { db } from "../firebase/firebaseConfig"; // Importa la instancia de la base de datos Firestore
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore"; // Importa funciones de Firestore para manipular documentos

// Definición de la función para registrar un pedido en la base de datos
function registrarPedido(pedido) {
  const registrar = async () => { // Define una función asíncrona llamada 'registrar'
    const timestamp = serverTimestamp(); // Obtiene la marca de tiempo del servidor

    // Obtiene la fecha y hora actual
    const now = new Date();

    // Formatear la fecha y hora según el formato deseado
    const anio = now.getFullYear().toString();
    // Obtiene el mes actual como un número (de 0 a 11), le suma 1 para obtener el mes real,
    // luego lo convierte en una cadena de texto y lo ajusta a una longitud mínima de 2 caracteres agregando ceros a la izquierda si es necesario
    const mes = (now.getMonth() + 1).toString().padStart(2, '0');
    // Obtiene el día del mes actual como un número, lo convierte en una cadena de texto y lo ajusta a una longitud mínima de 2 caracteres
    const dia = now.getDate().toString().padStart(2, '0');
    // Obtiene la hora del día actual como un número (de 0 a 23), lo convierte en una cadena de texto y lo ajusta a una longitud mínima de 2 caracteres
    const hora = now.getHours().toString().padStart(2, '0');
    // Obtiene los minutos de la hora actual como un número, lo convierte en una cadena de texto y lo ajusta a una longitud mínima de 2 caracteres
    const minutos = now.getMinutes().toString().padStart(2, '0');
    // Obtiene los segundos del minuto actual como un número, lo convierte en una cadena de texto y lo ajusta a una longitud mínima de 2 caracteres
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
    
    // Imprime los elementos del pedido en la consola
    pedido.forEach((elemento, indice) => {
      console.log(`Elemento en la posición ${indice}:`, elemento);
    });
    console.log("Mesero escrito con ID: ", pedido.mesero);
  };

  // Llama a la función asincrónica registrar
  registrar();
}
// Exporta la función 'registrarPedido' para su uso en otros archivos
export default registrarPedido;

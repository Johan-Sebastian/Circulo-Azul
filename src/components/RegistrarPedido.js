import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function registrarPedido(pedido) {
  const registrar = async () => {
    const timestamp = serverTimestamp();
    // Itera sobre cada elemento (mapa) en el array de pedidos
    const pedidosConEstado = pedido.map((pedidoIndividual) => {
      // Añade la variable estadoOrden con el valor "pendiente" al mapa individual
      return { 
        ...pedidoIndividual, 
        estadoOrden: "pendiente" };
    });

    try {
      // Utiliza la función addDoc para agregar un nuevo documento a la colección "pedidos"
      const docRef = await addDoc(collection(db, "pedidos"), { pedido: pedidosConEstado, fechaHora: timestamp });

      // Imprime en la consola el ID del documento recién creado
      console.log("Documento escrito con ID: ", docRef.id);
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
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

function registrarPedido(pedido) {
  const registrar = async () => {
    // Itera sobre cada elemento (mapa) en el array de pedidos
    const pedidosConEstado = pedido.map((pedidoIndividual) => {
      // Añade la variable estadoOrden con el valor "pendiente" al mapa individual
      return { ...pedidoIndividual, estadoOrden: "pendiente" };
    });

    // Utiliza la función addDoc para agregar un nuevo documento a la colección "pedidos"
    const docRef = await addDoc(collection(db, "pedidos"), { pedido: pedidosConEstado });
    
    // Imprime en la consola el ID del documento recién creado
    console.log("Documento escrito con ID: ", docRef.id);
  };

  // Llama a la función asincrónica registrar
  registrar();
}

export default registrarPedido;
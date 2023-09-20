import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

function registrarPedido(pedido){
    const registrar = async() => {
      const docRef = await addDoc(collection(db, "pedidos"), {pedido});
      console.log("Document written with ID: ", docRef.id);
    }
    registrar();
}

export default registrarPedido;
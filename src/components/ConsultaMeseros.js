// Importa los hooks necesarios de React y las funciones necesarias de Firebase
import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

// Función para consultar la información de los meseros desde la base de datos
function ConsultaMeseros() {
  // Define el nombre de la colección donde se encuentran los meseros
  const coleccion = "meseros";
  // Define el estado para almacenar la información de los meseros
  const [meseros, setMeseros] = useState([]);

  // Función asincrónica para obtener la información de los meseros desde la base de datos
  const obtenerMeseros = async () => {
    // Obtiene todos los documentos de la colección de meseros
    const meseros = await getDocs(collection(db, coleccion));
    const prevMeseros = [];

    // Itera sobre cada documento y lo agrega al estado de meseros
    meseros.forEach((mesero) => {
      prevMeseros.push({
        IdMesero: mesero.id,
        Nombre: mesero.data().nombre,
        Foto: mesero.data().imagen,
      });
    });
    // Actualiza el estado de los meseros con los datos obtenidos
    setMeseros(prevMeseros);
  };

  // Efecto que se ejecuta al montar el componente para obtener la información de los meseros
  useEffect(() => {
    obtenerMeseros();
  }, []); // El efecto se ejecuta solo una vez al montar el componente

  // Retorna la información de los meseros obtenida de la base de datos
  return meseros;
}
// Exporta la función ConsultaMeseros
export default ConsultaMeseros;

// Importa los hooks necesarios de React y las funciones necesarias de Firebase
import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

// Función para consultar un menú de la base de datos
function ConsultaMenu(coleccion) {
  // Define el estado para almacenar el menú
  const [menu, setMenu] = useState([]);

  // Función asincrónica para obtener el menú desde la base de datos
  const obtenerMenu = async () => {
    // Obtiene todos los documentos de la colección especificada
    const menu = await getDocs(collection(db, coleccion));
    const prevMenu = [];

    // Itera sobre cada documento y lo agrega al estado del menú
    menu.forEach((item) => {
      prevMenu.push({
        IdItem: item.id,
        Nombre: item.data().nombre,
        Foto: item.data().imagen,
      });
    });
    // Actualiza el estado del menú con los datos obtenidos
    setMenu(prevMenu);
  };
  // Efecto que se ejecuta al montar el componente para obtener el menú
  useEffect(() => {
    obtenerMenu();
  }, []); // El efecto se ejecuta solo una vez al montar el componente
  // Retorna el menú obtenido de la base de datos
  return menu;
}
// Exporta la función ConsultaMenu
export default ConsultaMenu;
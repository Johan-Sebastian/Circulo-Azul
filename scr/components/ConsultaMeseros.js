import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

function ConsultaMeseros() {
  const coleccion = "meseros";
  const [meseros, setMeseros] = useState([]);

  const obtenerMeseros = async () => {
    const meseros = await getDocs(collection(db, coleccion));
    const prevMeseros = [];

    meseros.forEach((mesero) => {
      prevMeseros.push({
        IdMesero: mesero.id,
        Nombre: mesero.data().nombre,
        Foto: mesero.data().imagen,
      });
    });
    setMeseros(prevMeseros);
  };

  useEffect(() => {
    obtenerMeseros();
  }, []);

  return meseros;
}

export default ConsultaMeseros;

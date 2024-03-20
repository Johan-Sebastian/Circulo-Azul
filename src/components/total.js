import React, { useState, useEffect } from "react";
import "../css/total.css";
import terminar from "../assets/images/terminar.png";
import { Link } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const Total = () => {
    //UseState para almacenar la lista generada
    const [total, setTotal] = useState(0);

    //Metodo para obtener el número de clientes
    useEffect(() => {
        var noCLientesStorage = localStorage.getItem('NoClientes');

        const obtenerCostoPorPedido = async () => {
            try {
                // Obtener el documento de la colección "Costo" con un ID específico
                const costoDocRef = doc(db, "Costo", "MXN$");
                const costoDocSnap = await getDoc(costoDocRef);
                
                // Verificar si el documento existe y contiene el campo "CostoPorPedido"
                if (costoDocSnap.exists()) {
                    const costoPorPedido = costoDocSnap.data().CostoPorPedido;
                    // Actualizar el estado con el valor obtenido de la base de datos
                    setTotal(costoPorPedido * noCLientesStorage);
                    console.log("Costo por pedido obtenido:", costoPorPedido);
                } else {
                    console.log("El documento no existe o no contiene el campo 'CostoPorPedido'.");
                }
            } catch (error) {
                console.error("Error al obtener el costo por pedido:", error);
            }
        };

        obtenerCostoPorPedido();
    }, []);

    return (
        <body className="pantalla-total">
            <div>
                <h1 className="Encabezado-Total">Su orden se ha enviado</h1>
                <h1 className="Precio-Total">${total}</h1>

                <Link to="/Mesas" style={{ textDecoration: 'none' }}><img className="img-terminar" src={terminar}/></Link>
            </div>
        </body>           
    );
};

export default Total;  
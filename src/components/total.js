import React, { useState, useEffect } from "react"; // Importa la biblioteca React y los hooks useState y useEffect
import "../css/total.css"; // Importa el archivo de estilos para la pantalla Total
import terminar from "../assets/images/terminar.png"; // Importa la imagen del botón "Terminar"
import { Link } from "react-router-dom"; // Importa el componente Link de react-router-dom para la navegación
import { db } from "../firebase/firebaseConfig"; // Importa la instancia de la base de datos de Firebase
import { doc, getDoc } from "firebase/firestore"; // Importa las funciones doc y getDoc para obtener documentos de Firestore

// Componente funcional Total para mostrar el precio total de la orden
const Total = () => {
    // UseState para almacenar el precio total de la orden generada
    const [total, setTotal] = useState(0);

    // Método para obtener el número de clientes y calcular el precio total de la orden
    useEffect(() => {
        // Obtiene el número de clientes almacenado en el localStorage
        var noCLientesStorage = localStorage.getItem('NoClientes');

        // Función asincrónica para obtener el costo por pedido desde Firestore
        const obtenerCostoPorPedido = async () => {
            try {
                // Obtener el documento de la colección "Costo" con un ID específico
                const costoDocRef = doc(db, "Costo", "MXN$");
                // Obtiene una instantánea del documento "Costo" usando la referencia
                const costoDocSnap = await getDoc(costoDocRef);
                
                // Verificar si el documento existe y contiene el campo "CostoPorPedido"
                if (costoDocSnap.exists()) {
                    const costoPorPedido = costoDocSnap.data().CostoPorPedido;
                    // Actualizar el estado con el valor obtenido de la base de datos
                    setTotal(costoPorPedido * noCLientesStorage);
                    // Imprime en la consola el costo por pedido obtenido
                    console.log("Costo por pedido obtenido:", costoPorPedido);
                } else {
                    // Si el documento no existe o no contiene el campo "CostoPorPedido", imprime un mensaje de advertencia
                    console.log("El documento no existe o no contiene el campo 'CostoPorPedido'.");
                }
            } catch (error) {
                // Si ocurre un error al obtener el costo por pedido, imprime un mensaje de error
                console.error("Error al obtener el costo por pedido:", error);
            }
        };
        // Llama a la función para obtener el costo por pedido al montar el componente
        obtenerCostoPorPedido();
    }, []);

    return (
        <body className="pantalla-total">
            <div>
                {/* Encabezado indicando que la orden se ha enviado */}
                <h1 className="Encabezado-Total">Su orden se ha enviado</h1>
                {/* Muestra el precio total de la orden */}
                <h1 className="Precio-Total">${total}</h1>
                {/* Enlace al componente Mesas con la imagen del botón "Terminar" */}
                <Link to="/Mesas" style={{ textDecoration: 'none' }}><img className="img-terminar" src={terminar}/></Link>
            </div>
        </body>           
    );
};
// Exporta el componente Total
export default Total;  
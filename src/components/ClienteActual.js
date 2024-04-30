// Importa React y los hooks useState y useEffect desde la biblioteca 'react'
import React, {useState, useEffect} from "react";
// Importa el archivo CSS para este componente
import "../css/clienteActual.css"

// Define el componente ClienteActual como una función de React
function ClienteActual() {
	// Define un estado llamado clienteStorage y una función para actualizarlo llamada setClienteStorage
	const [clienteStorage, setClienteStorage] = useState(0);// Inicializa clienteStorage con el valor 0

	// Este efecto se ejecuta solo una vez, cuando el componente se monta
	useEffect(() =>{
		// Obtiene el valor del cliente actual del almacenamiento local (localStorage)
		var clienteActual = localStorage.getItem('clienteActual');
		// Obtiene el número total de clientes del almacenamiento local (localStorage)
		var noClientes = localStorage.getItem('NoClientes');
		// Calcula el número del cliente actual restando el cliente actual del total de clientes y sumando 1
		clienteActual = noClientes - clienteActual + 1;

		// Se asigna el valor calculado del cliente actual al estado clienteStorage
		setClienteStorage(clienteActual)
	}, []); // El segundo argumento es un array vacío, lo que significa que este efecto solo se ejecutará una vez al montar el componente

	// Devuelve el valor del clienteStorage, que es el número del cliente actual
	return(
		clienteStorage
	)
}

// Exporta el componente ClienteActual para que pueda ser utilizado en otros componentes
export default ClienteActual;

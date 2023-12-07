import React, {useState, useEffect} from "react";
import "../css/clienteActual.css"

function ClienteActual() {
    const [clienteStorage, setClienteStorage] = useState(0);

    useEffect(() =>{
        var clienteActual = localStorage.getItem('clienteActual');
        var noClientes = localStorage.getItem('NoClientes');
        clienteActual = noClientes - clienteActual + 1;

        //Se asigna el valor del cliente actual
        setClienteStorage(clienteActual)
    }, []);

    return(
        clienteStorage
    )
}

export default ClienteActual;
import React, { useEffect, useState } from "react"; // Importa React desde la biblioteca react
import "../css/observaciones.css"; // Importa los estilos CSS para la pantalla de observaciones
import cancelar from '../assets/images/cancelar.png'; // Importa la imagen de cancelar desde la ruta de imágenes
import aceptar from "../assets/images/sucess.png"; // Importa la imagen de éxito desde la ruta de imágenes
import { Link } from "react-router-dom"; // Importa el componente Link de react-router-dom
import ClienteActual from "./ClienteActual"; // Importa el componente ClienteActual

import Container from '@mui/material/Container'; // Importa el componente Container de Material-UI
import Stack from '@mui/material/Stack'; // Importa el componente Stack de Material-UI
import Button from '@mui/material/Button'; // Importa el componente Button de Material-UI

const Observaciones = () => {
    // Uso de useState para la dirección de redirección
    const [direccion, setDireccion] = useState("");

    useEffect(() =>{
        console.log("Componente renderizado")
        var clienteActual = localStorage.getItem('clienteActual');

        //Se reduce el número de clientes
        clienteActual = clienteActual - 1;
        console.log(clienteActual);
        localStorage.setItem("clienteActual", clienteActual)

        //Condición para asignar la dirección
        if (clienteActual > 0){
            setDireccion("/Platillos")
        }
        else{
            setDireccion("/ConfirmarOrden")
        }
    }, []);

    // Obtener datos del localStorage y crear el objeto pedido
    var clienteActual1 = localStorage.getItem('clienteActual'); // Obtiene el valor de 'clienteActual' del localStorage
    var mesa1 = localStorage.getItem('Mesa'); // Obtiene el valor de 'Mesa' del localStorage
    var noClientes1 = localStorage.getItem('NoClientes'); // Obtiene el valor de 'NoClientes' del localStorage
    var platillo1 = localStorage.getItem('Platillo'); // Obtiene el valor de 'Platillo' del localStorage
    var imgPLatillo1 = localStorage.getItem('imgPlatillo'); // Obtiene el valor de 'imgPlatillo' del localStorage
    var bebida1 = localStorage.getItem('Bebida'); // Obtiene el valor de 'Bebida' del localStorage
    var imgBebida1 = localStorage.getItem('imgBebida'); // Obtiene el valor de 'imgBebida' del localStorage
    var fruta1 = localStorage.getItem('Fruta'); // Obtiene el valor de 'Fruta' del localStorage
    var imgFruta1 = localStorage.getItem('imgFruta'); // Obtiene el valor de 'imgFruta' del localStorage
    var Mesero1 = localStorage.getItem('Mesero'); // Obtiene el valor de 'Mesero' del localStorage
    var observacion1 = localStorage.getItem('Observacion'); // Obtiene el valor de 'Observacion' del localStorage
    var ordenesListStorage = localStorage.getItem('ordenesList'); // Obtiene el valor de 'ordenesList' del localStorage

    var pedido = {
        clienteActual : clienteActual1, // Asigna el valor de 'clienteActual' al atributo 'clienteActual' del objeto 'pedido'
        mesa : mesa1, // Asigna el valor de 'Mesa' al atributo 'mesa' del objeto 'pedido'
        noClientes : noClientes1, // Asigna el valor de 'NoClientes' al atributo 'noClientes' del objeto 'pedido'
        platillo : platillo1, // Asigna el valor de 'Platillo' al atributo 'platillo' del objeto 'pedido'
        imgPlatillo : imgPLatillo1, // Asigna el valor de 'imgPlatillo' al atributo 'imgPlatillo' del objeto 'pedido'
        bebida : bebida1, // Asigna el valor de 'Bebida' al atributo 'bebida' del objeto 'pedido'
        imgBebida : imgBebida1, // Asigna el valor de 'imgBebida' al atributo 'imgBebida' del objeto 'pedido'
        fruta : fruta1, // Asigna el valor de 'Fruta' al atributo 'fruta' del objeto 'pedido'
        imgFruta : imgFruta1, // Asigna el valor de 'imgFruta' al atributo 'imgFruta' del objeto 'pedido'
        Mesero : Mesero1, // Asigna el valor de 'Mesero' al atributo 'Mesero' del objeto 'pedido'
        observacion : observacion1 // Asigna el valor de 'Observacion' al atributo 'observacion' del objeto 'pedido'
    }

    // Método para guardar la observación en el localStorage
    function saveObservacion(observacion) {
        localStorage.setItem("Observacion", observacion);

        // Obtener la lista de órdenes del localStorage y agregar el nuevo pedido
        var ordenesList = JSON.parse(ordenesListStorage) || [];
        ordenesList.push(pedido);
        console.log(ordenesList);
        localStorage.setItem("ordenesList", JSON.stringify(ordenesList));
    }

    return (
        <div className="pantalla-observaciones">
            {/* Botón para cancelar */}
            <Link to="/Meseros" style={{ textDecoration: 'none' }}><img className="img_cancelar_2" src={cancelar} /></Link>
            <h1>Se confirma el:</h1>
            {/* Título de la pantalla con el número de cliente */}
            <div className="Titulo_h2">Cliente : <ClienteActual /></div>

            {/* Contenedor de botones */}
            <Container >
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={4} marginTop="2%">
                    {/* Botón de aceptar con redirección */}
                    <Button onClick={()=> saveObservacion("")} size="50 px" borderRadius={12} type="button"><Link to={direccion} style={{ textDecoration: 'none' }}><img className="btn-redonda" src={aceptar} /></Link></Button>

                </Stack>
            </Container>
        </div>
    );
};
// Exporta el componente Observaciones
export default Observaciones;

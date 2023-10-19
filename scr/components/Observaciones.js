import React, { useEffect, useState } from "react";
import "../css/observaciones.css";
import cancelar from '../assets/images/cancelar.png';
import cancel from '../assets/images/cancel.png';
import aceptar from "../assets/images/sucess.png";
import { Link } from "react-router-dom";
import ClienteActual from "./ClienteActual";

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const Observaciones = () => {
    //Uso de useState
    const [direccion, setDireccion] = useState("");

    //Metodo para guardar la observación en el LocalStorage
    function saveObservacion(observacion) {
        localStorage.setItem("Observacion", observacion)

        //Se obtienen los demas parametros guardados en el local storage
        var mesa1 = localStorage.getItem('Mesa');
        var noClientes1 = localStorage.getItem('NoClientes');
        var platillo1 = localStorage.getItem('Platillo');
        var imgPLatillo1 = localStorage.getItem('imgPlatillo');
        var bebida1 = localStorage.getItem('Bebida');
        var imgBebida1 = localStorage.getItem('imgBebida');
        var fruta1 = localStorage.getItem('Fruta');
        var imgFruta1 = localStorage.getItem('imgFruta');
        var observacion1 = localStorage.getItem('Observacion');
        var ordenesListStorage = localStorage.getItem('ordenesList');

        //Se crea un objeto de lista
        var pedido = {
            mesa : mesa1,
            noClientes : noClientes1,
            platillo : platillo1,
            imgPlatillo : imgPLatillo1,
            bebida : bebida1,
            imgBebida : imgBebida1,
            fruta : fruta1,
            imgFruta : imgFruta1,
            observacion : observacion1
        }

        //Se crea la lista y se agrega el registro
        var ordenesList = [];
        ordenesList = JSON.parse(ordenesListStorage);
        ordenesList.push(pedido)
        console.log(ordenesList)
        localStorage.setItem("ordenesList", JSON.stringify(ordenesList))
    }

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

    return (
        <div className="pantalla-observaciones">
            <Link to="/Meseros" style={{ textDecoration: 'none' }}><img className="img-cancelar" src={cancelar} /></Link>
            <h1>Observaciones</h1>
            <h1 className="cliente-actual"><ClienteActual /></h1>
            <div className="content-input">
                <textarea id="txtObservacion" className="input-observaciones" name="textarea" placeholder="Escribe aquí las observaciones"></textarea>
            </div>
            
            <Container >
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={4} marginTop="2%">
                    <Button onClick={()=> saveObservacion("")} size="50 px" borderRadius={12} type="button"><Link to={direccion} style={{ textDecoration: 'none' }}><img className="btn-redonda" src={cancel} /></Link></Button>
                    <Button onClick={()=> saveObservacion(document.getElementById("txtObservacion").value)} size="50 px" borderRadius={12} type="button"><Link to={direccion} style={{ textDecoration: 'none' }}><img className="btn-redonda" src={aceptar} /></Link></Button>
                </Stack>
            </Container>
        </div>
    );
};

export default Observaciones;  
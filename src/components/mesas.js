import React from "react";
import "../css/mesas.css";
import cancelar from '../assets/images/cancelar.png';
import { Link } from "react-router-dom";
import { Alert } from "@mui/material";

const Mesas = () => {

    //Metodo para guardar la mesa en el LocalStorage
    function saveMesa(mesa){
        localStorage.setItem("Mesa", mesa)

        //Se declara una lista que almacenara los pedidos y se sube al LocalStorage
        var ordenesList = [];
        localStorage.setItem("ordenesList", JSON.stringify(ordenesList))

    }
    return (
        <div className="pantalla-mesas">
            <Link to="/Meseros" style={{ textDecoration: 'none' }}><img className="img-cancelar" src={cancelar} /></Link>
            <h1>Selecciona tu mesa</h1>
            <div class="flex-container">
                <Link to="/Clientes" style={{ textDecoration: 'none' }}><div onClick={() => saveMesa(1)} className="flex-item">1</div></Link>
                <Link to="/Clientes" style={{ textDecoration: 'none' }}><div onClick={() => saveMesa(2)} className="flex-item">2</div></Link>
                <Link to="/Clientes" style={{ textDecoration: 'none' }}><div onClick={() => saveMesa(3)} className="flex-item">3</div></Link>
                <Link to="/Clientes" style={{ textDecoration: 'none' }}><div onClick={() => saveMesa(4)} className="flex-item">4</div></Link>
                <Link to="/Clientes" style={{ textDecoration: 'none' }}><div onClick={() => saveMesa(5)} className="flex-item">5</div></Link>
                <Link to="/Clientes" style={{ textDecoration: 'none' }}><div onClick={() => saveMesa(6)} className="flex-item">6</div></Link>
            </div>
        </div>
    );
};

export default Mesas;  
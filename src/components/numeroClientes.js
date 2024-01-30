import React from "react";
import "../css/clientes.css";
import uno from '../assets/images/unapersona.png'
import dos from '../assets/images/dospersonas.png'
import tres from '../assets/images/trespersonas.png'
import cuatro from '../assets/images/cuatropersonas.png'
import cinco from '../assets/images/cincopersonas.png'
import seis from '../assets/images/seispersonas.png'
import cancelar from '../assets/images/cancelar.png';

import { Link } from "react-router-dom";

const Clientes = () => {
    //Metodo para guardar el número de clientes en el LocalStorage
    function saveNoClientes(No){
        localStorage.setItem("NoClientes", No)
        localStorage.setItem("clienteActual", No)
    }
    return (
        <div className="pantalla-clientes">
            <Link to="/Meseros" style={{ textDecoration: 'none' }}><img className="img-cancelar" src={cancelar} /></Link>
            <h1>¿Cuántas personas hay?</h1>
            <div>
                <Link to="/Mesas" style={{ textDecoration: 'none' }}>
                    <button className="boton_Meseros">
                        🢀
                    </button>
                </Link>
            </div>
            <div class="flex-container-clientes">
                <Link onClick={() => saveNoClientes(1)} to="/Platillos" style={{ textDecoration: 'none' }}>
                    <div class="flex-item-personas">
                        <div className="numero">1</div>
                        <div className="content-img"><img src={uno} /></div>
                    </div>
                </Link>
                <Link onClick={() => saveNoClientes(2)} to="/Platillos" style={{ textDecoration: 'none' }}>
                    <div class="flex-item-personas">
                        <div className="numero">2</div>
                        <div className="content-img"><img src={dos} /></div>
                    </div>
                </Link>
                <Link onClick={() => saveNoClientes(3)} to="/Platillos" style={{ textDecoration: 'none' }}>
                    <div class="flex-item-personas">
                        <div className="numero">3</div>
                        <div className="content-img"><img src={tres} /></div>
                    </div>
                </Link>
                <Link onClick={() => saveNoClientes(4)} to="/Platillos" style={{ textDecoration: 'none' }}>
                    <div class="flex-item-personas">
                        <div className="numero">4</div>
                        <div className="content-img"><img src={cuatro} /></div>
                    </div>
                </Link>
                <Link onClick={() => saveNoClientes(5)} to="/Platillos" style={{ textDecoration: 'none' }}>
                    <div class="flex-item-personas">
                        <div className="numero">5</div>
                        <div className="content-img"><img src={cinco} /></div>
                    </div>
                </Link>
                <Link onClick={() => saveNoClientes(6)} to="/Platillos" style={{ textDecoration: 'none' }}>
                    <div class="flex-item-personas">
                        <div className="numero">6</div>
                        <div className="content-img"><img src={seis} /></div>
                    </div>
                </Link>

            </div>
        </div>
    );
};

export default Clientes;  
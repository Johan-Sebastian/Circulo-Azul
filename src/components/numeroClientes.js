import React from "react"; // Importa React desde la biblioteca react
import "../css/clientes.css"; // Importa los estilos CSS para la pantalla de clientes
import uno from '../assets/images/unapersona.png'; // Importa la imagen de una persona desde la ruta de imágenes
import dos from '../assets/images/dospersonas.png'; // Importa la imagen de dos personas desde la ruta de imágenes
import tres from '../assets/images/trespersonas.png'; // Importa la imagen de tres personas desde la ruta de imágenes
import cuatro from '../assets/images/cuatropersonas.png'; // Importa la imagen de cuatro personas desde la ruta de imágenes
import cinco from '../assets/images/cincopersonas.png'; // Importa la imagen de cinco personas desde la ruta de imágenes
import seis from '../assets/images/seispersonas.png'; // Importa la imagen de seis personas desde la ruta de imágenes
import cancelar from '../assets/images/cancelar.png'; // Importa la imagen de cancelar desde la ruta de imágenes

import { Link } from "react-router-dom"; // Importa el componente Link de react-router-dom

const Clientes = () => {
    //Metodo para guardar el número de clientes en el LocalStorage
    function saveNoClientes(No){
        localStorage.setItem("NoClientes", No)
        localStorage.setItem("clienteActual", No)
    }
    return (
        <div className="pantalla-clientes">
            <Link to="/Meseros" style={{ textDecoration: 'none' }}><img className="img-cancelar" src={cancelar} /></Link>
            <h1>¿Cuántas personas hay?</h1> {/* Título de la pantalla */}
            <div>
                {/* Botón para regresar a la pantalla de Mesas */}
                <Link to="/Mesas" style={{ textDecoration: 'none' }}>
                    <button className="boton_Meseros">
                        🢀
                    </button>
                </Link>
            </div>
            <div class="flex-container-clientes">
                {/* Opciones para seleccionar el número de personas */}
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
// Exporta el componente Clientes
export default Clientes;  
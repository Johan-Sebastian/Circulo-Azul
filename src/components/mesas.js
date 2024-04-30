import React, { useEffect } from "react"; // Importa React y useEffect desde la biblioteca react
import "../css/mesas.css"; // Importa el archivo de estilos CSS para las mesas
import cancelar from '../assets/images/cancelar.png'; // Importa la imagen de cancelar desde la ruta de imágenes
import { Link } from "react-router-dom"; // Importa el componente Link de react-router-dom

// Definición del componente Mesas
const Mesas = () => {

    // Eliminar todas las keys del localStorage al cargar la página
    useEffect(() => {
        for (let key in localStorage) {
            if (key !== "Mesero") { // Verificar si la clave no es para Mesero
                localStorage.removeItem(key);
            }
        }
    }, []);

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
            <h1>Selecciona tu mesa</h1> {/* Título de la pantalla */}
            <div>
                <Link to="/Meseros" style={{ textDecoration: 'none' }}>
                    <button className="boton_Meseros"> {/* Botón para regresar a la pantalla de Meseros */}
                        🢀
                    </button>
                </Link>
            </div>
            {/* Opciones para seleccionar la mesa */}
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
// Exporta el componente Mesas
export default Mesas;  
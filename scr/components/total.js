import React, {useState , useEffect} from "react";
import "../css/total.css";
import terminar from "../assets/images/terminar.png";
import { Link } from "react-router-dom";

const Total = () => {
    //UseState para almacenar la lista generada
    const [total, seTotal] = useState(0);

    //Metodo para obtener el número de clientes
    useEffect(() => {
        var noCLientesStorage = localStorage.getItem('NoClientes');
        //setNoClientes(noCLientesStorage)
        seTotal(120*noCLientesStorage);
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
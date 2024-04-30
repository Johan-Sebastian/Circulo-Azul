import React, { useEffect, useState } from "react"; // Importa React desde la biblioteca react
import aceptar from "../assets/images/sucess.png"; // Importa la imagen de aceptar
import cancelar from "../assets/images/cancel.png" // Importa la imagen de cancelar
import "../css/ordencorrecta.css"; // Importa los estilos CSS para la pantalla de confirmación de orden
import registrarPedido from "./RegistrarPedido"; // Importa la función para registrar el pedido

import Box from '@mui/material/Box'; // Importa el componente Box de Material-UI
import Container from '@mui/material/Container'; // Importa el componente Container de Material-UI
import { Grid } from "@material-ui/core"; // Importa el componente Grid de Material-UI
import Stack from '@mui/material/Stack'; // Importa el componente Stack de Material-UI
import Button from '@mui/material/Button'; // Importa el componente Button de Material-UI

import { Link } from "react-router-dom"; // Importa el componente Link de React Router DOM

// Define el componente ConfirmarOrden
const ConfirmarOrden = () => {

  //UseState para almacenar la lista generada
  const [items, setItems] = useState([]);

  //Metodo para obtener la lista de ordenes
  useEffect(() => {
    var ordenesListStorage = localStorage.getItem('ordenesList'); // Obtiene la lista de órdenes del localStorage
    var ordenesList = [];
    ordenesList = JSON.parse(ordenesListStorage); // Convierte la lista de órdenes de JSON a objeto
    setItems(ordenesList) // Establece la lista de órdenes en el estado
  }, []);

  const seleccionarOpcion = (item) => {
    const clienteActual1 = item.clienteActual; // Obtiene el valor del cliente actual
    const Mesa1 = item.mesa; // Obtiene el valor de la mesa
    const NoClientes1 = item.noClientes; // Obtiene el valor del número de clientes
    const Platillo1 = item.platillo; // Obtiene el valor del platillo
    const imgPlatillo1 = item.imgPlatillo; // Obtiene la imagen del platillo
    const Bebida1 = item.bebida; // Obtiene el valor de la bebida
    const imgBebida1 = item.imgBebida; // Obtiene la imagen de la bebida
    const Fruta1 = item.fruta; // Obtiene el valor de la fruta
    const imgFruta1 = item.imgFruta; // Obtiene la imagen de la fruta
    const Observacion1 = item.observacion; // Obtiene el valor de la observación
    const Mesero1 = item.Mesero; // Obtiene el valor del mesero

    // Guardar datos localmente
    localStorage.setItem('clienteActual', clienteActual1); // Guarda el cliente actual en el localStorage
    localStorage.setItem('Mesa', Mesa1); // Guarda la mesa en el localStorage
    localStorage.setItem('NoClientes', NoClientes1); // Guarda el número de clientes en el localStorage
    localStorage.setItem('Platillo', Platillo1); // Guarda el platillo en el localStorage
    localStorage.setItem('imgPlatillo', imgPlatillo1); // Guarda la imagen del platillo en el localStorage
    localStorage.setItem('Bebida', Bebida1); // Guarda la bebida en el localStorage
    localStorage.setItem('imgBebida', imgBebida1); // Guarda la imagen de la bebida en el localStorage
    localStorage.setItem('Fruta', Fruta1); // Guarda la fruta en el localStorage
    localStorage.setItem('imgFruta', imgFruta1); // Guarda la imagen de la fruta en el localStorage
    localStorage.setItem('Observacion', Observacion1); // Guarda la observación en el localStorage
    localStorage.setItem('Mesero', Mesero1); // Guarda el mesero en el localStorage
  };
  
  return (
    <React.Fragment>
      <h1 className="titulo-orden">¿Es correcto?</h1>
      <Container display="grid" placecontent="center">

        {/* Mapea sobre cada item en la lista de órdenes */}
        {items.map((item) => (
          <Grid container> {/* Contenedor de Material-UI */}
            <Box className="caja" borderRadius={12} > {/* Caja con clase 'caja' y borde redondeado */}
              {/* Enlaces para editar los diferentes elementos del pedido */}
              <Link onClick={() => seleccionarOpcion(item)} to="/PlatillosEdit" style={{ textDecoration: 'none' }}>
                {/* Contenedor de Material-UI con clase 'margenes' */}
                <Grid container className="margenes">
                  <img className="img-redonda" src={item.imgPlatillo} width={"80%"} /><p className="platillos">{item.platillo}</p>
                </Grid>
              </Link>
              <Link onClick={() => seleccionarOpcion(item)} to="/BebidasEdit" style={{ textDecoration: 'none' }}>
                {/* Contenedor de Material-UI con clase 'margenes' */}
                <Grid container className="margenes">
                  <img className="img-redonda" src={item.imgBebida} width={"80%"} /><p className="platillos">{item.bebida}</p>
                </Grid>
              </Link>
              <Link onClick={() => seleccionarOpcion(item)} to="/FrutasEdit" style={{ textDecoration: 'none' }}>
                {/* Contenedor de Material-UI con clase 'margenes' */}
                <Grid container className="margenes">
                  <img className="img-redonda" src={item.imgFruta} width={"80%"} /><p className="platillos">{item.fruta}</p>
                </Grid>
              </Link>
              
            </Box>
          </Grid>
        ))}
      </Container>

      {/* Botones para cancelar la orden o confirmarla */}
      <Container >
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={4} marginTop="2%">
          <Button size="50 px" borderRadius={12} type="button"><Link to="/Mesas" style={{ textDecoration: 'none' }}><img className="btn-redonda" src={cancelar} /></Link></Button>
          <Button size="50 px" borderRadius={12} type="button"><Link onClick={() => registrarPedido(items)} to="/Total" style={{ textDecoration: 'none' }}><img className="btn-redonda" src={aceptar} /></Link></Button>
        </Stack>
      </Container>
    </React.Fragment>
  );
};
// Exporta el componente ConfirmarOrden
export default ConfirmarOrden;
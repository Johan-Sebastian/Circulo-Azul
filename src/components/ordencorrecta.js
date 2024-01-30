import React, { useEffect, useState } from "react";
import huevoestrellado from "../assets/images/Huevo-estrellado.png";
import jugonaranja from "../assets/images/Jugo-naranja.png";
import aceptar from "../assets/images/sucess.png";
import cancelar from "../assets/images/cancel.png"
import "../css/ordencorrecta.css";
import registrarPedido from "./RegistrarPedido";
import editarPedido from "./ListaPlatillosEdit";

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Grid } from "@material-ui/core";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { Link } from "react-router-dom";
import { render } from "@testing-library/react";


const ConfirmarOrden = () => {

  //UseState para almacenar la lista generada
  const [items, setItems] = useState([]);

  //Metodo para obtener la lista de ordenes
  useEffect(() => {
    var ordenesListStorage = localStorage.getItem('ordenesList');
    var ordenesList = [];
    ordenesList = JSON.parse(ordenesListStorage);
    setItems(ordenesList)
  }, []);

  const seleccionarOpcion = (item) => {
    const clienteActual1 = item.clienteActual;
    const Mesa1 = item.mesa; 
    const NoClientes1 = item.noClientes; 
    const Platillo1 = item.platillo;
    const imgPlatillo1 = item.imgPlatillo; 
    const Bebida1 = item.bebida; 
    const imgBebida1 = item.imgBebida;
    const Fruta1 = item.fruta;
    const imgFruta1 = item.imgFruta; 
    const Observacion1 = item.observacion;

    // Guardar datos localmente
    localStorage.setItem('clienteActual', clienteActual1);
    localStorage.setItem('Mesa', Mesa1);
    localStorage.setItem('NoClientes', NoClientes1);
    localStorage.setItem('Platillo', Platillo1);
    localStorage.setItem('imgPlatillo', imgPlatillo1);
    localStorage.setItem('Bebida', Bebida1);
    localStorage.setItem('imgBebida', imgBebida1);
    localStorage.setItem('Fruta', Fruta1);
    localStorage.setItem('imgFruta', imgFruta1);
    localStorage.setItem('Observacion', Observacion1);

  };
  
  return (
    <React.Fragment>
      <h1 className="titulo-orden">¿Es correcto?</h1>
      <Container display="grid" placecontent="center">

        {items.map((item) => (
          <Grid container>
            <Box className="caja" borderRadius={12} >
              <Link onClick={() => seleccionarOpcion(item)} to="/PlatillosEdit" style={{ textDecoration: 'none' }}>
                <Grid container className="margenes">
                  <img className="img-redonda" src={item.imgPlatillo} width={"80%"} /><p className="platillos">{item.platillo}</p>
                </Grid>
              </Link>
              <Link onClick={() => seleccionarOpcion(item)} to="/BebidasEdit" style={{ textDecoration: 'none' }}>
                <Grid container className="margenes">
                  <img className="img-redonda" src={item.imgBebida} width={"80%"} /><p className="platillos">{item.bebida}</p>
                </Grid>
              </Link>
              <Link onClick={() => seleccionarOpcion(item)} to="/FrutasEdit" style={{ textDecoration: 'none' }}>
                <Grid container className="margenes">
                  <img className="img-redonda" src={item.imgFruta} width={"80%"} /><p className="platillos">{item.fruta}</p>
                </Grid>
              </Link>
              
            </Box>
          </Grid>
        ))}
      </Container>

      <Container >
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={4} marginTop="2%">
          <Button size="50 px" borderRadius={12} type="button"><Link to="/Mesas" style={{ textDecoration: 'none' }}><img className="btn-redonda" src={cancelar} /></Link></Button>
          <Button size="50 px" borderRadius={12} type="button"><Link onClick={() => registrarPedido(items)} to="/Total" style={{ textDecoration: 'none' }}><img className="btn-redonda" src={aceptar} /></Link></Button>
        </Stack>
      </Container>
    </React.Fragment>
  );
};

export default ConfirmarOrden;
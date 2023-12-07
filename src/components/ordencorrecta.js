import React, { useEffect, useState } from "react";
import huevoestrellado from "../assets/images/Huevo-estrellado.png";
import jugonaranja from "../assets/images/Jugo-naranja.png";
import aceptar from "../assets/images/sucess.png";
import cancelar from "../assets/images/cancel.png"
import "../css/ordencorrecta.css";
import registrarPedido from "./RegistrarPedido";


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

  return (
    <React.Fragment>
      <h1 className="titulo-orden">¿Es correcto?</h1>
      <Container display="grid" placecontent="center">
          
            {items.map((item) => (
              <Grid container>
                <Box className="caja" borderRadius={12} >
                  <Grid container className="margenes">
                    <img className="img-redonda" src={item.imgPlatillo} width={"80%"} /><p className="platillos">{item.platillo}</p>
                  </Grid>
                  <Grid container className="margenes">
                    <img className="img-redonda" src={item.imgBebida} width={"80%"} /><p className="platillos">{item.bebida}</p>
                  </Grid>
                  <Grid container className="margenes">
                    <img className="img-redonda" src={item.imgFruta} width={"80%"} /><p className="platillos">{item.fruta}</p>
                  </Grid>
                  <Grid container className="margenes">
                    <p>Observaciones: {item.observacion}</p>
                  </Grid>
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
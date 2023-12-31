import React from "react";
import cocinero from "../assets/images/Cocinero.jpg";
import mesero from "../assets/images/Mesero.jpg";
import docente from "../assets/images/Maestra.jpg";
import "../css/menu1.css";

import { Grid } from "@material-ui/core";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { getAuth, signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { firebaseApp } from "../firebase/firebaseConfig";
import Button from "@material-ui/core/Button";
import { ColorLens } from "@material-ui/icons";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  textAlign: 'center',
}));

const auth = getAuth(firebaseApp);

const MenuUsuario = () => {
  return (
    <React.Fragment>
      <div className="header_Line">
          <hr className="line" />
          <h2 className="page_Title">Mi Circulo-Azul</h2>
      </div>
      <div className="header_Menu">
          {/* Otros elementos del encabezado */}
          <Button
            style={{ backgroundColor: "#b2dafa", fontWeight: "bolder" }}
            variant="contained"
            size="large"
            onClick={() => signOut(auth)}>
            Cerrar Sesión
          </Button>
      </div>
      <div class="container_Menu">
          <div class="options_Menu">
              <div class="option_Menu">
                  <Link to="/Cocina"><img src={cocinero} onClick="" />
                  <h3 className="titles_Menu">COCINA</h3></Link>
              </div>

              <div class="option_Menu" style={{ textDecoration: 'none' }}>
                  <Link to="/Docente"><img src={docente} onClick="" />
                  <h3 className="titles_Menu">DOCENTE</h3></Link>
              </div>
          </div>

          <div class="big-option_Menu">
              <Link to="/Meseros"><img src={mesero} onClick="" />
              <h3 className="titles_Menu">MESERO</h3></Link>
          </div>
      </div>
    </React.Fragment>
  );
};

export default MenuUsuario;